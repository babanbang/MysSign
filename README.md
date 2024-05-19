> 请先确保你已经安装了[Karin](https://github.com/KarinJS/Karin)、[karin-plugin-MysTool](https://github.com/babanbang/karin-plugin-MysTool)

#### 克隆仓库
karin-plugin-MysTool目录执行以下命令克隆仓库到本地
>根据你的网络选择使用GitHub或Gitee
1. 使用GitHub
```bash
git submodule add -f  https://github.com/babanbang/mys.git ./components/MysSign
```
2. 使用Gitee
```bash
git submodule add -f  https://gitee.com/bbaban/mys.git ./components/MysSign
```

#### 如何使用
在karin-plugin-MysTool/components/index.js中添加以下内容(无此文件可无视)

```javascript
export * from './MysSign/index.js'
```
---

### 待完成功能
- [ ] mys签到
- [x] ~~更多API(请自行编写、本插件仅提供一个作为示范)~~