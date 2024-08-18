import { Cfg, Data, GamePathType } from 'karin-plugin-mystool'
import { logger } from 'node-karin'

/** 初始化配置 */
Cfg.initCfg(GamePathType.Sign)

const pkg = Cfg.package(GamePathType.Sign)
const name = Data.getGamePath(GamePathType.Sign)
logger.info(`${logger.violet(`[插件:${pkg.version}]`)} ${logger.green(name)}初始化完成~`)