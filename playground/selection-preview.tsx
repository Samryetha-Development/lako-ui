import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { LakoButton, LakoCheckbox, LakoInputBox, LakoRadioGroup } from "../src/components.js";
import "../src/ui.css";
import "./styles.css";

/** Isolated visual QA; leaves the accepted catalog and its layout untouched. */
function SelectionPreview() {
  const [mixed, setMixed] = useState(true);
  const options = [
    { value: "team", label: "Team" },
    { value: "public", label: "Everyone" },
    { value: "private", label: "Only me", disabled: true },
  ];
  useEffect(() => {
    document.documentElement.dataset.theme = new URLSearchParams(location.search).get("theme") === "dark" ? "dark" : "light";
  }, []);
  return <main style={{ maxWidth: 900, padding: 32 }}>
    <h1 style={{ fontSize: 24, marginTop: 0 }}>Selection controls</h1>
    <p className="caption">Lako UI · shared form semantics, restrained visual states</p>
    <div className="two-columns" style={{ marginTop: 32 }}>
      <div className="stack">
        <LakoInputBox label="Project name" defaultValue="Samryetha" />
        <div className="row"><LakoButton>Cancel</LakoButton><LakoButton variant="primary">Save</LakoButton></div>
      </div>
      <div className="stack">
        <LakoCheckbox label="Receive project updates" hint="Only updates that are relevant to you." defaultChecked />
        <LakoCheckbox label="Unchecked" />
        <LakoCheckbox label="Partially selected" indeterminate={mixed} onChange={() => setMixed(false)} />
        <LakoCheckbox label="Disabled" disabled />
        <LakoCheckbox label="Disabled checked" defaultChecked disabled />
        <LakoCheckbox label="Disabled mixed" indeterminate disabled />
      </div>
      <LakoRadioGroup label="Visibility · radio" name="radio-visibility" defaultValue="team" options={options} />
      <div className="stack">
        <LakoRadioGroup label="Visibility · compact" name="compact-visibility" variant="segmented" defaultValue="team" options={options} />
        <LakoRadioGroup label="Disabled group" name="disabled-visibility" variant="segmented" defaultValue="team" disabled options={options} />
      </div>
    </div>
  </main>;
}

createRoot(document.getElementById("root")!).render(<SelectionPreview />);
