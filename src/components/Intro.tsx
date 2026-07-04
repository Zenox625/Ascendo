"use client";

import { useState } from "react";
import { Sun, TrendingUp, Calendar, FileText, UserCircle } from "lucide-react";

const SECTIONS = [
  { href: "/daily", icon: Sun, label: "Daily goals" },
  { href: "/longterm", icon: TrendingUp, label: "Long-term goals" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/notes", icon: FileText, label: "Notes" },
  { href: "/profil", icon: UserCircle, label: "Profil" },
];

export default function Intro({ onEnterSection }: { onEnterSection: (href: string) => void }) {
  const [stage, setStage] = useState<"button" | "tiles">("button");
  const [exiting, setExiting] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(() => setStage("tiles"), 380);
  };

  const handleChoose = (href: string) => {
    setChosen(href);
    setTimeout(() => onEnterSection(href), 340);
  };

  return (
    <div className="intro-overlay">
      {stage === "button" ? (
        <button className={`intro-ascent-btn ${exiting ? "intro-ascent-exit" : ""}`} onClick={handleEnter}>
          Ascent
        </button>
      ) : (
        <div className={`intro-tiles-grid ${chosen ? "intro-tiles-exit" : ""}`}>
          {SECTIONS.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={s.href}
                className="intro-tile"
                style={{ animationDelay: `${i * 0.04}s` }}
                onClick={() => handleChoose(s.href)}
              >
                <Icon size={20} />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
