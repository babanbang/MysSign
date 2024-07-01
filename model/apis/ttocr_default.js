// 这是一个示范，如果要使用请重命名为ttocr.js
import ApiBase from './ApiBase.js'

/** http://www.ttocr.com/ */
const appkey = ''

const ID = 'ttocr'
export default class TTOCR extends ApiBase {
  constructor (args = {}) {
    super(args, ID, {
      geetest: {
        url: 'http://api.ttocr.com/api/recognize',
        query: (data) => { return `appkey=${appkey}&gt=${data.gt}&challenge=${data.challenge}&itemid=388&referer=https://webstatic.mihoyo.com` },
        HeaderType: 'noHeader'
      },
      times: {
        url: 'http://api.ttocr.com/api/points',
        query: () => { return `appkey=${appkey}` },
        HeaderType: 'noHeader'
      }
    })
  }

  static async times () {
    const ttocr = new TTOCR()
    const result = await ttocr.mysApi.getData(ttocr.times_id)
    if (result?.status === 1) {
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
