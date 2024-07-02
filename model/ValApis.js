import { Data } from '#MysTool/utils'
import chokidar from 'chokidar'

const ApiPath = import.meta.url
class ValApis {
  #apis = {}
  #watcher = {}

  async init (key) {
    const api = await Data.importDefault(`apis/${key}.js`, { Path: ApiPath })
    if (!api.module) return false

    this.#apis[key] = api.module
    this.watch(api.path, key)
    return this.#apis[key]
  }

  async get (key) {
    return this.#apis[key] || await this.init(key)
  }

  /** 监听API更新 */
  watch (file, key) {
    if (this.#watcher[key]) return

    const watcher = chokidar.watch(file)
    /** 监听修改 */
    watcher.on('change', async () => {
      delete this.#apis[key]
      logger.mark(`[MysSign修改Api][${key}]`)
    })
    /** 监听删除 */
    watcher.on('unlink', async () => {
      delete this.#apis[key]
      delete this.#watcher[key]
      logger.mark(`[MysSign卸载API][${key}]`)
    })
    this.#watcher[key] = watcher
  }
}

export default new ValApis()
