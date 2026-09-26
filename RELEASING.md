# 构建与发布

源码仓库：<https://github.com/Samryetha-Development/lako-ui>。

## 开发

使用 Node.js 22.12+ 与 package.json 指定的 pnpm 版本：

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

组件源码位于 `src/`，交互与 SSR 测试位于 `tests/`，展示页位于 `playground/`。这是独立仓库，不需要 Samryetha 后端或其工作区依赖。

## 发布检查

```sh
pnpm typecheck
pnpm test
pnpm build:playground
pnpm pack
```

`prepack` 会再次执行类型检查、测试与库构建。tarball 包含 ESM、声明、CSS、README、LICENSE 和发布文档。node_modules、环境文件、测试、展示页及其构建产物不进入运行时包。

用实际 tarball 在空项目安装，检查根入口、`/components`、`/auth` 以及 CSS 子路径。运行展示页验证浅色、深色、选择、焦点、表单提交和重置。当前测试记录见 [VALIDATION.md](VALIDATION.md)。

## npm 发布

目前尚未发布到 npm，保留 `private: true`。GitHub 源码上传不会自动执行包发布。

正式发包前确认组织 npm scope、最终包名和 registry 可见性，再更新 name/version、移除 private 并配置对应 publishConfig。重新完成上述检查后发布。不在仓库中保存访问令牌。

## 与主仓库的关系

组件最初来自 [Samryetha](https://github.com/Samryetha-Development/Samryetha) 的 `lako/packages/ui`，沿用原仓库 LICENSE。主论坛的 `samryetha-ui-commons` 仍留在主仓库，依赖主站外观，不属于本包。
