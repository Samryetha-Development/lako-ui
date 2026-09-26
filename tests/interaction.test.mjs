import assert from "node:assert/strict";
import { after, test } from "node:test";
import { JSDOM } from "jsdom";
import { createElement as h, act, useState, createRef } from "react";
import { LakoButton, LakoCheckbox, LakoRadioGroup, LakoTextarea, LakoInputBox, LakoDialog } from "../dist/components.js";

const dom = new JSDOM("<!doctype html><html><body></body></html>", { pretendToBeVisual: true });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true });
window.matchMedia = () => ({ matches: true });
// React detects DOM event support at import time; install the DOM first.
const { createRoot } = await import("react-dom/client");
const browserErrors = [];
window.addEventListener("error", (event) => browserErrors.push(event.error));
after(() => dom.window.close());

async function mount(element, run) {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  try {
    await act(async () => root.render(element));
    await run(container);
    assert.deepEqual(browserErrors, [], "No uncaught DOM errors");
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
}

test("uncontrolled fields submit native values and reset their defaults", async () => {
  let submitted;
  await mount(h("form", { onSubmit: (event) => { event.preventDefault(); submitted = new window.FormData(event.currentTarget); } },
    h(LakoInputBox, { name: "name", label: "Name", defaultValue: "Original" }),
    h(LakoTextarea, { name: "description", label: "Description", defaultValue: "Notes" }),
    h(LakoCheckbox, { name: "updates", label: "Updates", defaultChecked: true }),
    h(LakoRadioGroup, { name: "scope", label: "Scope", variant: "segmented", defaultValue: "team", options: [{ value: "team", label: "Team" }, { value: "public", label: "Public" }] }),
    h(LakoButton, { type: "submit" }, "Submit")), async (container) => {
    await act(async () => {
      container.querySelector('[name="name"]').value = "Changed";
      container.querySelector('[name="description"]').value = "Updated";
      container.querySelector('[type="checkbox"]').click();
      container.querySelector('[value="public"]').click();
      container.querySelector("button").click();
    });
    assert.equal(submitted.get("name"), "Changed");
    assert.equal(submitted.get("description"), "Updated");
    assert.equal(submitted.has("updates"), false);
    assert.equal(submitted.get("scope"), "public");
    await act(async () => container.querySelector("form").reset());
    const reset = new window.FormData(container.querySelector("form"));
    assert.equal(reset.get("name"), "Original");
    assert.equal(reset.get("description"), "Notes");
    assert.equal(reset.has("updates"), true);
    assert.equal(reset.get("scope"), "team");
  });
});

test("controlled checkbox toggles, forwards refs, and exposes indeterminate state", async () => {
  const ref = createRef();
  function Demo() {
    const [checked, setChecked] = useState(false);
    return h(LakoCheckbox, { ref, label: "Select", checked, indeterminate: !checked, onChange: (event) => setChecked(event.target.checked) });
  }
  await mount(h(Demo), async () => {
    assert.equal(ref.current.indeterminate, true);
    await act(async () => ref.current.click());
    assert.equal(ref.current.checked, true);
    assert.equal(ref.current.indeterminate, false);
  });
  assert.equal(ref.current, null);
});

test("loading buttons cannot trigger handlers or submit their form", async () => {
  let count = 0;
  await mount(h(LakoButton, { loading: true, onClick: () => count++ }, "Save"), async (container) => {
    await act(async () => container.querySelector("button").click());
    assert.equal(count, 0);
  });
});

for (const variant of ["list", "segmented"]) {
  test(`${variant} radio labels select exactly one native field and respect disabled options`, async () => {
    const changes = [];
    function Demo() {
      const [value, setValue] = useState("team");
      return h("form", null, h(LakoRadioGroup, {
        label: "Visibility", name: "visibility", variant, value,
        onChange: (next) => { changes.push(next); setValue(next); },
        options: [{ value: "team", label: "Team" }, { value: "public", label: "Public" }, { value: "private", label: "Private", disabled: true }],
      }));
    }
    await mount(h(Demo), async (container) => {
      const labels = container.querySelectorAll("label");
      await act(async () => labels[1].querySelector(".lako-ui-choice-label").click());
      assert.deepEqual(changes, ["public"]);
      assert.equal(container.querySelectorAll("input:checked").length, 1);
      assert.equal(new window.FormData(container.querySelector("form")).get("visibility"), "public");
      await act(async () => labels[2].click());
      assert.deepEqual(changes, ["public"]);
      const selected = container.querySelector("input:checked");
      selected.focus();
      assert.equal(document.activeElement, selected);
      assert.equal(selected.tabIndex, 0);
    });
  });
}

test("dialog closes on Escape and returns focus to its trigger", async () => {
  function Demo() {
    const [open, setOpen] = useState(false);
    return h("div", null,
      h(LakoButton, { onClick: () => setOpen(true) }, "Open"),
      h(LakoDialog, { open, onOpenChange: setOpen, title: "Dialog" }, h(LakoInputBox, { label: "Name" })));
  }
  await mount(h(Demo), async (container) => {
    const trigger = container.querySelector("button");
    trigger.focus();
    await act(async () => trigger.click());
    await act(async () => new Promise((resolve) => window.requestAnimationFrame(resolve)));
    assert.equal(document.activeElement.tagName, "INPUT");
    await act(async () => document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
    assert.equal(document.querySelector('[role="dialog"]'), null);
    assert.equal(document.body.style.overflow, "");
    assert.equal(document.activeElement, trigger);
  });
});
