"use client";

import { useState, type InputHTMLAttributes } from "react";
import { EyeClosedIcon, EyeOpenIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";

export default function PasswordField({ label, ...input }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  return <label className="auth-field"><span>{t(label)}</span>
    <span className="auth-input"><LockClosedIcon aria-hidden="true" /><input {...input} type={show ? "text" : "password"} />
      <button type="button" className="auth-eye" aria-label={t(show ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน")} aria-pressed={show} onClick={() => setShow(value => !value)}>{show ? <EyeClosedIcon /> : <EyeOpenIcon />}</button>
    </span>
  </label>;
}

export const passwordRules = [
  { label: "อย่างน้อย 8 ตัวอักษร", test: (value: string) => value.length >= 8 },
  { label: "มีตัวอักษรภาษาอังกฤษ", test: (value: string) => /[A-Za-z]/.test(value) },
  { label: "มีตัวเลขอย่างน้อย 1 ตัว", test: (value: string) => /\d/.test(value) },
];
