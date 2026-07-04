"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Intro from "@/components/Intro";

const SESSION_KEY = "ascendo_intro_seen";

export default function IntroGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [stage, setStage] = useState<"loading" | "intro" | "app">("loading");

  useEffect(() => {
    // sessionStorage doesn't exist during server rendering, so this can only
    // be read client-side after mount — the standard pattern for gating on a
    // client-only value without a server/client hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStage(sessionStorage.getItem(SESSION_KEY) ? "app" : "intro");
  }, []);

  const handleEnterSection = (href: string) => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setStage("app");
    router.push(href);
  };

  if (stage === "loading") return null; // avoid a flash of content before we know
  if (stage === "intro") return <Intro onEnterSection={handleEnterSection} />;
  return <>{children}</>;
}
