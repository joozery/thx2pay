import { BellIcon, CardStackIcon, CounterClockwiseClockIcon, GearIcon, IdCardIcon, LockClosedIcon, Pencil1Icon, PersonIcon, QuestionMarkCircledIcon, ArchiveIcon, BackpackIcon } from "@radix-ui/react-icons";
import type { AccountItem } from "./accountMenu";

const icons = { user: PersonIcon, edit: Pencil1Icon, lock: LockClosedIcon, history: CounterClockwiseClockIcon, uid: IdCardIcon, wallet: BackpackIcon, card: CardStackIcon, bell: BellIcon, gear: GearIcon, agent: ArchiveIcon, help: QuestionMarkCircledIcon };

export default function AccountIcon({ name }: { name: AccountItem["icon"] }) {
  const Icon = icons[name];
  return <Icon />;
}
