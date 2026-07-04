"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Trash2, Bold, Italic, Underline, Heading2, List } from "lucide-react";
import { updateNote, deleteNote } from "@/lib/actions";
import type { Note } from "@/types/tracking";

export default function NoteEditor({ note }: { note: Note }) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<{ title?: string; content?: string }>({});
  const [title, setTitle] = useState(note.title);

  const scheduleSave = (patch: { title?: string; content?: string }) => {
    pending.current = { ...pending.current, ...patch };
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      updateNote(note.id, pending.current);
      pending.current = {};
    }, 450);
  };

  const handleInput = () => scheduleSave({ content: ref.current?.innerHTML ?? "" });
  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    scheduleSave({ title: e.target.value });
  };
  const cmd = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value ?? undefined);
    ref.current?.focus();
    handleInput();
  };

  const remove = async () => {
    await deleteNote(note.id);
    router.push("/notes");
  };

  return (
    <div>
      <div className="row-between mb-16">
        <button className="btn btn-ghost" onClick={() => router.push("/notes")}>
          <ChevronLeft size={14} /> Back
        </button>
        <button className="row-delete" onClick={remove}>
          <Trash2 size={14} />
        </button>
      </div>
      <input className="note-title-input" value={title} onChange={handleTitle} placeholder="Untitled" />
      <div className="note-toolbar">
        <button className="btn-icon" onMouseDown={(e) => e.preventDefault()} onClick={() => cmd("bold")}>
          <Bold size={14} />
        </button>
        <button className="btn-icon" onMouseDown={(e) => e.preventDefault()} onClick={() => cmd("italic")}>
          <Italic size={14} />
        </button>
        <button className="btn-icon" onMouseDown={(e) => e.preventDefault()} onClick={() => cmd("underline")}>
          <Underline size={14} />
        </button>
        <button className="btn-icon" onMouseDown={(e) => e.preventDefault()} onClick={() => cmd("formatBlock", "H2")}>
          <Heading2 size={14} />
        </button>
        <button className="btn-icon" onMouseDown={(e) => e.preventDefault()} onClick={() => cmd("insertUnorderedList")}>
          <List size={14} />
        </button>
      </div>
      <div
        ref={ref}
        className="note-body"
        contentEditable
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: note.content || "" }}
        onInput={handleInput}
      />
    </div>
  );
}
