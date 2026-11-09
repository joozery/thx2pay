"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { ClockIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";

// Counts down from mount; remount (e.g. re-entering the payment step) restarts it.
export default function PaymentCountdown({ seconds = 15 * 60, onExpire }: { seconds?: number; onExpire?: () => void }) {
  const { t } = useI18n();
  const [deadline] = useState(() => Date.now() + seconds * 1000);
  const [left, setLeft] = useState(seconds);
  const expire = useEffectEvent(() => onExpire?.());

  useEffect(() => {
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining === 0) { clearInterval(id); expire(); }
    }, 250);
    return () => clearInterval(id);
  }, [deadline]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const state = left === 0 ? "expired" : left <= 60 ? "urgent" : "";

  return <div className={`payment-countdown ${state}`} role="timer" aria-live={left <= 60 ? "polite" : "off"}>
    <ClockIcon />
    <span>{t(left === 0 ? "หมดเวลาชำระเงิน กรุณาย้อนกลับเพื่อเริ่มใหม่" : "กรุณาชำระเงินภายใน")}</span>
    <b>{mm}:{ss}</b>
  </div>;
}
