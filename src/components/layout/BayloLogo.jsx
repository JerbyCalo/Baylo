import { Globe } from "lucide-react";

/**
 * BayloLogo — reusable logo component.
 *
 * Props:
 *   size      — "sm" | "md" | "lg"  (default: "md")
 *   showText  — boolean              (default: true)
 *   textClass — Tailwind text-color class for the "Baylo" label
 *               (default: "text-white" for use on dark Navbar)
 */
export default function BayloLogo({
  size = "md",
  showText = true,
  textClass = "text-white",
}) {
  const sizeMap = {
    sm: { circle: "w-6 h-6", icon: "h-3 w-3", text: "text-base" },
    md: { circle: "w-8 h-8", icon: "h-4 w-4", text: "text-xl" },
    lg: { circle: "w-12 h-12", icon: "h-6 w-6", text: "text-3xl" },
  };

  const { circle, icon, text } = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${circle} flex shrink-0 items-center justify-center rounded-full bg-brand-yellow border-2 border-brand-gold`}
      >
        <Globe className={`${icon} text-brand-teal-dark`} />
      </div>

      {showText && (
        <span className={`font-bold ${text} ${textClass}`}>Baylo</span>
      )}
    </div>
  );
}
