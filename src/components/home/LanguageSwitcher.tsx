"use client";

import { DropdownMenu } from "radix-ui";
import { CheckIcon, ChevronDownIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "./ThemeToggle";
import { isLanguage, languageInfo, languages } from "@/i18n/languages";
import { useI18n } from "@/i18n/useI18n";
import "./language-switcher.css";

// `withTheme`: the navbar version also holds the light/dark switch, so the header needs one button instead of two.
export default function LanguageSwitcher({ withTheme = false }: { withTheme?: boolean }) {
  const { t, language, changeLanguage } = useI18n();
  const { isLight, setTheme } = useTheme();
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button className="locale-trigger" type="button" aria-label={t(withTheme ? "ภาษาและธีม" : "ภาษา")}>
          <span className={`fi fi-${languageInfo(language).flag}`} aria-hidden="true" />
          <span className="locale-code">{languageInfo(language).short}</span><ChevronDownIcon aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="locale-menu" sideOffset={12} align="end" collisionPadding={12}>
          <DropdownMenu.Label className="locale-menu-label">{t("ภาษา")}</DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={language} onValueChange={value => { if (isLanguage(value)) void changeLanguage(value); }}>
            {languages.map(item => <DropdownMenu.RadioItem key={item.code} value={item.code} className="locale-option" onSelect={event => event.preventDefault()}>
              <span className={`fi fi-${item.flag}`} aria-hidden="true" /><span lang={item.code} dir={item.dir}>{item.label}</span><DropdownMenu.ItemIndicator><CheckIcon /></DropdownMenu.ItemIndicator>
            </DropdownMenu.RadioItem>)}
          </DropdownMenu.RadioGroup>
          {withTheme && <>
            <DropdownMenu.Separator className="locale-sep" />
            <DropdownMenu.Label className="locale-menu-label">{t("ธีม")}</DropdownMenu.Label>
            <DropdownMenu.RadioGroup value={isLight ? "light" : "dark"} onValueChange={value => { if (value === "light" || value === "dark") setTheme(value); }}>
              <DropdownMenu.RadioItem value="light" className="locale-option" onSelect={event => event.preventDefault()}><SunIcon aria-hidden="true" className="locale-theme-icon" /><span>{t("สว่าง")}</span><DropdownMenu.ItemIndicator><CheckIcon /></DropdownMenu.ItemIndicator></DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="dark" className="locale-option" onSelect={event => event.preventDefault()}><MoonIcon aria-hidden="true" className="locale-theme-icon" /><span>{t("มืด")}</span><DropdownMenu.ItemIndicator><CheckIcon /></DropdownMenu.ItemIndicator></DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </>}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
