import { isSpotifyConnected } from "@/lib/spotify";
import SpotifySection from "@/components/SpotifySection";
import SpotifyDisconnect from "@/components/SpotifyDisconnect";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ spotify_connected?: string; spotify_error?: string }>;
}) {
  const params = await searchParams;
  const connected = await isSpotifyConnected();

  return (
    <div>
      <h2 className="h2 mb-16">Settings</h2>

      {params.spotify_connected && (
        <div className="card mb-16" style={{ borderColor: "var(--accent)" }}>
          Spotify connected.
        </div>
      )}
      {params.spotify_error && (
        <div className="card mb-16" style={{ borderColor: "var(--danger)" }}>
          Couldn&apos;t connect Spotify ({params.spotify_error}). Try again.
        </div>
      )}

      <div className="card form-card">
        <div className="row-between mb-16">
          <div>
            <div className="card-title">Spotify</div>
            <div className="card-sub">{connected ? "Connected" : "Not connected"}</div>
          </div>
          {connected ? (
            <SpotifyDisconnect />
          ) : (
            <a href="/api/spotify/login" className="btn btn-accent">Connect Spotify</a>
          )}
        </div>
        {connected && <SpotifySection />}
      </div>
    </div>
  );
}
