import karin from 'node-karin'
import { Cfg } from '#MysTool/utils'
import ValApis from '../model/ValApis.js'
import '../index.js'

export const validate = karin.handler(
  'mys.req.validate',
  async (args, reject) => {
    if (![1034, 5003, 10035, 10041].includes(Number(args?.res?.retcode))) {
      return reject()
    }

    const { Apis } = Cfg.getConfig('set', 'sign')
    if (!Apis?.length) return reject()

    for (const i of Apis) {
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

    return reject()
  }
)

export const geetest = karin.handler(
  'mys.req.geetest',
  async (args, reject) => {
    if (!args?.data?.gt || !args?.data?.challenge) {
      return reject()
    }

    const { Apis } = Cfg.getConfig('set', 'sign')
    if (!Apis?.length) return reject()

    for (const i of Apis) {
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

    return reject()
  }
)
