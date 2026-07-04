import { getAscentTotals } from "@/lib/data";
import { ASCENT_CATEGORIES, tierForPoints, globalAverage } from "@/lib/ascent";

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const totals = await getAscentTotals();
  const avg = globalAverage(totals);
  const avgTier = tierForPoints(avg.points);

  return (
    <div>
      <h2 className="h2 mb-16">Profil</h2>

      <div className="card form-card">
        <div className="row-between mb-10">
          <div>
            <div className="card-sub">Global rank</div>
            <div className="ascent-global-tier">{avgTier.name}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="card-sub">Average</div>
            <div className="ascent-global-score">{avg.pct}%</div>
          </div>
        </div>
        <div className="bar-track bar-track-lg">
          <div className="bar-fill" style={{ width: `${avg.pct}%`, background: "var(--accent)" }} />
        </div>
      </div>

      <div className="grid-cards">
        {ASCENT_CATEGORIES.map((cat) => {
          const points = totals[cat] ?? 0;
          const tier = tierForPoints(points);
          return (
            <div key={cat} className="card">
              <div className="row-between mb-10">
                <div className="card-title">{cat}</div>
                <span className="ascent-tier-badge">{tier.name}</span>
              </div>
              <div className="bar-track mb-10">
                <div className="bar-fill" style={{ width: `${tier.progressPct}%`, background: "var(--accent)" }} />
              </div>
              <div className="tracker-meta">
                {points} pts{tier.max !== null ? ` — ${tier.max - points} to next tier` : " — Ascent reached"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
