"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { ArrowLeftIcon, ArrowRightIcon, CheckCircledIcon, CheckIcon, ChevronDownIcon, ChevronRightIcon, Cross2Icon, InfoCircledIcon, LightningBoltIcon, LockClosedIcon, PersonIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import { useAuth } from "@/auth/AuthProvider";
import { useSavedUIDs } from "@/auth/accountData";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ContactDialog from "@/components/home/ContactDialog";
import SearchDialog from "@/components/home/SearchDialog";
import UIDGuideDialog from "@/components/home/UIDGuideDialog";
import type { Category } from "@/components/home/categories";
import { MethodIcon, paymentMethods, type PaymentMethod } from "@/components/flows/paymentMethods";
import PaymentCountdown from "@/components/flows/PaymentCountdown";
import type { CheckoutPackage, CheckoutProduct } from "./catalog";
import "@/components/topup/topup.css";
import "@/components/flows/wallet.css";
import "./checkout.css";

type Step = "review" | "payment" | "success";
type Order = { pack: CheckoutPackage; method: PaymentMethod; account: string };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CheckoutFlow({ product }: { product: CheckoutProduct }) {
  const { t, locale, money } = useI18n();
  const router = useRouter();
  const { user } = useAuth();
  const saved = useSavedUIDs(user?.email ?? "");
  const savedForGame = user ? saved.items.filter(item => item.game === product.id) : [];
  const field = product.account;

  const [pack, setPack] = useState<CheckoutPackage>(product.packages.find(item => item.popular) ?? product.packages[0]);
  const [method, setMethod] = useState<PaymentMethod>(paymentMethods[0]);
  const [accountId, setAccountId] = useState("");
  const [zone, setZone] = useState("");
  const [server, setServer] = useState("");
  const [rememberUID, setRememberUID] = useState(true);
  const [touched, setTouched] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [step, setStep] = useState<Step>("review");
  const [expired, setExpired] = useState(false);
  const [result, setResult] = useState<{ id: string; at: string } | null>(null);
  const [modal, setModal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  // Links from "My UIDs" pass ?uid= so the buyer does not retype it; signed-in buyers get their email for apps.
  useEffect(() => {
    function prefill() {
      const fromUrl = new URLSearchParams(window.location.search).get("uid");
      if (field.kind === "uid" && fromUrl) setAccountId(fromUrl);
    }
    prefill();
  }, [field.kind]);
  useEffect(() => {
    function prefillEmail() { if (field.kind === "email" && user?.email) setAccountId(value => value || user.email); }
    prefillEmail();
  }, [field.kind, user?.email]);

  const value = accountId.trim();
  const accountError = field.kind === "email"
    ? (!emailPattern.test(value) ? "กรุณากรอกอีเมลให้ถูกต้อง" : "")
    : value.length < 3 ? "กรุณากรอก {{label}}" : field.zone && !/^\d{2,6}$/.test(zone.trim()) ? "กรุณากรอก Zone ID เป็นตัวเลข" : field.servers && !server ? "กรุณาเลือกเซิร์ฟเวอร์" : "";
  const accountLabel = field.kind === "uid" ? [value, field.zone && zone.trim() ? `(${zone.trim()})` : "", server ? `· ${server}` : ""].filter(Boolean).join(" ") : value;
  const alreadySaved = savedForGame.some(item => item.uid === value);
  // Purchase stages shown above the form; each turns green once its input is valid, the first open one is "current".
  const stages = [
    { label: field.kind === "uid" ? "กรอกบัญชีเกม" : "กรอกอีเมล", done: !accountError },
    { label: product.kind === "card" ? "เลือกราคาบัตร" : "เลือกแพ็กเกจ", done: true },
    { label: "เลือกช่องทางชำระ", done: true },
    { label: "ยืนยันและชำระเงิน", done: false },
  ];
  const currentStage = stages.findIndex(stage => !stage.done);
  const packTitle = (item: CheckoutPackage) => item.months ? `${item.label} · ${t("{{count}} เดือน", { count: item.months })}` : item.label;

  function selectSearchResult(category: Category) {
    setSearchOpen(false);
    router.push(category.platform === "Gift Card" ? "/cards" : "/topup");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (accountError) { document.getElementById("checkout-account")?.focus(); return; }
    setOrder({ pack, method, account: accountLabel });
    setStep("review");
    setResult(null);
  }

  function completeDemoPayment() {
    if (user && field.kind === "uid" && rememberUID && !alreadySaved) saved.save([...saved.items, { id: crypto.randomUUID(), game: product.id, uid: value }]);
    setResult({ id: `DEMO-${Date.now().toString(36).toUpperCase().slice(-6)}`, at: new Date().toLocaleString(locale) });
    setStep("success");
  }

  const backHref = product.kind === "game" ? "/topup" : product.kind === "card" ? "/cards" : "/premium";
  const backLabel = product.kind === "game" ? "เติมเกม" : product.kind === "card" ? "บัตรเติมเงิน" : "พรีเมียม";

  return <>
    <Navbar activePage={product.kind === "game" ? "games" : product.kind === "card" ? "cards" : "premium"} onToggleSearch={() => setSearchOpen(open => !open)} searchOpen={searchOpen} />
    <main className="container topup-page checkout-page" id="top">
      <div className="wallet-page">
        <nav className="topup-breadcrumb" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon /><Link href={backHref}>{t(backLabel)}</Link><ChevronRightIcon /><span>{product.name}</span></nav>

        <form className="acd-layout" onSubmit={submit} noValidate>
          <div className="wallet-column">
            <section className="checkout-product" aria-labelledby="checkout-title">
              <span className={`checkout-product-art${product.color ? " is-logo" : ""}`} style={product.color ? { background: product.color } : undefined}>
                <Image src={product.image} alt="" {...(product.color ? { width: 64, height: 64, unoptimized: true } : { fill: true, sizes: "96px", style: { objectFit: "cover" } })} />
              </span>
              <div>
                <span className="wallet-eyebrow">{product.kind === "game" ? "GAME TOP-UP" : product.kind === "card" ? "GAME CARD" : "PREMIUM APP"}</span>
                <h1 id="checkout-title">{product.kind === "game" ? t("เติม {{name}}", { name: product.name }) : product.kind === "card" ? t("ซื้อ {{name}}", { name: t("บัตร {{name}}", { name: product.name }) }) : t("ซื้อ {{name}}", { name: product.name })}</h1>
                <p>{t(product.subtitle)}</p>
              </div>
              <span className="wallet-test-badge">{t("โหมดทดสอบ")}</span>
            </section>

            <ol className="checkout-stages" aria-label={t("ขั้นตอนการสั่งซื้อ")}>
              {stages.map((stage, index) => <li key={stage.label} className={stage.done ? "done" : index === currentStage ? "current" : ""} aria-current={index === currentStage ? "step" : undefined}>
                <span>{stage.done ? <CheckIcon /> : index + 1}</span>{t(stage.label)}
              </li>)}
            </ol>

            <section className="wallet-card" aria-labelledby="checkout-account-title">
              <div className="wallet-card-head"><span className="checkout-step">1</span><div><h2 id="checkout-account-title">{t(field.kind === "uid" ? "ข้อมูลบัญชีเกม" : "ข้อมูลผู้รับ")}</h2><p>{t(field.kind === "uid" ? "กรอกข้อมูลให้ถูกต้อง ไอเทมจะถูกส่งเข้าบัญชีนี้" : "เราจะส่งรหัสหรือลิงก์เปิดใช้งานไปที่อีเมลนี้")}</p></div></div>
              {savedForGame.length > 0 && <div className="checkout-saved" role="group" aria-label={t("UID ที่บันทึกไว้")}><span>{t("UID ที่บันทึกไว้")}</span>{savedForGame.map(item => <button type="button" key={item.id} aria-pressed={item.uid === value} onClick={() => setAccountId(item.uid)}><PersonIcon />{item.uid}</button>)}</div>}
              <div className={`checkout-fields${field.kind === "uid" && field.zone ? " has-zone" : ""}`}>
                <label className="checkout-field">{t(field.label)}
                  <input id="checkout-account" type={field.kind === "email" ? "email" : "text"} inputMode={field.kind === "email" ? "email" : undefined} autoComplete={field.kind === "email" ? "email" : "off"} spellCheck={false} placeholder={t(field.placeholder)} value={accountId} onChange={event => setAccountId(event.target.value)} onBlur={() => value && setTouched(true)} aria-invalid={touched && !!accountError} aria-describedby="checkout-account-error" />
                </label>
                {field.kind === "uid" && field.zone && <label className="checkout-field">Zone ID<input inputMode="numeric" placeholder={t("เช่น 1234")} value={zone} onChange={event => setZone(event.target.value)} aria-invalid={touched && !!accountError} /></label>}
                {field.kind === "uid" && field.servers && <label className="checkout-field checkout-select">{t("เซิร์ฟเวอร์")}<span><select value={server} onChange={event => setServer(event.target.value)} aria-invalid={touched && !server}><option value="">{t("เลือกเซิร์ฟเวอร์")}</option>{field.servers.map(item => <option key={item} value={item}>{item}</option>)}</select><ChevronDownIcon aria-hidden="true" /></span></label>}
              </div>
              <p id="checkout-account-error" className="wallet-amount-error checkout-error" role="alert">{touched && accountError ? t(accountError, { label: t(field.label) }) : ""}</p>
              {field.kind === "uid" && <div className="checkout-account-foot">
                <UIDGuideDialog />
                {user && value && !alreadySaved && <label className="checkout-remember"><input type="checkbox" checked={rememberUID} onChange={event => setRememberUID(event.target.checked)} />{t("บันทึก UID ไว้ใช้ครั้งถัดไป")}</label>}
              </div>}
            </section>

            <section className="wallet-card" aria-labelledby="checkout-package-title">
              <div className="wallet-card-head"><span className="checkout-step">2</span><div><h2 id="checkout-package-title">{t(product.kind === "game" ? "เลือกแพ็กเกจ" : product.kind === "card" ? "เลือกราคาบัตร" : "เลือกแพ็กเกจสมาชิก")}</h2><p>{t(product.kind === "game" ? (product.packages.some(item => item.bonus) ? "แตะการ์ดเพื่อเลือก 1 แพ็กเกจ แพ็กใหญ่ได้โบนัสมากกว่า" : "แตะการ์ดเพื่อเลือก 1 แพ็กเกจที่ต้องการ") : product.kind === "card" ? "แตะการ์ดเพื่อเลือกมูลค่าบัตรที่ต้องการ" : "แตะการ์ดเพื่อเลือกระยะเวลาสมาชิก")}</p></div></div>
              <div className={`checkout-packages ${product.kind}`} role="radiogroup" aria-labelledby="checkout-package-title">
                {product.packages.map(item => <button type="button" role="radio" key={item.id} aria-checked={pack.id === item.id} onClick={() => setPack(item)}>
                  {item.popular && <span className="wallet-popular"><StarFilledIcon />{t("ยอดนิยม")}</span>}
                  {pack.id === item.id && <span className="checkout-pack-check" aria-hidden="true"><CheckIcon /></span>}
                  <span className="checkout-giftcard-brand">
                    <span className={`checkout-giftcard-logo${product.color ? " is-logo" : ""}`} style={product.color ? { background: product.color } : undefined}><Image src={product.image} alt="" width={22} height={22} unoptimized={!!product.color} /></span>
                    {product.name}
                  </span>
                  {product.kind === "game" ? <>
                    <b>{item.amount?.toLocaleString(locale)}</b>
                    <span className="checkout-giftcard-sub">{product.unit}{item.bonus ? <em>+{item.bonus.toLocaleString(locale)} {t("โบนัส")}</em> : null}</span>
                  </> : product.kind === "card" ? <b>{item.label}</b> : <>
                    <b>{item.label}</b>
                    <span className="checkout-giftcard-sub">{t("{{count}} เดือน", { count: item.months ?? 1 })}{(item.months ?? 1) > 1 && <em className="is-muted">≈ {money(Math.round(item.price / item.months!))}/{t("เดือน")}</em>}</span>
                  </>}
                  <span className="checkout-giftcard-foot">{product.kind === "card"
                    ? (item.price < item.amount! ? <>{t("จ่าย")} <s>{money(item.amount!)}</s> <strong>{money(item.price)}</strong></> : t("บัตรเติมเงิน · ส่งรหัสทางอีเมล"))
                    : <strong>{money(item.price)}</strong>}</span>
                </button>)}
              </div>
              <div className="checkout-pack-picked" aria-live="polite">
                <span><CheckCircledIcon />{t("เลือกแล้ว")}</span>
                <b>{product.kind === "card" ? `${t("บัตร {{name}}", { name: product.name })} ${pack.label}` : packTitle(pack)}{pack.bonus ? ` + ${pack.bonus.toLocaleString(locale)} ${t("โบนัส")}` : ""}</b>
                <strong>{money(pack.price)}</strong>
              </div>
              <p className="checkout-pack-note"><InfoCircledIcon />{t("ราคาตัวอย่าง อาจมีการเปลี่ยนแปลง")} · {t("ยอดที่ต้องชำระจริงแสดงก่อนยืนยันคำสั่งซื้อ")}</p>
            </section>

          </div>

          <aside className="wallet-card acd-buy" aria-labelledby="checkout-summary-title">
            <h2 id="checkout-summary-title" className="sr-only">{t("สรุปคำสั่งซื้อ")}</h2>
            <div className="checkout-summary-item">
              <span className={`checkout-summary-art${product.color ? " is-logo" : ""}`} style={product.color ? { background: product.color } : undefined}><Image src={product.image} alt="" {...(product.color ? { width: 30, height: 30, unoptimized: true } : { fill: true, sizes: "48px", style: { objectFit: "cover" } })} /></span>
              <div><b>{product.name}</b><small>{packTitle(pack)}{pack.bonus ? ` + ${pack.bonus.toLocaleString(locale)} ${t("โบนัส")}` : ""}</small></div>
            </div>
            <div className="acd-price"><strong>{money(pack.price)}</strong></div>
            <ul className="acd-perks">
              <li><LightningBoltIcon />{t(product.kind === "game" ? "เติมด้วย UID ไม่ต้องใช้รหัสผ่าน" : "ส่งรหัสทางอีเมล")}</li>
              <li><LockClosedIcon />{t("ชำระเงินปลอดภัย")}</li>
              <li><CheckCircledIcon />{t("ค่าธรรมเนียม")} {money(0)}</li>
            </ul>
            <dl className="wallet-review checkout-buy-account"><div><dt>{t(field.kind === "uid" ? "บัญชีเกม" : "อีเมล")}</dt><dd>{accountLabel || "—"}</dd></div></dl>
            <fieldset className="acd-methods"><legend><span className="checkout-step">3</span>{t("เลือกช่องทางชำระเงิน")}</legend>
              {paymentMethods.map(item => <button type="button" key={item.id} aria-pressed={method.id === item.id} onClick={() => setMethod(item)}><MethodIcon method={item} /><b>{t(item.label)}</b><span className="wallet-radio-mark">{method.id === item.id && <CheckIcon />}</span></button>)}
            </fieldset>
            <p className="checkout-pay-hint"><span className="checkout-step">4</span>{t(accountError ? "กรอกข้อมูลขั้นที่ 1 ให้ครบก่อนชำระเงิน" : "ตรวจสอบรายการ แล้วกดชำระเงิน")}</p>
            <button className="wallet-primary wallet-submit" type="submit">{t("ชำระเงิน")} {money(pack.price)}<ArrowRightIcon /></button>
            <p className="wallet-form-note"><CheckIcon />{t("โหมดทดสอบ — ยังไม่เชื่อมต่อระบบชำระเงินจริง")}</p>
          </aside>
        </form>
      </div>
    </main>
    <Footer onOpenDialog={setModal} />
    <ContactDialog title={modal} onClose={() => setModal("")} />
    <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onSelect={selectSearchResult} />

    <Dialog.Root open={order !== null} onOpenChange={open => { if (!open) setOrder(null); }}><Dialog.Portal><Dialog.Overlay className="wallet-modal-overlay" /><Dialog.Content className="wallet-modal">
      <span className="wallet-test-badge">{t("โหมดทดสอบ · ไม่มีการเรียกเก็บเงินจริง")}</span>
      <Dialog.Title>{t(step === "review" ? "ตรวจสอบคำสั่งซื้อ" : step === "payment" ? "ขั้นตอนชำระเงิน" : "สั่งซื้อสำเร็จ (ตัวอย่าง)")}</Dialog.Title>
      <Dialog.Description>{t("ทดลองขั้นตอนสั่งซื้อ ไม่มีการเรียกเก็บเงินหรือส่งสินค้าจริง")}</Dialog.Description>
      <Dialog.Close className="wallet-modal-close" aria-label={t("ปิด")}><Cross2Icon /></Dialog.Close>
      <ol className="wallet-dialog-steps">{["ตรวจสอบ", "ชำระเงิน", "สำเร็จ"].map((label, index) => <li key={label} className={index <= ["review", "payment", "success"].indexOf(step) ? "current" : ""}><span>{index + 1}</span>{t(label)}</li>)}</ol>
      {step === "success" && <div className="wallet-demo-success"><span><CheckIcon /></span><h3>{t("ขั้นตอนตัวอย่างเสร็จสมบูรณ์")}</h3><p>{t("ไม่มีการเรียกเก็บเงินหรือส่งสินค้าจริง")}</p></div>}
      {step === "payment" && <PaymentCountdown onExpire={() => setExpired(true)} />}
      {step === "payment" && order && <div className="wallet-payment-preview"><MethodIcon method={order.method} /><div><b>{t(order.method.label)}</b><p>{t("ยังไม่เปิดรับชำระเงิน")}</p></div><p>{t("ไม่มี QR บัญชีรับโอน หรือลิงก์ชำระเงินจริงในโหมดทดสอบ")}</p></div>}
      {order && <dl className="wallet-review">
        {result && <div><dt>{t("หมายเลขคำสั่งซื้อ")}</dt><dd>{result.id}</dd></div>}
        <div><dt>{t("สินค้า")}</dt><dd>{product.name} · {packTitle(order.pack)}</dd></div>
        <div><dt>{t(field.kind === "uid" ? "บัญชีเกม" : "อีเมล")}</dt><dd>{order.account}</dd></div>
        <div><dt>{t("ช่องทาง")}</dt><dd>{t(order.method.label)}</dd></div>
        <div><dt>{t("ยอดชำระ")}</dt><dd>{money(order.pack.price)}</dd></div>
        {result && <div><dt>{t("เวลา")}</dt><dd>{result.at}</dd></div>}
      </dl>}
      {step === "review" && <button className="wallet-primary" onClick={() => { setExpired(false); setStep("payment"); }}>{t("ยืนยันและชำระเงิน")}<ArrowRightIcon /></button>}
      {step === "payment" && <div className="wallet-modal-actions"><button onClick={() => setStep("review")}><ArrowLeftIcon />{t("ย้อนกลับ")}</button><button className="wallet-primary" disabled={expired} onClick={completeDemoPayment}>{t("จำลองการชำระสำเร็จ")}</button></div>}
      {step === "success" && <div className="wallet-modal-actions checkout-success-actions"><Link href={backHref}>{t(product.kind === "app" ? "เลือกแอพอื่น" : "เลือกเกมอื่น")}</Link><Dialog.Close className="wallet-primary">{t("ซื้ออีกครั้ง")}</Dialog.Close></div>}
    </Dialog.Content></Dialog.Portal></Dialog.Root>
  </>;
}
