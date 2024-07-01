// 这是一个示范，如果要使用请重命名为ttocr.js
import ApiBase from './ApiBase.js'

/* http://www.ttocr.com/ */
const appkey = ''

/*
388	三代全类别	10
31	三代无感		5
32	三代滑块		5
33	三代点字		5
34	三代点图		5
35	三代语序		5
36	三代推理		10
37	三代九宫格	10
*/
const itemid = '388'

const ID = 'ttocr'
export default class TTOCR extends ApiBase {
  constructor (args = {}) {
    super(args, ID, {
      geetest: {
        url: 'http://api.ttocr.com/api/recognize',
        query: (data) => { return `appkey=${appkey}&gt=${data.gt}&challenge=${data.challenge}&itemid=${itemid}&referer=https://webstatic.mihoyo.com` },
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
