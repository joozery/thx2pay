"use client";

import { DropdownMenu } from "radix-ui";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import "./language-switcher.css";

export default function LanguageSwitcher() {
  const { t, language, changeLanguage } = useI18n();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="locale-trigger" type="button" aria-label={t("ภาษา")}>
          <span className={`fi fi-${language === "th" ? "th" : "gb"}`} aria-hidden="true" />
          <span className="locale-code">{language.toUpperCase()}</span><ChevronDownIcon aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="locale-menu" sideOffset={12} align="end" collisionPadding={12}>
          <DropdownMenu.Label className="locale-menu-label">{t("ภาษา")}</DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={language} onValueChange={value => { if (value === "th" || value === "en") void changeLanguage(value); }}>
            <DropdownMenu.RadioItem value="th" className="locale-option"><span className="fi fi-th" aria-hidden="true" /><span lang="th">ภาษาไทย</span><DropdownMenu.ItemIndicator><CheckIcon /></DropdownMenu.ItemIndicator></DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="en" className="locale-option"><span className="fi fi-gb" aria-hidden="true" /><span lang="en">English</span><DropdownMenu.ItemIndicator><CheckIcon /></DropdownMenu.ItemIndicator></DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
