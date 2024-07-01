import { Base, Data } from "#MysTool/utils"
import { MysInfo, MysUtil } from "#MysTool/mys"
import _ from "lodash"

const userSign = {}
let BbsSignIng = false
let ForumData = {}
const reg = Object.values(MysUtil.reg).join('|')
export default class BbsSign extends Base {
  constructor (e) {
    super(e, 'sign')
    if (!ForumData) ForumData = Data.readJSON(`${this.GamePath()}defSet/mys.json`)
  }

  async sign () {
    const mysUsers = (await MysInfo.getMysUsers(this.e)).filter(mysUser => !mysUser.sk)

    if (mysUsers.length === 0) {
      this.e.reply('请【#扫码登录】绑定Stoken后再进行社区签到', { at: true })
      return false
    }

    const list = []
    const game = MysUtil.getGameByMsg(this.e.msg)
    if (!game) {
      const name = this.e.msg.match(/(崩坏3|崩坏2|未定事件簿|大别野|全部)/)?.[1]
      const data = ForumData.find(v => v.otherName.includes(name))
      if (data) {
        list.push(data)
      } else {
        list.push(...ForumData)
      }
    } else {
      list.push(ForumData.find(v => v.game == game.key))
    }

    const sendMsg = []
    const mysInfo = new MysInfo(this.e, 'bbs')
    for (const mysUser of mysUsers) {
      const mys = mysUser.getLtuidData('ltuid,sk')
      mysInfo.setMysApi({ uid: mys.ltuid, ...mys }, { log: false })


    }


  }

  async bbsSign (mysInfo, forumData, times = 5) {

  }

  async signTask (manual) {

  }
}