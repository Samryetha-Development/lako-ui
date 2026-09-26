# @lako/ui

Samryetha 产品家族的 React 组件。React 19 + TypeScript，原生 ESM，不依赖 Next.js。
通用控件自带带前缀的样式；授权组件单独提供入口。现有根入口继续兼容。

独立仓库：[Samryetha-Development/lako-ui](https://github.com/Samryetha-Development/lako-ui)。设计参考：[Samryetha Interface Guidelines](https://github.com/Samryetha-Development/Samryetha-Interface-Guidelines)。

## 安装与使用

源码独立维护，尚未发布到 npm。`private: true` 用于阻止误发 npm 包，与 GitHub 仓库可见性无关；可用 `pnpm pack` 生成的本地 tarball 安装。

```sh
pnpm add react@^19 react-dom@^19 ./lako-ui-0.1.0.tgz
```

```tsx
import { LakoButton, LakoInputBox, LakoTextarea } from "@lako/ui/components";
import "@lako/ui/ui.css";

export function ProjectForm() {
  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      console.log(data.get("name"));
    }}>
      <LakoInputBox name="name" label="项目名称" hint="向团队介绍你的项目" required />
      <LakoTextarea name="description" label="项目介绍" maxLength={240} />
      <LakoButton type="submit" variant="primary">保存</LakoButton>
    </form>
  );
}
```

## 组件目录

所有名称均以 `Lako` 为前缀，类型随组件导出。

| 分类 | 组件 | 主要 API |
| --- | --- | --- |
| 操作 | `LakoButton` | `variant`: primary / secondary / ghost / danger；`size`: sm / md / lg；`loading`；图标插槽；原生 button 属性与 ref |
| 表单 | `LakoInputBox` | label / hint / error；prefix / suffix；原生 input 属性与 ref |
| 表单 | `LakoTextarea` | label / hint / error；rows / maxLength；原生 textarea 属性与 ref |
| 表单 | `LakoCheckbox` | label / hint / error；indeterminate；原生 checked / defaultChecked / onChange / name / ref |
| 表单 | `LakoRadioGroup` | label；options `{ value, label, disabled? }`；value / defaultValue / onChange；name / required / disabled；orientation；variant: list / segmented（平面文字选择，以细下划线标记选中） |
| 表单 | `LakoToggle` | checked / onChange / ariaLabel / disabled |
| 选择 | `LakoDropdown` | 泛型 items / value / onChange；getKey / getLabel；useSearch / getSearchText / getDisabled |
| 导航 | `LakoTabs` | items / value / onChange / ariaLabel；滑动指示条、方向键及 Home / End |
| 浮层 | `LakoDialog` | open / onOpenChange；title / description / actions；dismissible / ariaLabel |
| 状态 | `LakoBadge` | tone: neutral / info / success / warning / danger |
| 反馈 | `LakoAlert` | tone / title / icon / actions；原生 div 属性；动态紧急错误可传 `role="alert"` |
| 反馈 | `LakoNotification`、`LakoNotifications` | message / tone；列表 items；通知生命周期由宿主管理 |
| 加载 | `LakoSpinner` | label；默认作为 status 宣读；尺寸可通过 CSS 覆盖 |
| 加载 | `LakoSkeleton` | 原生 div 属性与 style；装饰占位，请在加载区域设置 aria-busy |
| 内容 | `LakoEmptyState` | title / description / icon / actions |

输入控件的 `aria-describedby` 会合并调用方提供的 ID 和 hint/error ID。Checkbox / RadioGroup 保留原生表单语义；受控值在 form reset 时需要宿主同步重置。Button 默认 `type="button"`，表单提交需显式设置 `type="submit"`。仅图标按钮或无可见标签的输入框必须提供 `aria-label`。

选择控件使用 14px 透明轮廓与独立的 SVG 勾、横线或圆点，1px 边框沿用 Input 的 line/muted/accent token。选中态不铺色，不使用阴影或动效。`segmented` 保留原生 radio 语义，改用文字与 1px 下划线；没有外围胶囊或嵌套选中面板。键盘焦点使用独立的细轮廓，高对比模式保留系统可见状态。开发状态预览：`/selection-preview.html?theme=dark`（浅色使用 `theme=light`）。

Dropdown 通过 `useSearch?: boolean` 控制搜索，默认关闭；传 `useSearch={true}` 开启，传 `useSearch={false}` 关闭。旧属性 `searchable` 仍兼容，同时传入时以 `useSearch` 为准。Dropdown 是受控选择控件，不会自动提交表单值；需要提交时由宿主提供隐藏 input。Tabs 负责页签按钮，面板内容由宿主管理。Dialog 请提供 title 或 ariaLabel，SSR 首屏使用 `open={false}`。当前轻量 Dialog 面向单层弹窗；复杂嵌套场景仍使用主站的 Radix 原语。

## 主题与动效

只引入 `ui.css` 即可获得浅色默认样式，不需要全局 reset。颜色读取宿主的 `--bg` / `--surface` / `--surface-2` / `--ink` / `--muted` / `--faint` / `--line` / `--accent` / `--accent-fill` / `--accent-soft` / `--danger` / `--success` / `--warning` / `--on-accent`，字体读取 `--font`。

也可直接覆盖对应的 `--lako-ui-*`。局部主题应直接覆盖带前缀的变量；弹窗 Portal 挂在 body，主题变量须对 body 可见。深色主题由宿主提供，完整示例见 `playground/styles.css`。

动画尊重系统 `prefers-reduced-motion` 和祖先的 `data-reduce-motion="true"`。

## 授权入口

```tsx
import { LakoProvider, LakoLogin, LakoSelectAccount, LakoAuthError } from "@lako/ui/auth";
import "@lako/ui/auth.css";
```

授权组件需要 Lako API 及其会话环境。`LakoProvider` 支持 `origin`；无需授权功能的应用只使用 `/components` 与 `ui.css`。授权页面的既有行为保持不变。

## 开发、预览与打包

在此目录运行（Node.js 22.12+ 可运行展示页工具链）：

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev                  # http://127.0.0.1:5400
pnpm typecheck            # 同时检查组件与展示页
pnpm test                 # 构建 + SSR / 导出 / 表单语义测试
pnpm build:playground     # playground/dist 静态展示页
pnpm pack                 # prepack 自动检查与构建
```

`dist/` 是库产物，类型导出与 ESM 导出均指向 dist，CSS 独立导出。
npm 包白名单只包括 dist、CSS、README、LICENSE 等发布文件；展示页、测试和开发依赖不作为运行时代码发布。
发布操作及组织迁移见 [RELEASING.md](RELEASING.md)，本次检查范围见 [VALIDATION.md](VALIDATION.md)。

## 与 samryetha-ui-commons 的边界

`@lako/ui` 面向独立使用的带样式组件。`samryetha-ui-commons` 是主论坛现有 Button / Dialog / ConfirmDialog / Dropdown 的兼容原语，依赖主站 class 与 CSS，不能仅引入它的 styles.css 就获得主站视觉。本次不合并两者或批量替换宿主页面。

许可证沿用仓库的 [GNU AGPL v3](LICENSE)。
