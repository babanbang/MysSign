import { Cfg, getDir, PluginName } from '#MysTool/utils'
import './model/mys/ApiMap.js'

const dir = getDir(import.meta.url)
Cfg.initCfg('/lib/components', dir.name + '/', 'sign')

logger.info(`${PluginName}-${dir.name}初始化~`)

export * from './Apps/handler.js'
export * from './Apps/mysSign.js'
