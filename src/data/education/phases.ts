// Master Data — Fase per Jenjang
import type { Jenjang } from "./educationLevels";

export const FASE_PER_JENJANG: Record<Jenjang, string[]> = {
  SD: ["A", "B", "C"],
  SMP: ["D"],
  SMA: ["E", "F"],
  SMK: ["E", "F"],
};

/** Daftar Fase yang valid untuk sebuah Jenjang. Aman dipanggil dengan jenjang kosong. */
export function getFaseOptions(jenjang: Jenjang | ""): string[] {
  return jenjang ? FASE_PER_JENJANG[jenjang] : [];
}
