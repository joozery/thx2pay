"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import FlowShell from "./FlowShell";

const amounts = [100, 300, 500, 1000];
type Method = "promptpay" | "bank";

export default function WalletTopupFlow() {
  const { t, language } = useI18n();
  const [amount, setAmount] = useState(300);
  const [customAmount, setCustomAmount] = useState("");
  const [method, setMethod] = useState<Method>("promptpay");
  const [step, setStep] = useState<"details" | "review">("details");
  const [notice, setNotice] = useState(false);
  const selectedAmount = customAmount ? Number(customAmount) : amount;
  const validAmount = Number.isInteger(selectedAmount) && selectedAmount >= 20 && selectedAmount <= 50000;

  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validAmount) return;
    setNotice(false);
    setStep("review");
  }

  return <FlowShell>
    <nav className="flow-breadcrumb" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon /><span>{t("เติมเงิน")}</span></nav>
    <div className="flow-heading"><span className="flow-kicker">THX2PAY WALLET</span><h1>{t("เติมเงิน")}</h1><p>{t("เลือกยอดเงินและตรวจสอบรายละเอียดก่อนดำเนินการ")}</p></div>
    <div className="flow-steps" aria-label={t("ขั้นตอนเติมเงิน")}><span className={step === "details" ? "current" : "done"}>1 · {t("เลือกยอดเงิน")}</span><span className={step === "review" ? "current" : ""}>2 · {t("ตรวจสอบรายการ")}</span><span>3 · {t("ชำระเงิน")}</span></div>
    <div className="flow-layout">
      <section className="flow-panel" aria-labelledby="wallet-title">
        {step === "details" ? <><h2 id="wallet-title">{t("เลือกยอดเงิน")}</h2><p>{t("ยอดขั้นต่ำ 20 บาท สูงสุด 50,000 บาทต่อรายการ")}</p><form className="flow-form" onSubmit={review}>
          <div className="flow-amount-grid">{amounts.map(value => <button type="button" key={value} className={!customAmount && amount === value ? "selected" : ""} aria-pressed={!customAmount && amount === value} onClick={() => { setAmount(value); setCustomAmount(""); }}>฿{value.toLocaleString()}</button>)}</div>
          <label>{t("ระบุจำนวนเงินเอง")}<span className="flow-input flow-currency"><strong>฿</strong><input type="number" min="20" max="50000" step="1" inputMode="numeric" placeholder={t("ระบุยอดเงิน")} value={customAmount} onChange={event => setCustomAmount(event.target.value)} /></span></label>
          <fieldset className="flow-methods"><legend>{t("ช่องทางชำระเงิน")}</legend><label className={method === "promptpay" ? "selected" : ""}><input type="radio" name="method" value="promptpay" checked={method === "promptpay"} onChange={() => setMethod("promptpay")} />PromptPay</label><label className={method === "bank" ? "selected" : ""}><input type="radio" name="method" value="bank" checked={method === "bank"} onChange={() => setMethod("bank")} />{t("โอนผ่านธนาคาร")}</label></fieldset>
          {!validAmount && <p className="flow-error">{t("กรุณาระบุยอดเงินระหว่าง 20 ถึง 50,000 บาท")}</p>}
          <button className="pill flow-submit" disabled={!validAmount}>{t("ตรวจสอบรายการ")}</button>
        </form></> : <><h2 id="wallet-title">{t("ตรวจสอบรายการ")}</h2><p>{t("โปรดตรวจสอบข้อมูลก่อนเข้าสู่ขั้นตอนชำระเงิน")}</p><dl className="flow-summary"><div><dt>{t("จำนวนเงิน")}</dt><dd>฿{selectedAmount.toLocaleString(language === "th" ? "th-TH" : "en-US")}</dd></div><div><dt>{t("ช่องทางชำระเงิน")}</dt><dd>{method === "promptpay" ? "PromptPay" : t("โอนผ่านธนาคาร")}</dd></div></dl><div className="flow-review-actions"><button type="button" onClick={() => { setStep("details"); setNotice(false); }}>{t("แก้ไขข้อมูล")}</button><button type="button" className="pill" onClick={() => setNotice(true)}>{t("ไปชำระเงิน")}</button></div>{notice && <div className="flow-notice" role="status"><strong>{t("ยังไม่เปิดรับชำระเงิน")}</strong><p>{t("ระบบชำระเงินและกระเป๋าเงินยังไม่เชื่อมต่อ จึงยังไม่สร้างรายการหรือเรียกเก็บเงิน")}</p><Link href="/help">{t("ติดต่อทีมงาน")}</Link></div>}</>}
      </section>
      <aside className="flow-aside"><h2>{t("ก่อนเติมเงิน")}</h2><p>{t("ตรวจสอบยอดเงินและช่องทางชำระเงินทุกครั้งก่อนยืนยันรายการ")}</p><p>{t("หากต้องการเติมเกมโดยตรง สามารถเลือกเกมจากหน้าเติมเกม")}</p><Link href="/topup">{t("ไปหน้าเติมเกม")} <ChevronRightIcon /></Link></aside>
    </div>
  </FlowShell>;
}
