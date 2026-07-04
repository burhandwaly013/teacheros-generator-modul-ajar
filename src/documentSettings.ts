// Pengaturan Dokumen — fondasi modular untuk Export Word & Print/PDF.
//
// Untuk menambah fitur baru di masa depan (Orientasi lanjutan, Header/Footer
// lanjutan, Watermark, Logo Sekolah, Template Dokumen, dst.), cukup:
//   1. Tambah field baru ke interface DocumentSettings di bawah.
//   2. Tambah nilai default-nya ke DEFAULT_DOCUMENT_SETTINGS.
//   3. Tambah kontrol UI-nya ke DocumentSettingsPanel.tsx.
// Konsumen (App.tsx, wordExport.ts, OutputSection.tsx) menerima seluruh
// object `DocumentSettings` apa adanya, jadi tidak perlu diubah setiap kali
// ada field baru ditambahkan.

export type PaperSize = "F4" | "A4";
export type Orientation = "portrait" | "landscape";
export type MarginPreset = "normal" | "narrow" | "wide" | "custom";
export type FontFamily = "Calibri" | "Times New Roman" | "Arial";
export type FontSize = 11 | 12;
export type LineSpacing = 1.15 | 1.5;

export interface MarginCm {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface DocumentSettings {
  paperSize: PaperSize;
  orientation: Orientation;
  marginPreset: MarginPreset;
  /** Dipakai hanya saat marginPreset === "custom" */
  customMargin: MarginCm;
  font: FontFamily;
  fontSize: FontSize;
  lineSpacing: LineSpacing;
  showPageNumber: boolean;
  showHeader: boolean;
  showFooter: boolean;
}

export const DEFAULT_MARGIN_CM: MarginCm = { top: 2, right: 2, bottom: 2, left: 2 };

export const DEFAULT_DOCUMENT_SETTINGS: DocumentSettings = {
  paperSize: "F4",
  orientation: "portrait",
  marginPreset: "normal",
  customMargin: { ...DEFAULT_MARGIN_CM },
  font: "Calibri",
  fontSize: 11,
  lineSpacing: 1.15,
  showPageNumber: true,
  showHeader: false,
  showFooter: false,
};

/** Ukuran kertas dalam mm (potret, sebelum dibalik untuk orientasi lanskap) */
export const PAPER_SIZES_MM: Record<PaperSize, { width: number; height: number }> = {
  F4: { width: 215.9, height: 330.2 },
  A4: { width: 210, height: 297 },
};

/** Preset margin dalam cm, seragam di keempat sisi — seperti Microsoft Word */
export const MARGIN_PRESETS_CM: Record<Exclude<MarginPreset, "custom">, MarginCm> = {
  normal: { top: 2, right: 2, bottom: 2, left: 2 },
  narrow: { top: 1.27, right: 1.27, bottom: 1.27, left: 1.27 },
  wide: { top: 3, right: 3, bottom: 3, left: 3 },
};

/** Margin efektif (cm) berdasarkan preset yang dipilih, atau nilai kustom kalau preset = "custom" */
export function getEffectiveMarginCm(
  settings: Pick<DocumentSettings, "marginPreset" | "customMargin">
): MarginCm {
  if (settings.marginPreset === "custom") return settings.customMargin;
  return MARGIN_PRESETS_CM[settings.marginPreset];
}

/** Dimensi halaman aktual (mm) setelah mempertimbangkan orientasi */
export function getPageDimensionsMm(settings: Pick<DocumentSettings, "paperSize" | "orientation">) {
  const base = PAPER_SIZES_MM[settings.paperSize];
  return settings.orientation === "landscape"
    ? { width: base.height, height: base.width }
    : { width: base.width, height: base.height };
}

/** Font-size dalam pt yang dipakai untuk elemen body/isi kecil (mengikuti proporsi fontSize utama) */
export function getBodySmallPt(settings: Pick<DocumentSettings, "fontSize">): number {
  return settings.fontSize - 1.5;
}
