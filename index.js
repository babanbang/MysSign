import { Cfg, getDir } from '#MysTool/utils'
Cfg.initCfg('/components', getDir(import.meta.url).name + '/', 'sign')

export * from './Apps/handler.js'
