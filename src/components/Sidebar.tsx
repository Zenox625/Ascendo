"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, TrendingUp, Calendar, FileText, Settings, UserCircle } from "lucide-react";

const ITEMS = [
  { href: "/daily", icon: Sun, label: "Daily goals" },
  { href: "/longterm", icon: TrendingUp, label: "Long-term goals" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/notes", icon: FileText, label: "Notes" },
  { href: "/profil", icon: UserCircle, label: "Profil" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="sidebar">
      <div className="brand">ASCENDO</div>
      <div className="nav-list">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          const active = pathname.startsWith(it.href);
          return (
            <Link key={it.href} href={it.href} className={`nav-item ${active ? "nav-active" : ""}`}>
              <Icon size={16} />
              {it.label}
            </Link>
          );
        })}
      </div>
      <Link href="/settings" className={`nav-item ${pathname.startsWith("/settings") ? "nav-active" : ""}`}>
        <Settings size={16} />
        Settings
      </Link>
    </div>
  );
}
