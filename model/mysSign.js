import { MysApi, MysUtil } from "#MysTool/mys"
import { MysUser, User } from "#MysTool/user"
import { Base, Cfg, Data } from "#MysTool/utils"
import { Bot, common, config, handler, logger, redis } from "node-karin"
import lodash from 'lodash'
import moment from 'moment'

let NoSignNum = 0
let FinishTime = ''
const userSign = {}
let MysSignIng = false
export default class MysSign extends Base {
  constructor (e = {}) {
    super(e, 'sign')
    this.set = Cfg.getConfig('set', this.game)
  }

  async sign () {
    if (MysSignIng) {
      this.e.reply(`签到任务进行中、暂时不可手动签到\n当前剩余${NoSignNum}个`)
      return false
    }

    if (userSign[this.e.user_id]) {
      this.e.reply('签到进行中，请稍等...', { at: true })
      return false
    }

    const user = await User.create(this.e, 'gs')

    const cks = []
    MysUtil.eachGame((game, ds) => {
      cks.push(
        ...user.getUidsData(game)
          .filter(ck => ck.ck)
          .map(ck => [{ ...ck, user_id: this.e.user_id }, ds])
      )
    })

    if (cks.length === 0) {
      this.e.reply('请绑定ccookie后再签到！')
      return false
    }

    this.e.reply('开始签到...', { at: true, recallMsg: 60 })

    userSign[this.e.user_id] = true
    setTimeout(() => {
      if (userSign[this.e.user_id]) delete userSign[this.e.user_id]
    }, 1000 * 40 * cks.length)

    const sendMsg = []
    for (const ck of cks) {
      let res = await this.startSign(...ck)
      if (res.ck) {
        res = await this.startSign(...res.ck)
      }
      sendMsg.push(res.msg)
      await common.sleep(5000)
    }

    if (userSign[this.e.user_id]) delete userSign[this.e.user_id]

    if (sendMsg.length > 3) {
      this.e.bot.sendForwardMessage(this.e.contact, common.makeForward(sendMsg))
    } else {
      this.e.reply(sendMsg.join('\n'), { at: true })
    }

    return true
  }

  async startSign (mys, game) {
    const log = `[${game.name}uid:${mys.uid}][user:${mys.user_id}]`
    const key = `${this.redisPrefix}${game.key}:is_sign:${mys.uid}`

    const mysApi = new MysApi(mys, { log: false })

    let isSigned = await redis.get(key)
    if (isSigned) {
      const reward = await this.getReward(isSigned, mysApi)
      return {
        retcode: 0, is_sign: true,
        msg: `\n${game.name}uid:${mys.uid}，今日已签\n第${isSigned}天奖励：${reward || '???'}`,
        gift: reward || '???', day: isSigned, txt: '今日已签'
      }
    }

    const signInfo = await mysApi.getData('sign_info')

    if (signInfo.retcode == -100 || (signInfo.retcode !== 0 && signInfo.message?.includes?.('请登录后重试'))) {
      if (!mys.isUp) {
        const mysUser = await MysUser.delCK(mys.ltuid)
        if (mysUser.ck) return { ck: [{ ...mys, ck: mysUser.ck, isUp: true }, game] }
      }
      logger.error(`[${game.name}签到失败]${log} 绑定cookie已失效`)
      return {
        retcode: -100, is_invalid: true,
        msg: '\n签到失败，绑定cookie已失效',
        txt: 'cookie失效'
      }
    }

    if (signInfo.first_bind)
      return {
        retcode: 100,
        msg: '\n签到失败：首次请先手动签到',
        txt: '签到失败'
      }

    if (signInfo?.retcode !== 0) {
      return {
        retcode: signInfo?.retcode || 1000,
        msg: `\n签到失败：${signInfo?.message || '未知错误'}`,
        txt: '签到失败'
      }
    }

    const SignInfo = signInfo.data

    if (SignInfo.is_sign) {
      const reward = await this.getReward(SignInfo.total_sign_day, mysApi)
      this.setCache(SignInfo.total_sign_day, key)
      logger.mark(`[今日已签]${log}`)
      return {
        retcode: 0, is_sign: true,
        msg: `\n${game.name}uid:${mys.uid}，今日已签\n第${SignInfo.total_sign_day}天奖励：${reward || '???'}`,
        gift: reward || '???', day: SignInfo.total_sign_day, txt: '今日已签'
      }
    }

    /**签到 */
    const sign = await this.doSign(mysApi, log)

    if (sign?.retcode && sign?.retcode === -100) {
      if (!mys.isUp) {
        const mysUser = await MysUser.delCK(mys.ltuid)
        if (mysUser.ck) return { ck: [{ ...mys, ck: mysUser.ck, isUp: true }, game] }
      }
      logger.error(`[${game.name}签到失败]${log} 绑定cookie已失效`)
      return {
        retcode: -100, is_invalid: true,
        msg: '\n签到失败，绑定cookie已失效',
        txt: 'cookie失效'
      }
    }

    if (sign.success) {
      let totalSignDay = SignInfo.total_sign_day
      if (!SignInfo.is_sign) totalSignDay++
      this.setCache(totalSignDay, key)

      let tips = '签到成功'
      if (sign.signed) tips = '今日已签'

      const reward = await this.getReward(totalSignDay, mysApi)
      return {
        retcode: 0,
        msg: `\n${game.name}uid:${mys.uid}，${tips}\n第${totalSignDay}天奖励：${reward || '???'}`,
        gift: reward || '???', day: totalSignDay, txt: '签到成功'
      }
    }

    return {
      retcode: sign.signMsg === 'Too Many Requests' ? 114514 : -1000,
      msg: `\n${game.name}uid:${mys.uid}，签到失败：${sign.signMsg}`,
      txt: '签到失败',
    }
  }

  async doSign (mysApi, log) {
    let sign = await mysApi.getData('sign')
    let signMsg = sign?.message ?? 'Too Many Requests'

    if (!sign || signMsg === 'Too Many Requests') {
      await common.sleep(30000)
      sign = await mysApi.getData('sign')
      signMsg = sign?.message ?? 'Too Many Requests'
    } else {
      await common.sleep(lodash.random(2000, 6000))
    }

    if (!sign || signMsg === 'Too Many Requests') {
      logger.mark(`[签到失败]${log}：${signMsg}`)
      return { success: false, signed: false, signMsg }
    }

    if (sign.retcode === -5003 || sign.data?.is_sign) {
      logger.mark(`[今日已签]${log}`)
      return { success: true, signed: true, signMsg: '' }
    }

    if (sign.data?.gt) {
      signMsg = '验证码失败'

      const res = await handler.call('mys.req.geetest', { e: this.e, data: sign.data })
      try {
        if (res?.validate) {
          sign = await mysApi.getData('sign', {
            headers: {
              'x-rpc-challenge': res.challenge,
              'x-rpc-validate': res.validate,
              'x-rpc-seccode': `${res.validate}|jordan`
            }
          })
          signMsg = sign?.message ?? 'Too Many Requests'

          if (sign?.retcode === 0 && (sign?.data?.success === 0 || sign?.data?.is_sign)) {
            logger.mark(`[签到成功]${log}:验证码成功`)
            return { success: true, signed: false, signMsg: '验证码成功' }
          }

          if (sign.retcode === -5003 || sign.data?.is_sign) {
            logger.mark(`[今日已签]${log}`)
            return { success: true, signed: true, signMsg: '' }
          }
        }
        logger.mark(`[签到失败]${log}：${signMsg}`)
        return { success: false, signed: false, signMsg, retcode: sign?.retcode || 114514 }
      } catch (error) {
        logger.error('签到异常：' + error)
        return { success: false, signed: false, signMsg: 'Too Many Requests' }
      }
    }

    if (sign?.retcode === 0 && (sign?.data?.success === 0 || sign?.data?.is_sign)) {
      logger.mark(`[签到成功]${log}`)
      return { success: true, signed: false, signMsg: '' }
    }

    logger.mark(`[签到失败]${log}：${signMsg}`)
    return { success: false, signed: false, signMsg, retcode: sign?.retcode || 114514 }
  }

  async getReward (signDay, mysApi) {
    const key = `${this.redisPrefix}${mysApi.game}:month_rewards`

    let rewards = await redis.get(key)

    if (rewards) {
      rewards = JSON.parse(rewards)
    } else {
      const res = await mysApi.getData('sign_home')
      if (res?.retcode !== 0) return false

      let data = res.data
      if (data?.awards?.length > 0) {
        rewards = data.awards

        let monthEnd = Number(moment().endOf('month').format('X')) - Number(moment().format('X'))
        redis.setEx(key, monthEnd, JSON.stringify(rewards))
      }
    }

    if (rewards?.length > 0) {
      const reward = rewards[signDay - 1] || ''
      if (reward?.name) return `${reward.name}×${reward.cnt || ''}`
    }

    return ''
  }

  setCache (day, key) {
    let end = Number(moment().endOf('day').format('X')) - Number(moment().format('X'))
    redis.setEx(key, end, String(day))
  }

  async signTask (manual) {
    if (!this.set.signTask && !manual) return false

    if (MysSignIng) {
      if (manual) {
        const time = ((Math.floor(Math.random() * 6000) + (Math.random() * 2000)) / 1000 + 16) * NoSignNum
        FinishTime = moment().add(SignTimes, 's').format('MM-DD HH:mm:ss')
        this.e.reply(`当前剩余${NoSignNum}个\n预计需要：${this.countTime(time)}\n预计完成时间：${FinishTime}`)
      }
      return false
    } else if (manual && !this.e.msg.includes('开始')) {
      this.e.reply('当前暂无签到任务')
      return false
    }

    const cks = lodash.fromPairs(MysUtil.games.map(game => [game.key, []]))
    await MysUser.forEach(mys => {
      const ck = mys.getLtuidData()
      MysUtil.eachGame((game, ds) => {
        const uids = mys.getUids(game)
        cks[game].push(...uids.map(uid => {
          return [{ uid, ...ck }, ds]
        }))
      })
    })

    const length = lodash.flattenDeep(Object.values(cks)).length / 2
    const { noSignNum, msgs } = await this.getSignNum(cks, length)
    if (length === 0 || noSignNum === 0) {
      if (manual) this.e.reply('当前暂无ck需要签到')
      return false
    }

    NoSignNum = noSignNum
    MysSignIng = true

    const START = moment().unix()
    const StarthMsg = ['【开始签到任务】', `总计${length}个、未签${noSignNum}个`, ...msgs]

    const SignTimes = ((Math.floor(Math.random() * 6000) + (Math.random() * 2000)) / 1000 + 16) * noSignNum
    FinishTime = moment().add(SignTimes, 's').format('MM-DD HH:mm:ss')
    StarthMsg.push(`预计需要：${this.countTime(SignTimes)}\n预计完成时间：${FinishTime}`)

    logger.mark(StarthMsg.join('\n'))

    if (manual) {
      this.e.reply(StarthMsg.join('\n'))
    } else {
      Bot.sendMsg('', { scene: 'friend', peer: config.master[0] }, StarthMsg.join('\n'))
    }

    const gameMap = lodash.fromPairs(MysUtil.games.map((game) => [game.key, 0]))
    for (const key of ['suc', 'finsh', 'fail', 'invalid']) {
      this[key + 'Num'] = { ...gameMap }
    }

    let idx = 1
    for (const [mys, game] of Object.values(cks).flat()) {
      logger.mark(`[米游社签到任务]第${idx++}个`)

      let result = await this.startSign(mys, game)
      if (result.ck) {
        result = await this.startSign(...result.ck)
      }
      this.result(result, game.key)

      await common.sleep(Math.floor(Math.random() * 6000) + 8000)
    }

    const END = moment().unix()
    const FinishMsg = [`【签到任务完成】\n总耗时：${this.countTime(END - START)}`]

    MysUtil.eachGame((game, ds) => {
      FinishMsg.push(`${ds.name}：\n成功：${this.sucNum[game]} | 已签：${this.finshNum[game]} | 失败：${this.failNum[game]}`)
      FinishMsg.push(`cookie失效：${this.invalidNum[game]}`)
    })

    logger.mark(FinishMsg.join('\n'))

    if (manual) {
      this.e.reply(FinishMsg.join('\n'))
    } else {
      Bot.sendMsg('', { scene: 'friend', peer: config.master[0] }, FinishMsg.join('\n'))
    }

    NoSignNum = 0
    MysSignIng = false
    FinishTime = ''

    return true
  }

  result (ret, key) {
    NoSignNum--

    if (ret.retcode === 0) {
      if (ret.is_sign) {
        this.finshNum[key]++
      } else {
        this.sucNum[key]++
      }
    } else {
      if (ret.is_invalid) {
        this.invalidNum[key]++
      } else {
        this.failNum[key]++
      }
    }
  }

  async getSignNum (cks, length) {
    let signNum = 0; const msgs = []

    await MysUtil.eachGame(async (game, DS) => {
      const len = cks[game].length
      await Data.forEach(cks[game], async ([ck, ds]) => {
        if (await redis.get(`${this.redisPrefix}${game}:is_sign:${ck.uid}`)) {
          lodash.pull(cks[game], [ck, ds])
          signNum++
        }
      })
      msgs.push(`【${DS.name}】：未签-${cks[game].length}; 已签-${len - cks[game].length}`)
    })

    let noSignNum = length - signNum
    noSignNum = noSignNum > 0 ? noSignNum : 0

    return { noSignNum, signNum, msgs }
  }

  countTime (time) {
    let hour = Math.floor((time / 3600) % 24)
    let min = Math.floor((time / 60) % 60)
    let sec = Math.floor(time % 60)
    let msg = ''
    if (hour > 0) msg += `${hour}小时`
    if (min > 0) msg += `${min}分钟`
    if (sec > 0) msg += `${sec}秒`
    return msg
  }
}