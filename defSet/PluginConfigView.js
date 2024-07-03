import { Data } from "#MysTool/utils"
import path from "path"
const apis = (Data.readdir('model/apis', { Path: path.dirname(import.meta.url) }))
  .filter(p => !/(ApiBase|_default).js$/.test(p)).map(p => {
    p = p.replace('.js', '')
    return { name: p, value: p }
  })

export default [{
  name: 'MysSign 基础配置',
  file: 'MysSign-set.yaml',
  priority: 500,
  view: [{
    key: '启用的API列表',
    comment: '格式为：api(apis中的文件名):重试次数(默认1)',
    path: 'Apis',
    type: 'select',
    multiple: true,
    item: apis
  }, {
    key: '米游社签到任务',
    comment: '是否开启每日定时米游社签到任务',
    path: 'signTask',
    type: 'boolean',
  }]
}, {
  name: 'MysSign 定时任务配置',
  file: 'MysSign-cron.yaml',
  priority: 500,
  view: [{
    key: '米游社签到任务cron表达式',
    comment: '默认 0 2 6 * * ? (每天 6 点 2 分执行)',
    path: 'signTask',
    type: 'text',
  }]
}]