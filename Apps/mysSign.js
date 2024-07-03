import { MysUtil } from '#MysTool/mys'
import { Cfg } from '#MysTool/utils'
import karin from 'node-karin'
import MysSign from '../model/mysSign.js'

const reg = Object.values(MysUtil.reg).join('|')
export const mysSign = karin.command(
  new RegExp(`^#*(${reg}|全部)?(游戏)?签到$`, 'i'),
  async (e) => {
    await new MysSign(e).sign()
    return true
  }
)

export const mysSignTask = karin.command(
  '^#*(开始)?米游社签到任务',
  (e) => {
    new MysSign(e).signTask(!!e?.msg)
    return true
  }
)

export const Task = karin.task(
  '米游社签到任务',
  Cfg.getConfig('cron', 'sign').signTask || '0 2 6 * * ?',
  () => {
    new MysSign().signTask(false)
    return true
  }
)