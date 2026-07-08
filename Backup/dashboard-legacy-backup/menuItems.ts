export type MenuStatus = "ready" | "comingSoon";
export type MenuKind = "screen" | "action";

export interface MenuItem {
  key: string;
  icon: string;
  label: string;
  kind: MenuKind;
  status: MenuStatus;
}

export const menuItems: MenuItem[] = [
  {
    key: "dashboard",
    icon: "🏠",
    label: "Dashboard",
    kind: "screen",
    status: "ready",
  },
  {
    key: "referensi",
    icon: "📚",
    label: "Referensi Pendidikan",
    kind: "screen",
    status: "comingSoon",
  },
  {
    key: "generator",
    icon: "📘",
    label: "Generator Modul Ajar",
    kind: "screen",
    status: "ready",
  },
  {
    key: "prompt-builder",
    icon: "✨",
    label: "Prompt Builder",
    kind: "screen",
    status: "comingSoon",
  },
  {
    key: "prota",
    icon: "📅",
    label: "PROTA",
    kind: "screen",
    status: "comingSoon",
  },
  {
    key: "promes",
    icon: "🗓️",
    label: "PROMES",
    kind: "screen",
    status: "comingSoon",
  },
  {
    key: "atp",
    icon: "🧭",
    label: "ATP",
    kind: "screen",
    status: "comingSoon",
  },
  {
    key: "lkpd",
    icon: "📄",
    label: "LKPD",
    kind: "screen",
    status: "comingSoon",
  },
  {
    key: "generator-soal",
    icon: "📝",
    label: "Generator Soal",
    kind: "screen",
    status: "comingSoon",
  },
  {
    key: "buku-harian",
    icon: "📒",
    label: "Buku Harian Guru",
    kind: "screen",
    status: "comingSoon",
  },
  {
    key: "profil",
    icon: "👤",
    label: "Profil",
    kind: "screen",
    status: "comingSoon",
  },
  {
    key: "pengaturan",
    icon: "⚙️",
    label: "Pengaturan",
    kind: "screen",
    status: "comingSoon",
  },
  {
    key: "logout",
    icon: "🚪",
    label: "Logout",
    kind: "action",
    status: "ready",
  },
];