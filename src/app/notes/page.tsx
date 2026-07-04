import Link from "next/link";
import { FileText } from "lucide-react";
import { getNotes } from "@/lib/data";
import { EmptyState } from "@/components/atoms";
import NewNoteButton from "@/components/NewNoteButton";
import NoteDeleteButton from "@/components/NoteDeleteButton";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const notes = await getNotes();

  return (
    <div>
      <div className="row-between mb-16">
        <h2 className="h2">Notes</h2>
        <NewNoteButton />
      </div>
      {notes.length === 0 && <EmptyState title="No documents yet" sub="Create your first document." />}
      <div className="grid-cards">
        {notes.map((n) => {
          const preview = (n.content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 110);
          return (
            <Link key={n.id} href={`/notes/${n.id}`} className="card note-card">
              <NoteDeleteButton id={n.id} />
              <FileText size={16} className="note-icon" />
              <div className="card-title">{n.title || "Untitled"}</div>
              <div className="note-preview">{preview || "—"}</div>
              <div className="card-sub">Edited {new Date(n.updated_at).toLocaleDateString()}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
