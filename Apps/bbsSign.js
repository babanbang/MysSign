import { plugin } from '#Karin'
import { MysUtil } from '#MysTool/mys'
import { Cfg } from '#MysTool/utils'
import BbsSign from '../model/bbsSign.js'

const reg = Object.values(MysUtil.reg).join('|')
export class bbsSign extends plugin {
  constructor () {
    super({
      name: '社区签到',
      dsc: '社区签到',
      event: 'message',
      priority: 200,
      rule: [{
        reg: new RegExp(`^(${reg}|崩坏3|崩坏2|未定事件簿|大别野|全部)?社区签到$`, 'i'),
        fnc: 'bbsSign'
      }, {
        reg: '^(开始)?社区签到任务',
        fnc: 'bbsSignTask',
        permission: 'master'
      }],
      task: [{
        name: '社区签到任务',
        fnc: 'bbsSignTask',
        cron: Cfg.getConfig('cron', 'sign').bbsSignTask || '0 2 8 * * ?'
      }]
    })
  }

  bbsSign () {
    new BbsSign(this.e).sign()
    return true
  }

  bbsSignTask () {
    new BbsSign(this.e).signTask(!!this.e?.msg)
    return true
  }
}