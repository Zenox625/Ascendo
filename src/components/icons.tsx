import { BookOpen, Dumbbell, Music, Target, Brain, Heart, Briefcase, Sparkles } from "lucide-react";

export const ICONS: Record<string, typeof Target> = {
  book: BookOpen,
  dumbbell: Dumbbell,
  music: Music,
  target: Target,
  brain: Brain,
  heart: Heart,
  briefcase: Briefcase,
  sparkles: Sparkles,
};
export const ICON_KEYS = Object.keys(ICONS);
export const PALETTE = ["#5B8DEF", "#E2703A", "#A47DE0", "#3FB78C", "#D4527A", "#4FB0C6", "#C9A227", "#7C8C4B"];

export function IconPick({ name, size = 16, color }: { name: string; size?: number; color?: string }) {
  const Cmp = ICONS[name] ?? Target;
  return <Cmp size={size} color={color} />;
}
