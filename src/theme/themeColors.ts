// Theme System — Warna Identitas per Jenjang
//
// ==========================================================================
// SUMBER KEBENARAN TUNGGAL: seluruh warna identitas (brand) untuk setiap
// jenjang pendidikan (SD/MI, SMP/MTs, SMA/MA/SMK) di aplikasi TeacherOS
// berasal dari file ini. Kalau nanti warna salah satu jenjang ingin diganti,
// cukup ubah nilai hex di THEME_BY_JENJANG di bawah — TIDAK PERLU mengubah
// wordExport.ts atau file lain mana pun yang mengonsumsinya.
// ==========================================================================
//
// Catatan cakupan (Tahap 1): hanya 3 warna brand (primary, primaryLight,
// secondary) yang dibuat mengikuti jenjang. Warna semantik/netral (kotak
// info biru/kuning/hijau/ungu, border abu-abu, teks) SENGAJA tidak masuk ke
// sini — maknanya universal (mis. hijau = jawaban benar) dan harus tetap
// konsisten di semua jenjang, terlepas dari warna identitasnya.

import type { Jenjang } from "../data";

export interface ThemeColors {
  /** Warna utama — dipakai untuk header section, kop dokumen, aksen utama */
  primary: string;
  /** Varian terang dari primary — dipakai untuk latar kop/kotak identitas */
  primaryLight: string;
  /** Warna sekunder — dipakai untuk header pertemuan/aksen kedua */
  secondary: string;
}

export const THEME_BY_JENJANG: Record<Jenjang, ThemeColors> = {
  SD: {
    primary: "991B1B",
    primaryLight: "FEF2F2",
    secondary: "BE123C",
  },
  SMP: {
    primary: "1E3A8A",
    primaryLight: "EFF6FF",
    secondary: "2563EB",
  },
  SMA: {
    primary: "374151",
    primaryLight: "F3F4F6",
    secondary: "6B7280",
  },
  SMK: {
    primary: "374151",
    primaryLight: "F3F4F6",
    secondary: "6B7280",
  },
};

/**
 * Ambil ThemeColors untuk sebuah Jenjang. Kalau jenjang kosong/tidak
 * dikenali (mis. modul lama sebelum field Jenjang ada), fallback ke tema
 * SD — menjaga kompatibilitas mundur, tidak pernah melempar error.
 */
export function getThemeColors(jenjang: Jenjang | "" | undefined): ThemeColors {
  if (jenjang && THEME_BY_JENJANG[jenjang]) {
    return THEME_BY_JENJANG[jenjang];
  }
  return THEME_BY_JENJANG.SD;
}