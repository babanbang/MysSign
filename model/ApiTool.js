import _ from 'lodash'

export default class ApiTool {
  constructor (game, server, api = {}) {
    this.api = api
    this.server = server
    this.app_key = game === 'sr' ? 'hkrpg_game_record' : ''
  }

  getUrlMap = (data = {}) => {
    let hostRecord
    let host = 'https://api-takumi.mihoyo.com/'
    if (['cn_gf01', 'cn_qd01', 'prod_gf_cn', 'prod_qd_cn'].includes(this.server)) {
      hostRecord = 'https://api-takumi-record.mihoyo.com/'
    } else if (['os_usa', 'os_euro', 'os_asia', 'os_cht'].includes(this.server)) {
      hostRecord = 'https://bbs-api-os.mihoyo.com/'
    }

    return {
      ...this.ApiReplace(data),
      createGeetest: {
        url: `${host}event/toolcomsrv/risk/createGeetest`,
        query: `is_high=true&app_key=${this.app_key}`
      },
      verifyGeetest: {
        url: `${host}event/toolcomsrv/risk/verifyGeetest`,
        body: {
          geetest_challenge: data.challenge,
          geetest_validate: data.validate,
          geetest_seccode: `${data.validate}|jordan`,
          app_key: this.app_key
        }
      },
      createVerification: {
        url: `${hostRecord}game_record/app/card/wapi/createVerification`,
        query: 'is_high=true'
      },
      verifyVerification: {
        url: `${hostRecord}game_record/app/card/wapi/verifyVerification`,
        body: {
          geetest_challenge: data.challenge,
          geetest_validate: data.validate,
          geetest_seccode: `${data.validate}|jordan`
        }
      }
    }
  }

  ApiReplace (data) {
    if (!data.gt || !data.challenge) return this.api

    const api = {}
    _.forEach(this.api, (value, id) => {
      api[id] = value
      api[id].query && api[id].query(data)
      api[id].body && api[id].body(data)
    })
    return api
  }
}
