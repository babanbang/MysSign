import { ApiTool, MysTool } from "#MysTool/mys"
import { Data } from "#MysTool/utils"
import lodash from 'lodash'

const ForumDatas = Data.readJSON('lib/components/MysSign/defSet/mys.json')
const Forum = lodash.keyBy(ForumDatas, 'game')

for (const game of ['gs', 'sr']) {
  ApiTool.setApiMap(game, function (data) {
    return {
      sign: {
        url: `${MysTool.web_api}event/luna/sign`,
        body: { lang: 'zh-cn', act_id: Forum[game].act_id, region: this.server, uid: this.uid },
        header: game == 'gs' ? { "x-rpc-signgame": "hk4e" } : {},
        HeaderType: 'MysSign'
      },
      sign_info: {
        url: `${MysTool.web_api}event/luna/info`,
        query: `lang=zh-cn&region=${this.server}&act_id=${Forum[game].act_id}&uid=${this.uid}`,
        header: game == 'gs' ? { "x-rpc-signgame": "hk4e" } : {},
        HeaderType: 'MysSign'
      },
      sign_home: {
        url: `${MysTool.web_api}event/luna/home`,
        query: `lang=zh-cn&act_id=${Forum[game].act_id}`,
        header: game == 'gs' ? { "x-rpc-signgame": "hk4e" } : {},
        HeaderType: 'MysSign'
      }
    }
  }, 'mys')
}

ApiTool.setApiMap('zzz', function (data) {
  return {
    sign: {
      url: `${MysTool.act_nap_api}event/luna/zzz/sign`,
      body: { lang: 'zh-cn', act_id: Forum['zzz'].act_id, region: this.server, uid: this.uid },
      header: { "x-rpc-signgame": "zzz" },
      HeaderType: 'MysSign'
    },
    sign_info: {
      url: `${MysTool.act_nap_api}event/luna/zzz/info`,
      query: `lang=zh-cn&region=${this.server}&act_id=${Forum['zzz'].act_id}&uid=${this.uid}`,
      header: { "x-rpc-signgame": "zzz" },
      HeaderType: 'MysSign'
    },
    sign_home: {
      url: `${MysTool.act_nap_api}event/luna/zzz/home`,
      query: `lang=zh-cn&act_id=${Forum['zzz'].act_id}`,
      header: { "x-rpc-signgame": "zzz" },
      HeaderType: 'MysSign'
    }
  }
}, 'mys')

ApiTool.setApiMap('bbs', function (data) {
  return {
    getUserState: {
      url: `${MysTool.bbs_api}apihub/sapi/getUserMissionsState`,
      HeaderType: 'Bbs'
    },
    signIn: {
      url: `${MysTool.bbs_api}apihub/app/api/signIn`,
      body: {
        gids: data.signId
      },
      HeaderType: 'BbsSign'
    },
    getCaptcha: {
      url: `${MysTool.bbs_api}misc/api/createVerification`,
      query: 'is_high=false',
      HeaderType: 'Bbs'
    },
    CaptchaVerify: {
      url: `${MysTool.bbs_api}misc/api/verifyVerification`,
      body: {
        geetest_challenge: data.challenge,
        geetest_validate: data.validate,
        geetest_seccode: `${data.validate}|jordan`
      },
      HeaderType: 'Bbs'
    },
    getPostList: {
      url: `${MysTool.bbs_api}post/api/getForumPostList`,
      query: `forum_id=${data.forumId}&is_good=false&is_hot=false&page_size=20&sort_type=1`,
      HeaderType: 'Bbs'
    },
    getPostFull: {
      url: `${MysTool.bbs_api}post/api/getPostFull`,
      query: `post_id=${data.postId}`,
      HeaderType: 'Bbs'
    },
    getShareConf: {
      url: `${MysTool.bbs_api}apihub/api/getShareConf`,
      query: `entity_id=${data.postId}&entity_type=1`,
      HeaderType: 'Bbs'
    },
    upVote: {
      url: `${MysTool.bbs_api}post/api/post/upvote`,
      body: {
        post_id: data.postId,
        is_cancel: false
      },
      HeaderType: 'Bbs'
    }
  }
}, 'mys')

ApiTool.setApiMap('gs', function (data) {
  return {
    sign: {
      url: `${MysTool.os_hk4e_sg_api}event/sol/sign`,
      body: { act_id: Forum['gs'].os_act_id, region: this.server, uid: this.uid },
      HeaderType: 'os_MysSign'
    },
    sign_info: {
      url: `${MysTool.os_hk4e_sg_api}event/sol/info`,
      query: `act_id=${Forum['gs'].os_act_id}&region=${this.server}&uid=${this.uid}`,
      HeaderType: 'os_MysSign'
    },
    sign_home: {
      url: `${MysTool.os_hk4e_sg_api}event/sol/home`,
      query: `act_id=${Forum['gs'].os_act_id}&region=${this.server}&uid=${this.uid}`,
      HeaderType: 'os_MysSign'
    }
  }
}, 'hoyolab')

ApiTool.setApiMap('sr', function (data) {
  return {
    sign: {
      url: `${MysTool.os_public_sg_api}event/luna/os/sign`,
      body: { act_id: Forum['sr'].os_act_id, region: this.server, uid: this.uid },
      HeaderType: 'os_MysSign'
    },
    sign_info: {
      url: `${MysTool.os_public_sg_api}event/luna/os/info`,
      query: `act_id=${Forum['sr'].os_act_id}&region=${this.server}&uid=${this.uid}`,
      HeaderType: 'os_MysSign'
    },
    sign_home: {
      url: `${MysTool.os_public_sg_api}event/luna/os/home`,
      query: `act_id=${Forum['sr'].os_act_id}&region=${this.server}&uid=${this.uid}`,
      HeaderType: 'os_MysSign'
    }
  }
}, 'hoyolab')

ApiTool.setApiMap('zzz', function (data) {
  return {
    sign: {
      url: `${MysTool.os_act_nap_api}event/luna/zzz/os/sign`,
      body: { act_id: Forum['zzz'].os_act_id, region: this.server, uid: this.uid },
      HeaderType: 'os_MysSign'
    },
    sign_info: {
      url: `${MysTool.os_act_nap_api}event/luna/zzz/os/info`,
      query: `act_id=${Forum['zzz'].os_act_id}&region=${this.server}&uid=${this.uid}`,
      HeaderType: 'os_MysSign'
    },
    sign_home: {
      url: `${MysTool.os_act_nap_api}event/luna/zzz/os/home`,
      query: `act_id=${Forum['zzz'].os_act_id}&region=${this.server}&uid=${this.uid}`,
      HeaderType: 'os_MysSign'
    }
  }
}, 'hoyolab')