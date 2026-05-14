import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Building2,
  Calculator,
  Calendar,
  Check,
  FileSpreadsheet,
  FileText,
  Landmark,
  Mail,
  Phone,
  PiggyBank,
  Receipt,
  Scale,
  Shield,
  Users,
  Wallet,
} from "lucide-react";

/** Ключі збігаються з `sanity/schemaTypes/featureItem.ts` → поле `icon`. */
const FEATURE_ICONS: Record<string, LucideIcon> = {
  check: Check,
  fileText: FileText,
  calculator: Calculator,
  building2: Building2,
  users: Users,
  briefcase: Briefcase,
  shield: Shield,
  receipt: Receipt,
  landmark: Landmark,
  scale: Scale,
  fileSpreadsheet: FileSpreadsheet,
  wallet: Wallet,
  piggyBank: PiggyBank,
  calendar: Calendar,
  phone: Phone,
  mail: Mail,
};

export function resolveFeatureIcon(name?: string | null): LucideIcon {
  const k = typeof name === "string" ? name.trim() : "";
  if (k && Object.prototype.hasOwnProperty.call(FEATURE_ICONS, k)) {
    return FEATURE_ICONS[k]!;
  }
  return Check;
}
