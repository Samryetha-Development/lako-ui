# 组织发布准备

当前仓库是 `Samryetha-Development/lako-ui`。组件库仍使用现有包名并保留 `private: true`，不会直接发布到 registry；Git 依赖安装通过 `prepare` 构建 `dist`。

## 当前结构

- 仓库根目录：完整带样式 React 库。
- `playground`：可独立构建的组件展示页，不依赖后端。
- 两个包的 LICENSE 均复制自当前仓库；没有更换许可证。

## 本地检查

在仓库根目录执行 `pnpm typecheck`、`pnpm test`、`pnpm build:playground`、`pnpm pack`。

将实际 tarball 安装到仓库以外的空项目中，验证：

1. `@lako/ui`、`@lako/ui/components`、`@lako/ui/auth` 的 ESM 和类型均能解析。
2. `ui.css`、`auth.css` 均存在。
3. React / React DOM 由消费者提供。
4. README 与 LICENSE 被包含；源码项目、环境文件、展示页构建产物不进入包。
5. 展示页在浅色、深色、手机宽度下可用；检查表单读取/重置、复选/单选、搜索、页签键盘、弹窗焦点与减弱动效。

现有宿主通过 workspace 或 file 引用，修改库后先构建，再重新安装 file 依赖，最后执行宿主 typecheck/build。新增导出使用 dist 类型，干净 checkout 也应先构建库。

## 实际发布时

核对组织名称和包可见性后，再设置最终 name/version、移除 `private`、配置与目标 registry 匹配的 publishConfig。重跑检查和打包后发布；目前没有添加绑定未知组织的发布 workflow 或访问令牌。

GitHub 组织仓库上传与 npm / GitHub Packages 发包是不同操作。确认目标后分别配置，不能用一次 git push 代替包发布。
