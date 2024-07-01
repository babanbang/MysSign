import { plugin } from '#Karin'
import { Cfg } from '#MysTool/utils'
import ValApis from '../model/ValApis.js'

export class MysValidateHandler extends plugin {
  constructor () {
    super({
      name: 'MysValidate',
      priority: 1000,
      handler: [
        {
          key: 'mys.req.validate',
          fnc: 'mysReqValidate'
        },
        {
          key: 'mys.req.geetest',
          fnc: 'Geetest'
        }
      ]
    })
    this.set = Cfg.getConfig('set', 'sign')
  }

  async mysReqValidate (args, reject) {
    if (![1034, 5003, 10035, 10041].includes(Number(args?.res?.retcode))) {
      return reject()
    }

    for (const i of this.set.Apis || []) {
      const [key, times = 1] = i.split(':')
      const Api = await ValApis.get(key)
      if (!Api) continue

      const api = new Api(args)
      if (!api.getData) continue

      for (let n = 0; n < Number(times); n++) {
        const result = await api.getData(args?.data)
        if (result?.retcode === 0 || result?.isvalidate) {
          return result
        }
      }
    }

    return false
  }

  async Geetest (args, reject) {
    if (!args?.data?.gt || !args?.data?.challenge) {
      return reject()
    }

    for (const i of this.set.Apis || []) {
      const [key, times = 1] = i.split(':')
      const Api = await ValApis.get(key)
      if (!Api) continue

      const api = new Api(args)
      if (!api.Geetest) continue

      const result = await api.Geetest(args.data)
      if (result?.data?.challenge && result?.data.validate) {
        return result.data
      }
    }

    return false
  }
}
