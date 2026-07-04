"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { addSubcategory } from "@/lib/actions";
import { Field } from "@/components/atoms";
import { IconPick, ICON_KEYS, PALETTE } from "@/components/icons";

export default function SubcategoryForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(ICON_KEYS[0]);
  const [color, setColor] = useState(PALETTE[0]);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await addSubcategory(name.trim(), icon, color);
    setSaving(false);
    onDone();
  };

  return (
    <div className="card form-card">
      <div className="form-grid">
        <Field label="Name">
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Reading" />
        </Field>
        <Field label="Icon">
          <div className="icon-pick-row">
            {ICON_KEYS.map((k) => (
              <button key={k} type="button" className={`icon-pick ${icon === k ? "icon-pick-active" : ""}`} onClick={() => setIcon(k)}>
                <IconPick name={k} size={15} />
              </button>
            ))}
          </div>
        </Field>
        <Field label="Color">
          <div className="swatch-row">
            {PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                className="swatch"
                style={{ background: c, outline: color === c ? "2px solid var(--text)" : "none", outlineOffset: 2 }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </Field>
      </div>
      <div className="row-gap mt-12">
        <button className="btn btn-accent" onClick={submit} disabled={saving}>
          <Check size={14} /> {saving ? "Creating…" : "Create"}
        </button>
        <button className="btn btn-ghost" onClick={onDone}>
          <X size={14} /> Cancel
        </button>
      </div>
    </div>
  );
}
