"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteNote } from "@/lib/actions";

export default function NoteDeleteButton({ id }: { id: string }) {
  const [, startTransition] = useTransition();

  return (
    <button
      className="row-delete note-delete"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        startTransition(() => deleteNote(id));
      }}
    >
      <Trash2 size={13} />
    </button>
  );
}
