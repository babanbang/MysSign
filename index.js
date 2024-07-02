import { Cfg, getDir, PluginName } from '#MysTool/utils'
import './model/mys/ApiMap.js'

const dir = getDir(import.meta.url)
Cfg.initCfg('/lib/components', 'sign')

logger.info(`${PluginName}-${dir.name}初始化~`)
