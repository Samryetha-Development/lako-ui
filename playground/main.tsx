import { StrictMode, useEffect, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import {
  LakoAlert, LakoBadge, LakoButton, LakoCheckbox, LakoDialog, LakoDropdown,
  LakoEmptyState, LakoInputBox, LakoNotification, LakoRadioGroup, LakoSkeleton,
  LakoSpinner, LakoTabs, LakoTextarea, LakoToggle,
} from "../src/components.js";
import "../src/ui.css";
import "./styles.css";

function Section({ id, number, title, description, children }: { id: string; number: string; title: string; description: string; children: ReactNode }) {
  return <section id={id} className="catalog-section">
    <header><span className="section-number">{number}</span><div><h2>{title}</h2><p>{description}</p></div></header>
    <div className="section-content">{children}</div>
  </section>;
}

function App() {
  const [dark, setDark] = useState(() => new URLSearchParams(window.location.search).get("theme") === "dark");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("overview");
  const [project, setProject] = useState<string | null>("Samryetha");
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState("");
  const [created, setCreated] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);
  useEffect(() => {
    document.documentElement.dataset.reduceMotion = String(reducedMotion);
  }, [reducedMotion]);

  return <>
    <header className="topbar"><a className="brand" href="#">lako<span>/ ui</span></a><span className="topbar-note">SAMRYETHA · COMPONENT LIBRARY</span><div className="theme-control"><span>深色</span><LakoToggle checked={dark} onChange={setDark} ariaLabel="深色主题" /></div></header>
    <main>
      <div className="hero"><div className="eyebrow">DESIGN SYSTEM / 0.1</div><h1>从细节，构建一致。</h1><p>冷灰、雾蓝与恰好的留白。为 Samryetha 产品家族准备的 React 基础组件。</p><div className="hero-meta"><LakoBadge tone="info">React 19</LakoBadge><LakoBadge>TypeScript</LakoBadge><LakoBadge>独立样式</LakoBadge></div></div>
      <nav className="catalog-nav" aria-label="组件分类"><a href="#actions">操作</a><a href="#forms">表单</a><a href="#feedback">反馈</a><a href="#navigation">导航与浮层</a><a href="#states">内容状态</a></nav>
      <Section id="actions" number="01" title="操作 / Actions" description="明确的操作层级，统一的尺寸与反馈。">
        <div className="demo"><span className="demo-label">VARIANTS</span><div className="row"><LakoButton variant="primary">主要操作</LakoButton><LakoButton>次要操作</LakoButton><LakoButton variant="ghost">文字操作</LakoButton><LakoButton variant="danger">删除</LakoButton></div></div>
        <div className="demo"><span className="demo-label">SIZES & STATES</span><div className="row"><LakoButton size="sm">小尺寸</LakoButton><LakoButton>默认</LakoButton><LakoButton size="lg">大尺寸</LakoButton><LakoButton disabled>不可用</LakoButton><LakoButton loading>正在保存</LakoButton></div></div>
        <code>{'<LakoButton variant="primary" type="submit">保存</LakoButton>'}</code>
      </Section>
      <Section id="forms" number="02" title="表单 / Forms" description="标签、说明、校验与原生表单行为，组合在一起。">
        <form onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); setResult(`已读取：${data.get("name")} · ${data.get("visibility")} · 通知${data.has("updates") ? "开启" : "关闭"}`); }} onReset={() => setResult("")}>
          <div className="two-columns"><div className="stack"><LakoInputBox name="name" label="项目名称" defaultValue="Samryetha" hint="这个名称会显示在项目列表中。" required /><LakoInputBox label="校验状态" defaultValue="" error="请输入有效的项目标识。" aria-describedby="validation-context" /><span id="validation-context" className="caption">说明与错误信息会同时关联到输入框。</span><LakoInputBox label="不可编辑" defaultValue="由组织管理员管理" disabled /></div><div className="stack"><LakoTextarea name="description" label="项目介绍" placeholder="写下这个项目希望解决的问题…" hint="支持原生 maxLength、required、ref 与表单提交。" maxLength={240} /><LakoDropdown ariaLabel="项目" items={["Samryetha", "Lako", "Tasks", "i18n"]} value={project} onChange={setProject} getKey={(item) => item} getLabel={(item) => item} useSearch={true} searchPlaceholder="搜索项目" emptyLabel="没有匹配的项目" /></div></div>
          <div className="two-columns form-choices">
            <div className="stack">
              <LakoCheckbox name="updates" label="接收项目更新" hint="仅发送与你相关的动态。" defaultChecked />
              <LakoCheckbox label="部分选中" indeterminate={!checked} checked={checked} onChange={(event) => setChecked(event.target.checked)} />
              <LakoCheckbox label="由组织设置控制" disabled />
            </div>
            <LakoRadioGroup name="visibility" label="可见范围" variant="segmented" defaultValue="team" options={[
              { value: "team", label: "团队成员" },
              { value: "public", label: "所有人" },
              { value: "private", label: "仅自己", disabled: true },
            ]} />
          </div>
          <div className="row"><LakoButton type="submit" variant="primary">读取表单</LakoButton><LakoButton type="reset">重置</LakoButton><output aria-live="polite">{result}</output></div>
        </form>
      </Section>
      <Section id="feedback" number="03" title="反馈 / Feedback" description="用语义区分状态，让重要信息自然地被看见。">
        <div className="row"><LakoBadge>草稿</LakoBadge><LakoBadge tone="info">进行中</LakoBadge><LakoBadge tone="success">已完成</LakoBadge><LakoBadge tone="warning">待处理</LakoBadge><LakoBadge tone="danger">已失败</LakoBadge></div>
        <div className="two-columns"><LakoAlert title="准备好协作" tone="info">组件可以单独引入，也可以使用统一的主题变量。</LakoAlert><LakoAlert title="还有一项待完成" tone="warning">发布前确认组织范围与最终包名。</LakoAlert></div>
        <div className="two-columns"><LakoNotification message="变更已保存" tone="success" /><LakoNotification message="连接中断，请重试" tone="error" /></div>
      </Section>
      <Section id="navigation" number="04" title="导航与浮层 / Navigation" description="键盘可达的页签、可搜索选择器与对话框。">
        <LakoTabs ariaLabel="项目视图" value={tab} onChange={setTab} items={[{ id: "overview", label: "概览" }, { id: "members", label: "成员" }, { id: "activity", label: "动态" }, { id: "archived", label: "归档", disabled: true }]} />
        <p className="caption" aria-live="polite">当前视图：{({ overview: "概览", members: "成员", activity: "动态" } as Record<string, string>)[tab]}。可使用方向键、Home 和 End 切换。</p>
        <div className="row"><LakoButton onClick={() => setOpen(true)}>打开对话框</LakoButton><LakoCheckbox label="减少动态效果" checked={reducedMotion} onChange={(event) => setReducedMotion(event.target.checked)} /></div>
        <LakoDialog open={open} onOpenChange={setOpen} title="创建新项目" description="为团队留出一个清晰的协作空间。" actions={<><LakoButton onClick={() => setOpen(false)}>取消</LakoButton><LakoButton variant="primary" onClick={() => { setCreated(true); setOpen(false); }}>创建示例项目</LakoButton></>}><LakoInputBox label="项目名称" defaultValue="新的开始" /></LakoDialog>
      </Section>
      <Section id="states" number="05" title="内容状态 / Content states" description="加载中的耐心，空白时的方向。">
        <div className="two-columns"><div className="loading-demo" aria-busy="true" aria-label="加载中的内容"><div className="row"><LakoSpinner label="正在加载内容" /><span className="caption">正在加载内容</span></div><LakoSkeleton style={{ width: "65%" }} /><LakoSkeleton /><LakoSkeleton style={{ width: "85%" }} /></div>{created ? <LakoAlert tone="success" title="示例项目已创建" actions={<LakoButton size="sm" onClick={() => setCreated(false)}>恢复空状态</LakoButton>}>这是组件交互演示，数据仅保存在当前页面。</LakoAlert> : <LakoEmptyState title="还没有项目" description="从一个小想法开始，邀请团队一起把它变成现实。" icon="＋" actions={<LakoButton size="sm" onClick={() => setOpen(true)}>创建项目</LakoButton>} />}</div>
      </Section>
      <footer><span>Lako UI · Samryetha</span><span>通用组件入口 @lako/ui/components · 授权组件入口 @lako/ui/auth</span></footer>
    </main>
  </>;
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
