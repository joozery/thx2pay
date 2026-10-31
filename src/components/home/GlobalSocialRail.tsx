"use client";

import { useState } from "react";
import SocialFollowRail from "./SocialFollowRail";
import ContactDialog from "./ContactDialog";

export default function GlobalSocialRail() {
  const [modal, setModal] = useState("");
  return <><SocialFollowRail onOpenDialog={setModal} /><ContactDialog title={modal} onClose={() => setModal("")} /></>;
}
