import { plugin } from '#Karin'
import { MysUtil } from '#MysTool/mys'
import { Cfg } from '#MysTool/utils'
import MysSign from '../model/mysSign.js'

const reg = Object.values(MysUtil.reg).join('|')
export class mysSign extends plugin {
  constructor () {
    super({
      name: '米游社签到',
      dsc: '米游社签到',
      event: 'message',
      priority: 200,
      rule: [{
        reg: new RegExp(`^#*(${reg}|全部)?(游戏)?签到$`, 'i'),
        fnc: 'sign'
      }, {
        reg: '^#*(开始)?米游社签到任务',
        fnc: 'signTask',
        permission: 'master'
      }],
      task: [{
        name: '米游社签到任务',
        fnc: 'signTask',
        cron: Cfg.getConfig('cron', 'sign').signTask || '0 2 6 * * ?'
      }]
    })
  }

  sign () {
    new MysSign(this.e).sign()
    return true
  }

  signTask () {
    new MysSign(this.e).signTask(!!this.e?.msg)
    return true
  }
}