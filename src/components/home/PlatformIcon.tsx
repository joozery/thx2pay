import type { Platform } from "./types";

export default function PlatformIcon({ platform }: { platform: Platform }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {platform === "Mobile" ? <><rect x="6.5" y="2" width="11" height="20" rx="2.5" /><path d="M10 5h4m-3 14h2" /></>
        : platform === "Console" ? <><path d="M8 7h8c2.3 0 3.5 1.5 4 3.5l1.3 6c.6 2.8-1.6 4-3.3 2l-2.5-3h-7l-2.5 3c-1.7 2-3.9.8-3.3-2l1.3-6C4.5 8.5 5.7 7 8 7Z" /><path d="M7.5 10v4m-2-2h4m6.5-1h.01m2 2h.01M12 7V4" /></>
        : platform === "PC Games" ? <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8m-4-4v4M2 13h20" /></>
        : <><rect x="2" y="6" width="20" height="15" rx="2" /><path d="M2 11h20M12 6v15m0-15H8.5A2.5 2.5 0 1 1 11 3.5L12 6Zm0 0h3.5A2.5 2.5 0 1 0 13 3.5L12 6Z" /></>}
    </svg>
  );
}
