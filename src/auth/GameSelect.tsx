"use client";

import Image from "next/image";
import { Select } from "radix-ui";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import { games } from "@/components/topup/games";
import "./game-select.css";

export default function GameSelect({ value, onValueChange, id }: { value: string; onValueChange: (value: string) => void; id: string }) {
  const { t } = useI18n();
  const selected = games.find(game => game.id === value) ?? games[0];
  return <Select.Root value={value} onValueChange={onValueChange} name="game">
    <Select.Trigger className="member-game-select" id={id} aria-label={t("เกม")}>
      <Image src={selected.icon} alt="" width={30} height={30} />
      <Select.Value />
      <Select.Icon><ChevronDownIcon /></Select.Icon>
    </Select.Trigger>
    <Select.Portal><Select.Content className="member-game-select-menu" position="popper" sideOffset={7} collisionPadding={16} align="start">
      <Select.ScrollUpButton className="member-game-select-scroll"><ChevronUpIcon /></Select.ScrollUpButton>
      <Select.Viewport className="member-game-select-viewport">{games.map(game => <Select.Item className="member-game-select-option" key={game.id} value={game.id} textValue={game.name}>
        <Image src={game.icon} alt="" width={32} height={32} />
        <Select.ItemText>{game.name}</Select.ItemText>
        <Select.ItemIndicator className="member-game-select-check"><CheckIcon /></Select.ItemIndicator>
      </Select.Item>)}</Select.Viewport>
      <Select.ScrollDownButton className="member-game-select-scroll"><ChevronDownIcon /></Select.ScrollDownButton>
    </Select.Content></Select.Portal>
  </Select.Root>;
}
