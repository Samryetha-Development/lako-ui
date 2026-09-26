import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import test from "node:test";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as ui from "../dist/components.js";
import * as root from "../dist/index.js";

const render = (Component, props, children) => renderToStaticMarkup(h(Component, props, children));

test("all public entrypoints resolve to distributable files; legacy exports survive", () => {
  const manifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  for (const target of Object.values(manifest.exports)) {
    for (const path of typeof target === "string" ? [target] : Object.values(target)) {
      assert.ok(existsSync(new URL(`../${path}`, import.meta.url)), path);
    }
  }
  for (const name of ["LakoProvider", "useLako", "LakoLogin", "LakoSelectAccount", "LakoAuthError", "LakoDropdown", "LakoDialog", "LakoNotification", "LakoNotifications", "LakoTabs", "LakoInputBox", "LakoToggle"]) {
    assert.ok(root[name], name);
  }
  assert.equal(ui.LakoLogin, undefined);
});

test("buttons do not accidentally submit forms and block duplicate loading actions", () => {
  assert.match(render(ui.LakoButton, {}, "Save"), /type="button"/);
  assert.match(render(ui.LakoButton, { type: "submit" }, "Save"), /type="submit"/);
  const loading = render(ui.LakoButton, { loading: true }, "Saving");
  assert.match(loading, /disabled=""/);
  assert.match(loading, /aria-busy="true"/);
  assert.match(loading, /Saving/);
});

for (const name of ["LakoInputBox", "LakoTextarea", "LakoCheckbox"]) {
  test(`${name} preserves external descriptions and prioritizes validation over hints`, () => {
    const html = render(ui[name], { id: "project", label: "Project", hint: "Hint", error: "Required", "aria-describedby": "context", name: "project" });
    assert.match(html, /for="project"/);
    assert.match(html, /aria-describedby="context project-help"/);
    assert.match(html, /aria-invalid="true"/);
    assert.match(html, /id="project-help">Required/);
    assert.doesNotMatch(html, />Hint</);
    assert.match(html, /name="project"/);
    assert.doesNotMatch(render(ui[name], { id: "empty", label: "Empty" }), /aria-describedby=/);
  });
}

test("checkbox mixed state remains accessible in server markup", () => {
  assert.match(render(ui.LakoCheckbox, { label: "Select all", indeterminate: true }), /aria-checked="mixed"/);
});

test("radio groups preserve names, default selection and native disabled semantics", () => {
  const html = render(ui.LakoRadioGroup, { name: "scope", label: "Visibility", defaultValue: "team", disabled: true, options: [{ value: "team", label: "Team" }, { value: "public", label: "Public" }] });
  assert.match(html, /<fieldset disabled=""/);
  assert.match(html, /<legend>Visibility<\/legend>/);
  assert.equal((html.match(/name="scope"/g) ?? []).length, 2);
  assert.equal((html.match(/checked=""/g) ?? []).length, 1);
  assert.match(html, /checked="" value="team"/);
});

test("status announcements are opt-in, spinners are named and skeletons decorative", () => {
  assert.doesNotMatch(render(ui.LakoAlert, { title: "Information" }), /role="alert"/);
  assert.match(render(ui.LakoAlert, { title: "Failure", role: "alert" }), /role="alert"/);
  const spinner = render(ui.LakoSpinner, { label: "Loading projects" });
  assert.match(spinner, /role="status"/);
  assert.match(spinner, /Loading projects/);
  assert.match(render(ui.LakoSkeleton), /aria-hidden="true"/);
});
