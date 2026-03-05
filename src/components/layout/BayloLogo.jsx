import Image from "next/image";

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
    sm: { imgSize: 26, text: "text-base" },
    md: { imgSize: 34, text: "text-xl" },
    lg: { imgSize: 50, text: "text-3xl" },
  };

  const { imgSize, text } = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="Baylo"
        width={imgSize}
        height={imgSize}
        className="bg-transparent"
        unoptimized
      />

      {showText && (
        <span className={`font-bold ${text} ${textClass}`}>Baylo</span>
      )}
    </div>
  );
}
