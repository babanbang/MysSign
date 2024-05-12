import ApiTool from '../ApiTool.js'
import { MysApi } from '#Mys.api'

export default class ApiBase {
  /**
   * @param {{mysApi: import('#Mys.api').MysApi}} args
   * @param {{geetest:{url,query?,body?,HeaderType?},times?:{url,query?,body?,HeaderType?}}} api
   * @param {{timeout?:number}} option
   */
  constructor (args, Id, api, option = {}) {
    this.geetest_id = Id + '_geetest'
    this.times_id = Id + '_times'

    const { res = '', mysApi = '', type = '' } = args
    this.mysApi = mysApi || this.getMysApi()
    this.type = type
    this.ApiTool = new ApiTool(mysApi.game, mysApi.server, {
      [this.geetest_id]: api.geetest,
      [this.times_id]: api.times
    })

    this.GeetestApi = res?.retcode === 10035
      ? { create: 'createGeetest', verify: 'verifyGeetest' }
      : { create: 'createVerification', verify: 'verifyVerification' }

    this.headers = {}
    if (mysApi.game === 'sr') {
      this.headers['x-rpc-challenge_game'] = '6'
    }
    this.option = option
  }

  getMysApi (mys = {}, option = {}) {
    return new MysApi(mys, option)
  }

  async create () {
    return await this.mysApi.getData(this.GeetestApi.create, {
      ApiTool: this.ApiTool,
      headers: this.headers
    })
  }

  /** @param {{challenge,validate}} verify  */
  async verify (data = {}, verify) {
    if (!verify?.validate) return false
    const res = await this.mysApi.getData(this.GeetestApi.verify, {
      ...verify,
      ApiTool: this.ApiTool,
      headers: this.headers
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
    const createData = await this.create()
    const validate = await this.Geetest(createData.data)
    return await this.verify(data, validate.data)
  }

  /** @param {{gt,challenge}} data  */
  async Geetest (data) {
    if (!data.challenge || !data.gt) return false

    return await this.mysApi.getData(this.geetest_id, {
      ...data,
      timeout: this.option.timeout || 30000,
      ApiTool: this.ApiTool
    })
  }
}
