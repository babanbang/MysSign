import { Cfg, getDir } from '#MysTool/utils'
Cfg.initCfg('/lib/components', getDir(import.meta.url).name + '/', 'sign')

export * from './Apps/handler.js'
