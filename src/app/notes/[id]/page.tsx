import { notFound } from "next/navigation";
import { getNote } from "@/lib/data";
import NoteEditor from "@/components/NoteEditor";

export const dynamic = "force-dynamic";

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const note = await getNote(id);
  if (!note) notFound();
  return <NoteEditor key={note.id} note={note} />;
}
