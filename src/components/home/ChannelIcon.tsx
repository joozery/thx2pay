import Image from "next/image";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import type { ContactChannel } from "./contactChannels";

function MessengerMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.15.26.35.27.57l.05 1.78c.02.57.6.94 1.12.71l1.99-.88c.17-.07.36-.09.53-.04.91.25 1.89.39 2.9.39 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2Zm6 7.46-2.94 4.66a1.5 1.5 0 0 1-2.17.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63l2.94-4.66a1.5 1.5 0 0 1 2.17-.4l2.34 1.75a.6.6 0 0 0 .72 0l3.16-2.4c.42-.32.97.18.69.63Z" /></svg>;
}

export default function ChannelIcon({ channel, size = 44 }: { channel: ContactChannel; size?: number }) {
  // Bare brand mark at full size (no tinted chip behind it).
  const inner = size;
  return <span className="channel-icon" style={{ width: size, height: size, ["--channel" as string]: channel.color }} aria-hidden="true">
    {channel.icon === "email" ? <EnvelopeClosedIcon width={inner} height={inner} />
      : channel.icon === "messenger" ? <span style={{ width: inner, height: inner, display: "grid" }}><MessengerMark /></span>
      : <Image src={channel.icon} alt="" width={inner} height={inner} unoptimized />}
  </span>;
}
