"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { ArrowLeftIcon, ArrowRightIcon, BackpackIcon, CheckIcon, ChevronRightIcon, ClockIcon, Cross2Icon, CubeIcon, PlusIcon, QuestionMarkCircledIcon, ReaderIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import AccountShell from "@/auth/AccountShell";
import { MethodIcon, paymentMethods, type PaymentMethod } from "./paymentMethods";
import "./wallet.css";

const amounts = [50, 100, 300, 500, 1000];
const methods = paymentMethods;
type Method = PaymentMethod;
type Topup = { amount: number; method: Method };
type Step = "review" | "payment" | "success";

export default function WalletTopupFlow() {
  const { t, locale } = useI18n();
  const [amount, setAmount] = useState(300);
  const [custom, setCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [method, setMethod] = useState<Method>(methods[0]);
  const [topup, setTopup] = useState<Topup | null>(null);
  const [step, setStep] = useState<Step>("review");
  const [completedAt, setCompletedAt] = useState("");
  const [showExamples, setShowExamples] = useState(false);
  const selectedAmount = custom ? Number(customAmount) : amount;
  const validAmount = Number.isInteger(selectedAmount) && selectedAmount >= 20 && selectedAmount <= 50000;
  const money = (value: number) => value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function review(event: FormEvent) {
    event.preventDefault();
    if (!validAmount) return;
    setTopup({ method, amount: selectedAmount });
    setStep("review");
    setCompletedAt("");
  }

  return <AccountShell active="wallet"><div className="wallet-page">
    <section className="wallet-hero" aria-labelledby="wallet-page-title"><div><div className="wallet-breadcrumb" role="navigation" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon /><span>{t("กระเป๋าเงิน")}</span></div><span className="wallet-eyebrow">THX2PAY WALLET</span><h1 id="wallet-page-title">{t("กระเป๋าเงิน")}</h1><p>{t("เติมเงินเพื่อใช้ในการซื้อเกม ไอดีเกม และสินค้าดิจิทัล")}</p></div><Image src="/images/banners/partner-v1.webp" alt="" fill sizes="(max-width: 760px) 250px, 500px" /></section>
    <div className="wallet-layout">
      <div className="wallet-column">
        <section className="wallet-balance-card" aria-label={t("ยอดเงินในกระเป๋า")}><div className="wallet-total"><span className="wallet-total-icon"><BackpackIcon /></span><div><p>{t("ยอดเงินคงเหลือ")}</p><b>฿0<span>.00</span></b></div><span className="wallet-demo-badge">{t("บัญชีตัวอย่าง")}</span></div><div className="wallet-balance-breakdown"><div><span className="wallet-small-icon green"><BackpackIcon /></span><div><p>{t("เงินที่สามารถใช้ได้")}</p><b>฿0.00</b></div></div><div><span className="wallet-small-icon rose"><CubeIcon /></span><div><p>{t("โบนัสเครดิต")}</p><b>฿0.00</b></div></div><a href="#wallet-transactions">{t("ประวัติการใช้งาน")}<ArrowRightIcon /></a></div></section>
        <section className="wallet-card" aria-labelledby="wallet-topup-title"><div className="wallet-card-head"><span className="wallet-small-icon blue"><BackpackIcon /></span><div><h2 id="wallet-topup-title">{t("เติมเงินเข้ากระเป๋า")}</h2><p>{t("เลือกช่องทางการชำระเงินที่สะดวกสำหรับคุณ")}</p></div><span className="wallet-test-badge">{t("โหมดทดสอบ")}</span></div>
          <form onSubmit={review} className="wallet-form">
            <fieldset><legend>{t("ช่องทางการชำระเงิน")}</legend><div className="wallet-method-grid">{methods.map(item => <button type="button" key={item.id} aria-pressed={method.id === item.id} onClick={() => setMethod(item)}><MethodIcon method={item} /><span><b>{t(item.label)}</b><small>{t(item.detail)}</small></span><span className="wallet-radio-mark">{method.id === item.id && <CheckIcon />}</span></button>)}</div></fieldset>
            <fieldset><legend>{t("เลือกจำนวนเงิน")}</legend><div className="wallet-amount-grid">{amounts.map(value => <button type="button" key={value} aria-pressed={!custom && amount === value} onClick={() => {setAmount(value);setCustom(false);}}>{value === 300 && <span className="wallet-popular">{t("ยอดนิยม")}</span>}<b>{value.toLocaleString()}</b><small>{t("บาท")}</small></button>)}<button type="button" aria-pressed={custom} onClick={() => setCustom(true)}><PlusIcon /><small>{t("ระบุจำนวน")}</small></button></div>
              {custom && <label className="wallet-custom-label">{t("จำนวนเงินที่ต้องการเติม")}<div className="wallet-custom-input"><span>฿</span><input type="number" min={20} max={50000} step={1} inputMode="numeric" placeholder={t("ขั้นต่ำ 20 บาท")} value={customAmount} onChange={event => setCustomAmount(event.target.value)} aria-describedby="wallet-amount-hint" /></div></label>}
              <p id="wallet-amount-hint" className={!validAmount ? "wallet-amount-error" : "wallet-amount-hint"}>{t("ยอดขั้นต่ำ 20 บาท สูงสุด 50,000 บาทต่อรายการ")}</p>
            </fieldset>
            <div className="wallet-form-total"><span>{t("ยอดเงินที่ต้องการเติม")}</span><b>฿{Number.isFinite(selectedAmount) ? money(selectedAmount) : "0.00"}</b></div>
            <button className="wallet-primary wallet-submit" disabled={!validAmount} type="submit">{t("เติมเงิน")} ฿{validAmount ? money(selectedAmount) : "0.00"}<ArrowRightIcon /></button>
            <p className="wallet-form-note"><CheckIcon />{t("โหมดทดสอบ — ยังไม่เชื่อมต่อระบบชำระเงินจริง")}</p>
          </form>
        </section>
      </div>
      <div className="wallet-column">
        <section className="wallet-perks"><Image src="/images/banners/offers-v1.webp" alt="" fill sizes="(max-width: 1100px) 90vw, 45vw" /><div><span className="wallet-perks-badge"><CubeIcon />{t("เติมคุ้มกว่า")}</span><h2>{t("เติมแล้วได้อะไรมากกว่า")}</h2><p>{t("รวมความสนุกและสิทธิพิเศษสำหรับคุณ")}</p><ul><li><CheckIcon />{t("เลือกเกมได้หลากหลาย")}</li><li><CheckIcon />{t("ดูแลทุกการเติม")}</li></ul><Link href="/promotions">{t("ดูสิทธิพิเศษ")}<ArrowRightIcon /></Link></div></section>
        <section className="wallet-card wallet-transactions" id="wallet-transactions" aria-labelledby="wallet-history-title"><div className="wallet-card-head"><span className="wallet-small-icon rose"><ClockIcon /></span><div><h2 id="wallet-history-title">{t("ประวัติการใช้งาน")}</h2></div><button type="button" onClick={() => setShowExamples(value => !value)}>{t(showExamples ? "ซ่อนตัวอย่าง" : "ดูตัวอย่างรายการ")}<ArrowRightIcon /></button></div>
          {showExamples && <p className="wallet-example-note">{t("รายการด้านล่างเป็นตัวอย่าง ไม่ใช่ธุรกรรมจริง")}</p>}
          <div className="wallet-table-scroll"><table><thead><tr><th>#</th><th>{t("วันที่ / เวลา")}</th><th>{t("รายการ")}</th><th>{t("จำนวนเงิน")}</th><th>{t("สถานะ")}</th></tr></thead><tbody>{showExamples ? [{amount:300,method:"PromptPay"},{amount:100,method:"TrueMoney"},{amount:500,method:"ธนาคารไทย"}].map((item,index) => <tr key={item.method}><td>{index+1}</td><td>{t("ตัวอย่างรายการ")}</td><td><span className="wallet-table-method"><BackpackIcon />{t(item.method)}</span></td><td className="wallet-credit">+฿{money(item.amount)}</td><td><span className="wallet-status"><CheckIcon />{t("ตัวอย่าง")}</span></td></tr>) : <tr><td colSpan={5}><div className="wallet-empty"><span><ReaderIcon /></span><h3>{t("ยังไม่มีประวัติการเติม")}</h3><p>{t("รายการเติมเงินและการใช้จ่ายจะแสดงที่นี่")}</p></div></td></tr>}</tbody></table></div><div className="wallet-transactions-footer"><span>{t("ทั้งหมด")} {showExamples ? 3 : 0} {t("รายการ")}</span><Link href="/account/orders">{t("ประวัติการเติม")}<ArrowRightIcon /></Link></div>
        </section>
        <aside className="wallet-help"><span className="wallet-small-icon blue"><QuestionMarkCircledIcon /></span><div><h2>{t("มีปัญหาการเติมเงิน?")}</h2><p>{t("หากเติมเงินแล้วไม่ขึ้น สามารถติดต่อทีมงานได้ทันที")}</p></div><Link href="/help">{t("ติดต่อทีมงาน")}<ArrowRightIcon /></Link></aside>
      </div>
    </div>
    <p className="wallet-bottom-note"><CheckIcon />{t("ระบบชำระเงินและกระเป๋าเงินยังไม่เชื่อมต่อ จึงยังไม่สร้างรายการหรือเรียกเก็บเงิน")}</p>
    <Dialog.Root open={topup !== null} onOpenChange={open => {if (!open) setTopup(null);}}><Dialog.Portal><Dialog.Overlay className="wallet-modal-overlay" /><Dialog.Content className="wallet-modal">
      <span className="wallet-test-badge">{t("โหมดทดสอบ · ไม่มีการเรียกเก็บเงินจริง")}</span><Dialog.Title>{t(step === "review" ? "ตรวจสอบรายการเติมเงิน" : step === "payment" ? "ขั้นตอนชำระเงิน" : "เติมเงินสำเร็จ (ตัวอย่าง)")}</Dialog.Title><Dialog.Description>{t("ทดลองขั้นตอนเติมเงิน ไม่มีการเพิ่มยอดเงินจริง")}</Dialog.Description><Dialog.Close className="wallet-modal-close" aria-label={t("ปิด")}><Cross2Icon /></Dialog.Close>
      <ol className="wallet-dialog-steps">{["ตรวจสอบ", "ชำระเงิน", "สำเร็จ"].map((label,index) => <li key={label} className={index <= ["review","payment","success"].indexOf(step) ? "current" : ""}><span>{index+1}</span>{t(label)}</li>)}</ol>
      {step === "success" && <div className="wallet-demo-success"><span><CheckIcon /></span><h3>{t("ขั้นตอนตัวอย่างเสร็จสมบูรณ์")}</h3><p>{t("ไม่มีการเรียกเก็บเงินหรือเพิ่มยอดเงินจริง")}</p></div>}
      {step === "payment" && <div className="wallet-payment-preview"><MethodIcon method={topup?.method ?? methods[0]} /><div><b>{t(topup?.method.label ?? "")}</b><p>{t("ยังไม่เปิดรับชำระเงิน")}</p></div><p>{t("ไม่มี QR บัญชีรับโอน หรือลิงก์ชำระเงินจริงในโหมดทดสอบ")}</p></div>}
      {topup && <dl className="wallet-review"><div><dt>{t("ช่องทาง")}</dt><dd>{t(topup.method.label)}</dd></div><div><dt>{t("จำนวนเงิน")}</dt><dd>฿{money(topup.amount)}</dd></div><div><dt>{t("สถานะ")}</dt><dd>{t(step === "success" ? "สำเร็จ (ตัวอย่าง)" : step === "payment" ? "รอจำลองการชำระเงิน" : "รอตรวจสอบ")}</dd></div>{completedAt && <div><dt>{t("เวลา")}</dt><dd>{completedAt}</dd></div>}</dl>}
      {step === "review" && <button className="wallet-primary" onClick={() => setStep("payment")}>{t("ดำเนินการต่อ")}<ArrowRightIcon /></button>}
      {step === "payment" && <div className="wallet-modal-actions"><button onClick={() => setStep("review")}><ArrowLeftIcon />{t("ย้อนกลับ")}</button><button className="wallet-primary" onClick={() => {setCompletedAt(new Date().toLocaleString(locale));setStep("success");}}>{t("จำลองการชำระสำเร็จ")}</button></div>}
      {step === "success" && <Dialog.Close className="wallet-primary">{t("กลับไปหน้ากระเป๋าเงิน")}</Dialog.Close>}
    </Dialog.Content></Dialog.Portal></Dialog.Root>
  </div></AccountShell>;
}
