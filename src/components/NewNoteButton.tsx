"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { addNote } from "@/lib/actions";

export default function NewNoteButton() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const create = async () => {
    setCreating(true);
    const id = await addNote();
    router.push(`/notes/${id}`);
  };

  return (
    <button className="btn btn-accent" onClick={create} disabled={creating}>
      <Plus size={14} /> {creating ? "Creating…" : "New document"}
    </button>
  );
}
