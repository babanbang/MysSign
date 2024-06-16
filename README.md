> 请先确保你已经安装了[Karin](https://github.com/KarinJS/Karin)、[karin-plugin-MysTool](../../../karin-plugin-MysTool)

#### 克隆仓库
karin-plugin-MysTool目录执行以下命令克隆仓库到本地
>根据你的网络选择使用GitHub或Gitee
1. 使用GitHub
```bash
git clone --depth=1 https://github.com/babanbang/mys.git ./components/MysSign
```
2. 使用Gitee
```bash
git clone --depth=1 https://gitee.com/bbaban/mys.git ./components/MysSign
```

#### 如何使用
修改karin-plugin-MysTool/config/config/set.yaml
> (若无此文件请先启动Karin或手动复制karin-plugin-MysTool/config/defSet/set.yaml)
```yaml
plugins:
# 添加以下内容
  - MysSign
---

### 待完成功能
- [ ] mys签到
- [x] ~~更多API(请自行编写、本插件仅提供一个作为示范)~~