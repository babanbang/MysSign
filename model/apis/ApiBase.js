import ApiTool from '../mys/ApiTool.js'
import { MysApi } from '#MysTool/mys'

export default class ApiBase {
  /**
   * @param {{mysApi: import('#MysTool/mys').MysApi}} args
   * @param {{geetest:{url,query?,body?,HeaderType?},times?:{url,query?,body?,HeaderType?}}} api
   * @param {{timeout?:number}} option
   */
  constructor (args, Id, api, option = {}) {
    this.geetest_id = Id + '_geetest'
    this.times_id = Id + '_times'
    const Apis = {}
    for (const key in api) {
      Apis[Id + '_' + key] = api[key]
      this[key + '_id'] = Id + '_' + key
    }

    const { res = '', mysApi = '', type = '' } = args
    this.e = args.e || {}

    this.type = type
    this.mysApi = mysApi || this.getMysApi()
    this.ApiTool = new ApiTool(mysApi.game, mysApi.server, Apis)

    this.GeetestApi = res?.retcode === 10035
      ? { create: 'createGeetest', verify: 'verifyGeetest' }
      : { create: 'createVerification', verify: 'verifyVerification' }

    this.headers = {}
    if (mysApi.game === 'sr') {
      this.headers['x-rpc-challenge_game'] = '6'
    }
    this.option = option
    this._res = res
  }

  getMysApi (mys = {}, option = {}) {
    return new MysApi(mys, option)
  }

  async create () {
    return await this.mysApi.getData(this.GeetestApi.create, {
      ApiTool: this.ApiTool,
      headers: this.headers,
      option: { log: false }
    })
  }

  /** @param {{challenge,validate}} verify  */
  async verify (data = {}, verify) {
    if (!verify?.validate) return false
    const res = await this.mysApi.getData(this.GeetestApi.verify, {
      ...verify,
      ApiTool: this.ApiTool,
      headers: this.headers,
      option: { log: false }
    })

    data.headers = {
      ...data.headers || {},
      'x-rpc-challenge': res?.data?.challenge
    }
    return {
      ...await this.mysApi.getData(this.type, data),
      isvalidate: true
    }
  }

  async getData (data = {}) {
    if ([5003, 10041].includes(this._res?.retcode)) return this._res
    // todo 这里或许可能需要再请求一下数据，确定retcode是否为0

    const createData = await this.create()
    const validate = await this.Geetest(createData.data)
    return await this.verify(data, validate.data)
  }

  /**
   *  @param {{gt,challenge}} data 
   *  @returns {Promise<{data: {gt?,challenge,validate}}>}
   */
  async Geetest (data) {
    if (!data.challenge || !data.gt) return false

    return await this.mysApi.getData(this.geetest_id, {
      ...data,
      timeout: this.option.timeout || 30000,
      ApiTool: this.ApiTool,
      option: { log: false }
    })
  }
}
