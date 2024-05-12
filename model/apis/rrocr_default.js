// 这是一个示范，如果要使用请重命名为rrocr.js
import ApiBase from './ApiBase.js'

/** http://www.rrocr.com/ */
const appkey = ''

const ID = 'rrocr'
export default class RROCR extends ApiBase {
  constructor (args = {}) {
    super(args, ID, {
      geetest: {
        url: 'http://api.rrocr.com/api/recognize.html',
        query: `appkey=${appkey}&gt={$gt}&challenge={$challenge}&referer=https://webstatic.mihoyo.com`,
        HeaderType: 'noHeader'
      },
      times: {
        url: 'http://api.rrocr.com/api/integral.html',
        query: `appkey=${appkey}`,
        HeaderType: 'noHeader'
      }
    })
  }

  static async times () {
    const rrocr = new RROCR()
    const result = await rrocr.mysApi.getData(rrocr.times_id)
    if (result?.status === 0) {
      return {
        api: ID,
        integral: result.integral
      }
    } else {
      return {
        api: ID,
        err_msg: result?.msg || '查询失败'
      }
    }
  }
}
