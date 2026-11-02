import type { CSSProperties } from "react";
import "./hero-backdrop.css";

// Hero background: rows of logos in a staggered (brick) layout.
// Each row drifts sideways in the opposite direction of its neighbours, and its logos
// gently grow/shrink with a per-row delay, so a soft wave runs down the rows. Pure CSS (GPU transforms).
const ROWS = 9;
const TILES_PER_HALF = 16; // each row holds two identical halves so the drift loops seamlessly

export default function HeroBackdrop() {
  return (
    <div className="hero-backdrop" aria-hidden="true">
      <div className="hero-logo-rows">
        {Array.from({ length: ROWS }, (_, row) => (
          <div key={row} className={row % 2 ? "hero-logo-row reverse offset" : "hero-logo-row"} style={{ "--row": row } as CSSProperties}>
            {Array.from({ length: TILES_PER_HALF * 2 }, (_, index) => (
              <span key={index} className={`hero-logo-tile ${(row + index) % 2 === 0 ? "blue-logo" : "white-logo"}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
