// Master Data — titik masuk tunggal untuk seluruh data Jenjang/Fase/Kelas/
// Mata Pelajaran. App.tsx dan komponen lain HANYA perlu import dari file
// ini, tidak perlu tahu struktur folder internal src/data/.
//
// Aplikasi ini berperan sebagai AI Generator, bukan penyimpan database
// kurikulum nasional — Tujuan Pembelajaran tetap diisi manual oleh guru
// lewat textarea di App.tsx dan menjadi dasar AI membuat modul ajar.
//
// Menambah Jenjang baru (mis. PAUD) atau melengkapi data yang sudah ada
// cukup dilakukan di file-file src/data/** — tidak perlu mengubah App.tsx,
// OutputSection.tsx, atau wordExport.ts.

import type { Jenjang } from "./education/educationLevels";
import { JENJANG_OPTIONS, isJenjang } from "./education/educationLevels";
import { getFaseOptions } from "./education/phases";
import { getKelasOptions } from "./education/classes";
import { MAPEL_SD } from "./subjects/sd";
import { MAPEL_SMP } from "./subjects/smp";
import { MAPEL_SMA } from "./subjects/sma";
import { MAPEL_SMK } from "./subjects/smk";

export type { Jenjang };
export { JENJANG_OPTIONS, isJenjang, getFaseOptions, getKelasOptions };

const MAPEL_PER_JENJANG: Record<Jenjang, string[]> = {
  SD: MAPEL_SD,
  SMP: MAPEL_SMP,
  SMA: MAPEL_SMA,
  SMK: MAPEL_SMK,
};

/** Daftar Mata Pelajaran untuk sebuah Jenjang. Aman dipanggil dengan jenjang kosong. */
export function getMapelOptions(jenjang: Jenjang | ""): string[] {
  return jenjang ? MAPEL_PER_JENJANG[jenjang] : [];
}
