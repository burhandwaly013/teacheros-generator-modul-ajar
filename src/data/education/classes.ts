// Master Data — Kelas per Jenjang (format angka biasa, bukan angka Romawi)
import type { Jenjang } from "./educationLevels";

export const KELAS_PER_JENJANG: Record<Jenjang, string[]> = {
  SD: ["1", "2", "3", "4", "5", "6"],
  SMP: ["7", "8", "9"],
  SMA: ["10", "11", "12"],
  SMK: ["10", "11", "12"],
};

/** Daftar Kelas yang valid untuk sebuah Jenjang. Aman dipanggil dengan jenjang kosong. */
export function getKelasOptions(jenjang: Jenjang | ""): string[] {
  return jenjang ? KELAS_PER_JENJANG[jenjang] : [];
}
