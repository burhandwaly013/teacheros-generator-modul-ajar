import type { LucideIcon } from "lucide-react";

import {
  House,
  LibraryBig,
  BookOpen,
  Sparkles,
  CalendarDays,
  CalendarRange,
  Compass,
  FileText,
  ClipboardList,
  NotebookPen,
  User,
  Settings,
  LogOut,
} from "lucide-react";

console.log("===== MENU V3 =====");

export type MenuStatus = "ready" | "comingSoon";
export type MenuKind = "screen" | "action";

export interface MenuItem {
  key: string;
  icon: LucideIcon;
  label: string;
  kind: MenuKind;
  status: MenuStatus;
}

export const menuItems: MenuItem[] = [
  {
    key: "dashboard",
    icon: House,
    label: "Dashboard",
    kind: "screen",
    status: "ready",
  },
  {
    key: "referensi",
    icon: LibraryBig,
    label: "Referensi Pendidikan",
    kind: "screen",
    status: "comingSoon",
  },
  {
    key: "generator-modul-ajar",
    icon: BookOpen,
    label: "Generator Modul Ajar",
    kind: "screen",
    status: "ready",
  },
  {
    key: "prompt-builder",
    icon: Sparkles,
    label: "Prompt Builder",
    kind: "screen",
    status: "comingSoon",
  },
  {
    key: "prota",
    icon: CalendarDays,
    label: "PROTA",
    kind: "screen",
    status: "comingSoon",
  },
  {
    key: "promes",
    icon: CalendarRange,
    label: "PROMES",
    kind: "screen",
    status: "comingSoon",
  },
  {
    key: "atp",
    icon: Compass,
    label: "ATP",
    kind: "screen",
    status: "comingSoon",
  },
  {
    key: "lkpd",
    icon: FileText,
    label: "LKPD",
    kind: "screen",
    status: "comingSoon",
  },
  {
    key: "generator-soal",
    icon: ClipboardList,
    label: "Generator Soal",
    kind: "screen",
    status: "comingSoon",
  },
  {
    key: "buku-harian",
    icon: NotebookPen,
    label: "Buku Harian Guru",
    kind: "screen",
    status: "comingSoon",
  },
  {
    key: "profil",
    icon: User,
    label: "Profil",
    kind: "screen",
    status: "comingSoon",
  },
  {
    key: "pengaturan",
    icon: Settings,
    label: "Pengaturan",
    kind: "screen",
    status: "comingSoon",
  },
  {
    key: "logout",
    icon: LogOut,
    label: "Logout",
    kind: "action",
    status: "ready",
  },
];

console.log(menuItems);