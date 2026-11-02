import { BellIcon, CardStackIcon, CounterClockwiseClockIcon, GearIcon, IdCardIcon, LockClosedIcon, Pencil1Icon, PersonIcon, QuestionMarkCircledIcon, ArchiveIcon, BackpackIcon, HomeIcon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import type { AccountIconName } from "./accountMenu";

const icons: Record<AccountIconName, typeof HomeIcon> = { home: HomeIcon, user: PersonIcon, edit: Pencil1Icon, lock: LockClosedIcon, history: CounterClockwiseClockIcon, uid: IdCardIcon, wallet: BackpackIcon, card: CardStackIcon, bell: BellIcon, gear: GearIcon, agent: ArchiveIcon, help: QuestionMarkCircledIcon, display: MixerHorizontalIcon };

export default function AccountIcon({ name }: { name: AccountIconName }) {
  const Icon = icons[name];
  return <Icon />;
}
