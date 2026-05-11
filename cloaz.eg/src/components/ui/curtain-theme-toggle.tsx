"use client";

import {
  useState,
  useCallback,
  useRef,
  type CSSProperties,
} from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Theme = "light" | "dark";

export interface ThemeToggleProps {
  /** Diameter of the icon button in px. Default: 36 */
  buttonSize?: number;
  /** Curtain animation duration in ms. Default: 600 */
  duration?: number;
  /** Called after each theme change completes */
  onThemeChange?: (theme: Theme) => void;
  /** Optional className for further styling */
  className?: string;
  /** Size of the icon */
  iconSize?: number;
}

// ─── Design tokens ────────────────────────────────────────────────────────────
// Using brand-specific colors from the app
const TOKENS: Record<Theme, Record<string, string>> = {
  light: {
    pageBg:    "#FFFFFF",
    btnBg:     "#FFFFFF",
    btnText:   "#010520",
    btnRing:   "rgba(1, 5, 32, 0.1)",
  },
  dark: {
    pageBg:    "#090B1E",
    btnBg:     "#090B1E",
    btnText:   "#FFFFFF",
    btnRing:   "rgba(255, 255, 255, 0.1)",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

type CurtainPhase = "idle" | "falling" | "rising";
const EASING = "cubic-bezier(0.76, 0, 0.24, 1)";

export function ThemeToggle({
  buttonSize   = 40,
  duration     = 600,
  onThemeChange,
  className = "",
  iconSize = 18,
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [phase, setPhase]     = useState<CurtainPhase>("idle");
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const curtainColorRef       = useRef<string>("");
  const t                     = TOKENS[theme];

  const toggle = useCallback(() => {
    if (phase !== "idle") return;
    const next: Theme = theme === "light" ? "dark" : "light";
    curtainColorRef.current = TOKENS[next].pageBg;
    setPhase("falling");

    setTimeout(() => {
      toggleTheme();
      onThemeChange?.(next);
      
      setPhase("rising");
      setTimeout(() => setPhase("idle"), duration + 60);
    }, duration);
  }, [phase, theme, duration, toggleTheme, onThemeChange]);

  const btnScale = pressed ? 0.96 : hovered ? 1.05 : 1;
  const btnStyle: CSSProperties = {
    transform: `scale(${btnScale})`,
    width: buttonSize,
    height: buttonSize,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: t.btnBg,
    color: t.btnText,
    boxShadow: `0 0 0 1.5px ${t.btnRing}`,
    zIndex: 9999,
    outline: "none",
    transition: "background 0.3s ease, color 0.3s ease, transform 0.15s ease, box-shadow 0.3s ease",
    flexShrink: 0,
  };

  const curtainStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    background: curtainColorRef.current,
    transformOrigin: "top",
    transform: phase === "falling" ? "scaleY(1)" : "scaleY(0)",
    transition: phase !== "idle" ? `transform ${duration}ms ${EASING}` : "none",
    zIndex: 1000000, // Very high z-index to cover everything
    pointerEvents: "none",
  };

  return (
    <>
      {/* Curtain overlay */}
      <div aria-hidden="true" style={curtainStyle} className="pointer-events-none" />

      <button
        style={btnStyle}
        onClick={toggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false); }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        className={className}
        aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      >
        {theme === "light" ? (
          <Moon size={iconSize} className="transition-transform duration-300" />
        ) : (
          <Sun size={iconSize} className="transition-transform duration-300" />
        )}
      </button>
    </>
  );
}
