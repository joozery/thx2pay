"use client";

import { useI18n } from "@/i18n/useI18n";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

const storageKey = "thx2pay-theme";
const themeEvent = "thx2pay-theme-change";

function subscribe(onChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key !== storageKey && event.key !== null) return;
    document.documentElement.dataset.theme = event.newValue === "light" ? "light" : "dark";
    onChange();
  }
  window.addEventListener(themeEvent, onChange);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(themeEvent, onChange);
    window.removeEventListener("storage", handleStorage);
  };
}

function getSnapshot() {
  return document.documentElement.dataset.theme === "light";
}

export default function ThemeToggle() {
  const { t } = useI18n();
  const isLight = useSyncExternalStore(subscribe, getSnapshot, () => false);
  const label = isLight ? "เปลี่ยนเป็นธีมมืด" : "เปลี่ยนเป็นธีมสว่าง";

  function toggleTheme() {
    const theme = isLight ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // The theme still works when browser storage is unavailable.
    }
    window.dispatchEvent(new Event(themeEvent));
  }

  return (
    <button type="button" className="icon-button theme-toggle" aria-label={t(label)} title={t(label)} aria-pressed={isLight} onClick={toggleTheme}>
      {isLight ? <MoonIcon aria-hidden="true" /> : <SunIcon aria-hidden="true" />}
    </button>
  );
}
