import { Cfg, getDir } from '#Mys.tool'
Cfg.initCfg('/components/', getDir(import.meta.url).name, 'sign')

export * from './Apps/handler.js'
