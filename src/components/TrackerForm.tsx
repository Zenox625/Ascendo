"use client";

import { useState } from "react";
import { Check, X, ImagePlus } from "lucide-react";
import { addTracker } from "@/lib/actions";
import { Field } from "@/components/atoms";
import { resizeImageFile } from "@/lib/image";
import { ASCENT_ACTIONS, type AscentCategory } from "@/lib/ascent";
import type { Tracker } from "@/types/tracking";

export default function TrackerForm({
  subcategoryId,
  ascentCategory,
  onCreated,
  onDone,
}: {
  subcategoryId: string;
  ascentCategory?: string | null;
  onCreated: (tracker: Tracker) => void;
  onDone: () => void;
}) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("min");
  const [dailyGoal, setDailyGoal] = useState("30");
  const [longTermGoal, setLongTermGoal] = useState("900");
  const [ascentPoints, setAscentPoints] = useState("10");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      setImage(await resizeImageFile(file, 320, 0.75));
    } catch {
      /* ignore */
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const created = await addTracker(
      subcategoryId,
      name.trim(),
      unit.trim() || "x",
      Number(dailyGoal) || 1,
      Number(longTermGoal) || null,
      image,
      Number(ascentPoints) || 10
    );
    setSaving(false);
    onCreated(created as Tracker);
    onDone();
  };

  const actions = ascentCategory ? ASCENT_ACTIONS[ascentCategory as AscentCategory] : undefined;
  const [pickedAction, setPickedAction] = useState<string | null>(null);

  const pickAction = (a: { name: string; unit: string; dailyGoal: number; points: number }) => {
    setName(a.name);
    setUnit(a.unit);
    setDailyGoal(String(a.dailyGoal));
    setAscentPoints(String(a.points));
    setPickedAction(a.name);
  };

  return (
    <div className="card form-card">
      {actions && actions.length > 0 && (
        <div className="mb-16">
          <div className="field-label">Quick pick ({ascentCategory})</div>
          <div className="icon-pick-row">
            {actions.map((a) => (
              <button
                key={a.name}
                type="button"
                className={`action-chip ${pickedAction === a.name ? "action-chip-active" : ""}`}
                onClick={() => pickAction(a)}
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="form-grid">
        <Field label="Name">
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Atomic Habits" />
        </Field>
        <Field label="Unit">
          <input className="input" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="min, pages, g…" />
        </Field>
        <Field label="Daily goal">
          <input className="input" type="number" value={dailyGoal} onChange={(e) => setDailyGoal(e.target.value)} />
        </Field>
        <Field label="Total goal">
          <input className="input" type="number" value={longTermGoal} onChange={(e) => setLongTermGoal(e.target.value)} />
        </Field>
        <Field label="Ascent points (on goal reached)">
          <input className="input" type="number" value={ascentPoints} onChange={(e) => setAscentPoints(e.target.value)} />
        </Field>
        <Field label="Cover image">
          <label className="upload-btn">
            {image ? <img src={image} className="upload-preview" alt="" /> : <ImagePlus size={15} />}
            {uploading ? "…" : image ? "Change photo" : "Upload photo"}
            <input type="file" accept="image/*" hidden onChange={handleFile} />
          </label>
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
