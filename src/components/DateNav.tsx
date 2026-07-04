import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { shiftDateISO, todayISO, formatDayNav } from "@/lib/dates";

export default function DateNav({ date }: { date: string }) {
  const prev = shiftDateISO(date, -1);
  const next = shiftDateISO(date, 1);
  const isToday = date >= todayISO();

  return (
    <div className="date-nav">
      <Link href={`/daily?date=${prev}`} className="btn-icon">
        <ChevronLeft size={15} />
      </Link>
      <div className="date-nav-label">{formatDayNav(date)}</div>
      {isToday ? (
        <span className="btn-icon" style={{ opacity: 0.4, pointerEvents: "none" }}>
          <ChevronRight size={15} />
        </span>
      ) : (
        <Link href={`/daily?date=${next}`} className="btn-icon">
          <ChevronRight size={15} />
        </Link>
      )}
      {date !== todayISO() && (
        <Link href="/daily" className="link-btn">
          Today
        </Link>
      )}
    </div>
  );
}
