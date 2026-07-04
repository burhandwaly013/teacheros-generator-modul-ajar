// Master Data — Jenjang Pendidikan
// Sumber kebenaran tunggal untuk daftar jenjang. Tambah jenjang baru (mis. PAUD)
// cukup dengan menambah 1 baris di JENJANG_OPTIONS + baris terkait di
// phases.ts, classes.ts, subjects/, dan tp/ — tidak perlu mengubah App.tsx.

export type Jenjang = "SD" | "SMP" | "SMA" | "SMK";

export interface JenjangOption {
  /** Kode stabil — dipakai sebagai key relasi & (nantinya) sinkronisasi dengan TeacherOS */
  kode: Jenjang;
  /** Label yang ditampilkan ke guru */
  label: string;
}

export const JENJANG_OPTIONS: JenjangOption[] = [
  { kode: "SD", label: "SD / MI" },
  { kode: "SMP", label: "SMP / MTs" },
  { kode: "SMA", label: "SMA / MA" },
  { kode: "SMK", label: "SMK / MAK" },
];

export function isJenjang(value: string): value is Jenjang {
  return JENJANG_OPTIONS.some((j) => j.kode === value);
}
