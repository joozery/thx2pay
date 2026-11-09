"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { ArrowLeftIcon, ArrowRightIcon, BarChartIcon, CheckCircledIcon, CheckIcon, ChevronRightIcon, Cross2Icon, EnvelopeClosedIcon, GlobeIcon, LockClosedIcon, ReloadIcon, StarIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import { useAuth } from "@/auth/AuthProvider";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ContactDialog from "@/components/home/ContactDialog";
import SearchDialog from "@/components/home/SearchDialog";
import type { Category } from "@/components/home/categories";
import { MethodIcon, paymentMethods, type PaymentMethod } from "@/components/flows/paymentMethods";
import AccountCard, { AccountCover } from "./AccountCard";
import { accountGame, discountOf, gameAccounts, type GameAccount } from "./accounts";
import "@/components/topup/topup.css";
import "@/components/flows/wallet.css";
import "@/components/checkout/checkout.css";
import "./accounts.css";

type Step = "review" | "payment" | "success";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const steps = [
  { title: "ชำระเงิน", text: "เลือกช่องทางที่สะดวกและชำระเงิน" },
  { title: "รับข้อมูลไอดี", text: "ระบบส่งอีเมลและรหัสผ่านไปที่อีเมลของคุณ" },
  { title: "เปลี่ยนข้อมูลเป็นของคุณ", text: "ทีมงานช่วยเปลี่ยนอีเมลและรหัสผ่านให้ปลอดภัย" },
];

export default function AccountDetail({ account }: { account: GameAccount }) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { user } = useAuth();
  const game = accountGame(account);
  const discount = discountOf(account);
  const money = (amount: number) => `฿${amount.toLocaleString(locale)}`;
  // Same game first, then the rest of the catalog.
  const more = [...gameAccounts.filter(item => item.game === account.game), ...gameAccounts.filter(item => item.game !== account.game)].filter(item => item.id !== account.id).slice(0, 4);

  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<PaymentMethod>(paymentMethods[0]);
  const [touched, setTouched] = useState(false);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("review");
  const [result, setResult] = useState<{ id: string; at: string } | null>(null);
  const [modal, setModal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function prefill() { if (user?.email) setEmail(value => value || user.email); }
    prefill();
  }, [user?.email]);

  const emailError = emailPattern.test(email.trim()) ? "" : "กรุณากรอกอีเมลให้ถูกต้อง";
  // Game-specific stats are the headline numbers; rank/level/login/region are the account facts below them.
  const highlights = account.stats.filter(item => item.value !== "—");
  const facts = [
    { icon: StarIcon, label: "แรงก์", value: account.rank },
    { icon: BarChartIcon, label: "เลเวล", value: account.level },
    { icon: LockClosedIcon, label: "ประเภทการเข้าสู่ระบบ", value: account.login },
    { icon: GlobeIcon, label: "ภูมิภาค", value: account.region },
  ].filter(item => item.value !== "—");

  function submit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (emailError) { document.getElementById("account-email")?.focus(); return; }
    setStep("review");
    setResult(null);
    setOpen(true);
  }

  function completeDemoPayment() {
    setResult({ id: `DEMO-${Date.now().toString(36).toUpperCase().slice(-6)}`, at: new Date().toLocaleString(locale) });
    setStep("success");
  }

  function selectSearchResult(category: Category) {
    setSearchOpen(false);
    router.push(category.platform === "Gift Card" ? "/cards" : category.label === "เติมเกม" ? "/topup" : "/accounts");
  }

  return <>
    <Navbar activePage="accounts" onToggleSearch={() => setSearchOpen(value => !value)} searchOpen={searchOpen} />
    <main className="container topup-page accounts-page" id="top">
      <div className="wallet-page account-detail">
        <nav className="topup-breadcrumb" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon /><Link href="/accounts">{t("ไอดีเกม")}</Link><ChevronRightIcon /><Link href={`/accounts?game=${game.id}`}>{game.name}</Link></nav>

        <div className="acd-layout">
          <div className="wallet-column">
            <section className="acd-hero" aria-labelledby="account-title">
              <div className="acd-cover"><AccountCover account={account} sizes="(max-width: 1000px) 100vw, 860px" eager />{account.tag && <span className={`acc-tag ${account.tag}`}>{t(account.tag === "hot" ? "ขายดี" : "มาใหม่")}</span>}</div>
              <div className="acd-heading">
                <Link href={`/accounts?game=${game.id}`} className="acd-game"><Image src={game.icon} alt="" width={28} height={28} />{game.name}</Link>
                <h1 id="account-title">{t(account.title)}</h1>
                <p className="acd-code">{t("รหัสสินค้า")}: {account.id.toUpperCase()}</p>
                <span className="wallet-test-badge">{t("โหมดทดสอบ")}</span>
              </div>
            </section>

            <section className="wallet-card" aria-labelledby="account-specs-title">
              <div className="wallet-card-head acd-specs-head">
                <div><h2 id="account-specs-title">{t("สเปกไอดี")}</h2><p>{t("ข้อมูลจากการตรวจสอบของทีมงาน")}</p></div>
                <span className="acd-verified"><CheckCircledIcon />{t("ทีมงานตรวจสอบแล้ว")}</span>
              </div>
              {highlights.length > 0 && <dl className="acd-highlights">{highlights.map(item => <div key={item.label}><dt>{t(item.label)}</dt><dd>{item.value}</dd></div>)}</dl>}
              <dl className="acd-facts">{facts.map(({ icon: Icon, label, value }) => <div key={label}><span aria-hidden="true"><Icon /></span><dt>{t(label)}</dt><dd>{value}</dd></div>)}</dl>
            </section>

            <section className="wallet-card" aria-labelledby="account-steps-title">
              <div className="wallet-card-head"><div><h2 id="account-steps-title">{t("ขั้นตอนการรับไอดี")}</h2><p>{t("ได้รับข้อมูลภายใน 5–30 นาทีหลังชำระเงิน")}</p></div></div>
              <ol className="acd-steps">{steps.map((item, index) => <li key={item.title}><span>{index + 1}</span><div><b>{t(item.title)}</b><small>{t(item.text)}</small></div></li>)}</ol>
            </section>
          </div>

          <form className="wallet-card acd-buy" onSubmit={submit} noValidate aria-labelledby="account-buy-title">
            <h2 id="account-buy-title" className="sr-only">{t("สั่งซื้อไอดีนี้")}</h2>
            <div className="acd-price"><strong>{money(account.price)}</strong>{account.was && <><s>{money(account.was)}</s><em>{t("ประหยัด")} {money(discount)}</em></>}</div>
            <ul className="acd-perks">
              <li><CheckCircledIcon />{t("รับประกัน {{count}} วัน", { count: account.warrantyDays })}</li>
              <li><LockClosedIcon />{t("ช่วยเปลี่ยนอีเมลและรหัสผ่าน")}</li>
              <li><ReloadIcon />{t("มีปัญหาเปลี่ยนหรือคืนเงิน")}</li>
            </ul>
            <label className="checkout-field">{t("อีเมลสำหรับรับข้อมูลไอดี")}
              <input id="account-email" type="email" inputMode="email" autoComplete="email" spellCheck={false} placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} onBlur={() => email && setTouched(true)} aria-invalid={touched && !!emailError} aria-describedby="account-email-error" />
            </label>
            <p id="account-email-error" className="wallet-amount-error checkout-error" role="alert">{touched && emailError ? t(emailError) : ""}</p>
            <fieldset className="acd-methods"><legend>{t("ช่องทางการชำระเงิน")}</legend>
              {paymentMethods.map(item => <button type="button" key={item.id} aria-pressed={method.id === item.id} onClick={() => setMethod(item)}><MethodIcon method={item} /><b>{t(item.label)}</b><span className="wallet-radio-mark">{method.id === item.id && <CheckIcon />}</span></button>)}
            </fieldset>
            <button className="wallet-primary wallet-submit" type="submit">{t("ซื้อไอดีนี้")} {money(account.price)}<ArrowRightIcon /></button>
            <p className="wallet-form-note"><CheckIcon />{t("โหมดทดสอบ — ยังไม่เชื่อมต่อระบบชำระเงินจริง")}</p>
          </form>
        </div>

        {more.length > 0 && <section className="acd-more" aria-labelledby="account-more-title">
          <div className="topup-catalog-heading"><div><span className="topup-section-label">MORE ACCOUNTS</span><h2 id="account-more-title">{t("ไอดีอื่นที่น่าสนใจ")}</h2></div><Link href="/accounts" className="accounts-all">{t("ดูทั้งหมด")}<ArrowRightIcon /></Link></div>
          <div className="accounts-grid">{more.map(item => <AccountCard key={item.id} account={item} />)}</div>
        </section>}
      </div>
    </main>
    <Footer onOpenDialog={setModal} />
    <ContactDialog title={modal} onClose={() => setModal("")} />
    <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onSelect={selectSearchResult} />

    <Dialog.Root open={open} onOpenChange={setOpen}><Dialog.Portal><Dialog.Overlay className="wallet-modal-overlay" /><Dialog.Content className="wallet-modal">
      <span className="wallet-test-badge">{t("โหมดทดสอบ · ไม่มีการเรียกเก็บเงินจริง")}</span>
      <Dialog.Title>{t(step === "review" ? "ตรวจสอบคำสั่งซื้อ" : step === "payment" ? "ขั้นตอนชำระเงิน" : "สั่งซื้อสำเร็จ (ตัวอย่าง)")}</Dialog.Title>
      <Dialog.Description>{t("ทดลองขั้นตอนสั่งซื้อ ไม่มีการเรียกเก็บเงินหรือส่งสินค้าจริง")}</Dialog.Description>
      <Dialog.Close className="wallet-modal-close" aria-label={t("ปิด")}><Cross2Icon /></Dialog.Close>
      <ol className="wallet-dialog-steps">{["ตรวจสอบ", "ชำระเงิน", "สำเร็จ"].map((label, index) => <li key={label} className={index <= ["review", "payment", "success"].indexOf(step) ? "current" : ""}><span>{index + 1}</span>{t(label)}</li>)}</ol>
      {step === "success" && <div className="wallet-demo-success"><span><CheckIcon /></span><h3>{t("ขั้นตอนตัวอย่างเสร็จสมบูรณ์")}</h3><p>{t("ในการสั่งซื้อจริง ข้อมูลไอดีจะถูกส่งไปที่อีเมลของคุณ")}</p></div>}
      {step === "payment" && <div className="wallet-payment-preview"><MethodIcon method={method} /><div><b>{t(method.label)}</b><p>{t("ยังไม่เปิดรับชำระเงิน")}</p></div><p>{t("ไม่มี QR บัญชีรับโอน หรือลิงก์ชำระเงินจริงในโหมดทดสอบ")}</p></div>}
      <dl className="wallet-review">
        {result && <div><dt>{t("หมายเลขคำสั่งซื้อ")}</dt><dd>{result.id}</dd></div>}
        <div><dt>{t("สินค้า")}</dt><dd>{game.name} · {t(account.title)}</dd></div>
        <div><dt>{t("ส่งข้อมูลไปที่")}</dt><dd><EnvelopeClosedIcon aria-hidden="true" className="acd-inline-icon" /> {email.trim()}</dd></div>
        <div><dt>{t("ช่องทาง")}</dt><dd>{t(method.label)}</dd></div>
        <div><dt>{t("ยอดชำระ")}</dt><dd>{money(account.price)}</dd></div>
        {result && <div><dt>{t("เวลา")}</dt><dd>{result.at}</dd></div>}
      </dl>
      {step === "review" && <button className="wallet-primary" onClick={() => setStep("payment")}>{t("ยืนยันและชำระเงิน")}<ArrowRightIcon /></button>}
      {step === "payment" && <div className="wallet-modal-actions"><button onClick={() => setStep("review")}><ArrowLeftIcon />{t("ย้อนกลับ")}</button><button className="wallet-primary" onClick={completeDemoPayment}>{t("จำลองการชำระสำเร็จ")}</button></div>}
      {step === "success" && <div className="wallet-modal-actions checkout-success-actions"><Link href="/accounts">{t("ดูไอดีอื่น")}</Link><Dialog.Close className="wallet-primary">{t("ปิด")}</Dialog.Close></div>}
    </Dialog.Content></Dialog.Portal></Dialog.Root>
  </>;
}
