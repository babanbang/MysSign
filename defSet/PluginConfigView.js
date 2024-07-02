import { Data } from "#MysTool/utils"
const apis = (Data.readdir('model/apis', { Path: import.meta.url }))
  .filter(p => !['ApiBase.js', 'rrocr_default.js'].includes(p))
  .map(p => {
    p = p.replace('.js', '')
    return { name: p, value: p }
  })

export default [{
  name: 'MysSign 配置',
  file: 'MysSign-set.yaml',
  priority: 500,
  view: [{
    key: '启用的API列表',
    comment: '格式为：api(apis中的文件名):重试次数(默认1)',
    path: 'Apis',
    type: 'select',
    multiple: true,
    item: apis
  }]
}]