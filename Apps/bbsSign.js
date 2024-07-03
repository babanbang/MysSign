import { MysUtil } from '#MysTool/mys'
import { Cfg } from '#MysTool/utils'
import karin from 'node-karin'
import BbsSign from '../model/bbsSign.js'

const reg = Object.values(MysUtil.reg).join('|')
// export const bbsSign = karin.command(
//   new RegExp(`^(${reg}|崩坏3|崩坏2|未定事件簿|大别野|全部)?社区签到$`, 'i'),
//   async (e) => {
//     await new BbsSign(e).sign()
//     return true
//   },
//   { name: '社区签到', priority: 200 }
// )

// export const bbsSignTask = karin.command(
//   '^(开始)?社区签到任务',
//   (e) => {
//     new BbsSign(e).signTask(!!e?.msg)
//     return true
//   },
//   { name: '社区签到任务', priority: 200 }
// )

// export const Task = karin.task(
//   '社区签到任务',
//   Cfg.getConfig('cron', 'sign').bbsSignTask || '0 2 8 * * ?',
//   () => {
//     new BbsSign({}).signTask(false)
//     return true
//   }
// )
