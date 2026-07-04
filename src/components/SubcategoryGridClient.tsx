"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Ring, EmptyState } from "@/components/atoms";
import { IconPick } from "@/components/icons";
import SubcategoryForm from "@/components/SubcategoryForm";

type CardData = { id: string; name: string; icon: string; color: string; percent: number; trackerCount: number };

export default function SubcategoryGridClient({
  title,
  cards,
  basePath,
  dateQuery,
}: {
  title: string;
  cards: CardData[];
  basePath: string;
  dateQuery?: string;
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="row-between mb-16">
        <h2 className="h2">{title}</h2>
        <button className="btn btn-accent" onClick={() => setShowForm((v) => !v)}>
          <Plus size={14} /> New category
        </button>
      </div>
      {showForm && (
        <div className="mb-16">
          <SubcategoryForm onDone={() => setShowForm(false)} />
        </div>
      )}
      {cards.length === 0 && !showForm && <EmptyState title="No categories yet" sub="Create one to start tracking." />}
      <div className="grid-cards">
        {cards.map((sc) => (
          <Link
            key={sc.id}
            href={`${basePath}/${sc.id}${dateQuery ? `?date=${dateQuery}` : ""}`}
            className="card subcat-card"
            style={{ borderTop: `3px solid ${sc.color}` }}
          >
            <div className="ring-wrap">
              <Ring percent={sc.percent} color={sc.color} />
              <div className="ring-icon">
                <IconPick name={sc.icon} size={18} color={sc.color} />
              </div>
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="card-title">{sc.name}</div>
              <div className="card-sub">
                {sc.trackerCount} {sc.trackerCount === 1 ? "tracker" : "trackers"}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
