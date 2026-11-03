import Image from "next/image";
import { CardStackIcon, HomeIcon } from "@radix-ui/react-icons";

export const paymentMethods = [
  { id: "promptpay", label: "PromptPay QR Code", detail: "สแกนจ่ายผ่านแอปธนาคาร", image: "/icons/payments/promptpay.png" },
  { id: "truemoney", label: "TrueMoney Wallet", detail: "ชำระสะดวก รวดเร็ว", image: "/icons/payments/truemoney.png" },
  { id: "bank", label: "ธนาคารไทย", detail: "โอนผ่านบัญชีธนาคาร", image: null },
  { id: "card", label: "บัตรเครดิต / เดบิต", detail: "Visa, Mastercard, JCB", image: null },
] as const;
export type PaymentMethod = typeof paymentMethods[number];

export function MethodIcon({ method }: { method: PaymentMethod }) {
  return <span className={`wallet-method-icon ${method.id}`}>{method.image ? <Image src={method.image} alt="" width={44} height={44} /> : method.id === "bank" ? <HomeIcon /> : <CardStackIcon />}</span>;
}
