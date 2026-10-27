import Image from "next/image";

export default function Artwork({ src, w, h, label, className = "", eager = false, sizes = "(max-width: 760px) 30vw, 380px" }: { src: string; w: number; h: number; label: string; className?: string; eager?: boolean; sizes?: string }) {
  return <div className={`artwork ${className}`} style={{ aspectRatio: `${w}/${h}` }}>
    <Image src={src} alt={label} fill sizes={sizes} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} style={{ objectFit: "cover" }} />
  </div>;
}
