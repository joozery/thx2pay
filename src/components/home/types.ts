export type DialogHandler = (title: string) => void;
export type Platform = "Mobile" | "Console" | "PC Games" | "Gift Card";
export const platforms: Platform[] = ["Mobile", "Console", "PC Games", "Gift Card"];

export type NavTarget = "home" | "games" | "cards" | "promotions" | "partner" | "help";
