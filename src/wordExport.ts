import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType,
  VerticalAlign,
  PageOrientation,
  Header,
  Footer,
  PageNumber,
  TabStopType,
  LineRuleType,
  convertMillimetersToTwip,
} from "docx";
import type { IParagraphOptions, ITableRowOptions } from "docx";
import { saveAs } from "file-saver";
import type { FormData, SigData } from "./constants";
import { DIMENSI_MAP } from "./constants";
import type { MCQ } from "./mcqGenerator";
import { parseTime, distributeTime, buildPertemuan, buildRubrik } from "./helpers";
import { DEFAULT_DOCUMENT_SETTINGS, getEffectiveMarginCm, getPageDimensionsMm } from "./documentSettings";
import type { DocumentSettings } from "./documentSettings";
import { getThemeColors, THEME_BY_JENJANG } from "./theme/themeColors";
// Warna identitas (primary/primaryLight/secondary) aktif untuk pemanggilan
// generateWordDocument() saat ini — diisi di awal fungsi berdasarkan
// data.jenjang, memakai satu-satunya sumber warna: src/theme/themeColors.ts.
// Mengikuti pola persis seperti `activeSettings` (Font/Ukuran Font) yang
// sudah ada, supaya konsisten dan tidak perlu mengubah pemanggilan lain.
let activeTheme = THEME_BY_JENJANG.SD;
// Color definitions (without #)
const COLORS = {
  get primary() { return activeTheme.primary; },
  get primaryLight() { return activeTheme.primaryLight; },
  get secondary() { return activeTheme.secondary; },
  blue: "EFF6FF",
  yellow: "FFFBEB",
  green: "F0FDF4",
  greenText: "166534",
  purple: "FAF5FF",
  gray: "F3F4F6",
  grayBorder: "D1D5DB",
  text: "1F2937",
  textLight: "6B7280",
  white: "FFFFFF",
};

// Pengaturan Dokumen aktif untuk pemanggilan generateWordDocument() saat ini.
// Diset di awal generateWordDocument() (satu-satunya entry point export),
// sehingga txt() bisa mengikuti Font/Ukuran Font tanpa perlu mengubah setiap
// pemanggilan txt() satu per satu di seluruh file (seminimal mungkin).
let activeSettings: DocumentSettings = DEFAULT_DOCUMENT_SETTINGS;

// Simple text run creator
function txt(text: string, opts: { bold?: boolean; italic?: boolean; size?: number; color?: string } = {}): TextRun {
  // size 11 adalah konvensi baku "Isi" (lihat sesi standarisasi typography) —
  // kalau pemanggil memakainya (atau tidak memberi size sama sekali), ikuti
  // Ukuran Font dari Pengaturan Dokumen. Heading yang memberi size eksplisit
  // (12/14/16) tidak pernah bernilai 11, jadi tetap tidak terpengaruh.
  const resolvedSize = !opts.size || opts.size === 11 ? activeSettings.fontSize : opts.size;
  return new TextRun({
    text,
    bold: opts.bold || false,
    italics: opts.italic || false,
    size: resolvedSize * 2,
    color: opts.color || COLORS.text,
    font: activeSettings.font,
  });
}

// Simple paragraph creator
function para(children: TextRun[], opts: Partial<IParagraphOptions> = {}): Paragraph {
  return new Paragraph({
    children,
    spacing: { before: 100, after: 100 },
    ...opts,
  });
}

// Table cell borders
const cellBorders = {
  top: { style: BorderStyle.SINGLE, size: 4, color: COLORS.grayBorder },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: COLORS.grayBorder },
  left: { style: BorderStyle.SINGLE, size: 4, color: COLORS.grayBorder },
  right: { style: BorderStyle.SINGLE, size: 4, color: COLORS.grayBorder },
};

// Table cell padding — kiri/kanan dilebarkan supaya teks tidak mepet ke border
const cellMargins = { top: 60, bottom: 60, left: 120, right: 120 };

// Create table cell
function cell(content: string, opts: { bold?: boolean; shading?: string; width?: number } = {}): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        children: [txt(content, { bold: opts.bold, size: 11 })],
        spacing: { before: 60, after: 60 },
      }),
    ],
    borders: cellBorders,
    verticalAlign: VerticalAlign.CENTER,
    margins: cellMargins,
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
  });
}

// Create table cell with paragraphs
function cellP(paragraphs: Paragraph[], opts: { shading?: string; width?: number } = {}): TableCell {
  return new TableCell({
    children: paragraphs,
    borders: cellBorders,
    verticalAlign: VerticalAlign.CENTER,
    margins: cellMargins,
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
  });
}

// Create table row
function row(cells: TableCell[], opts: Partial<ITableRowOptions> = {}): TableRow {
  return new TableRow({ cantSplit: true, children: cells, ...opts });
}

// Create simple table
function table(rows: TableRow[]): Table {
  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

// Section header (red background)
function sectionHeader(title: string): Paragraph {
  return new Paragraph({
    children: [txt(title, { bold: true, color: COLORS.white, size: 16 })],
    shading: { fill: COLORS.primary, type: ShadingType.CLEAR },
    spacing: { before: 300, after: 150 },
    indent: { left: 100, right: 100 },
    keepNext: true,
  });
}

// Subsection header
function subHeader(title: string): Paragraph {
  return new Paragraph({
    children: [txt(title, { bold: true, color: COLORS.primary, size: 14 })],
    spacing: { before: 240, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.primaryLight } },
    keepNext: true,
  });
}

// Pertemuan header
function pertemuanHeader(num: number, total: number): Paragraph {
  return new Paragraph({
    children: [txt(`PERTEMUAN ${num}${total > 1 ? ` DARI ${total}` : ""}`, { bold: true, color: COLORS.white, size: 12 })],
    shading: { fill: COLORS.secondary, type: ShadingType.CLEAR },
    spacing: { before: 200, after: 100 },
    indent: { left: 100, right: 100 },
    keepNext: true,
  });
}

// Bullet point
function bullet(text: string, opts: { shading?: string } = {}): Paragraph {
  return new Paragraph({
    children: [txt(`•  ${text}`, { size: 11 })],
    spacing: { before: 40, after: 40 },
    indent: { left: 300 },
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
  });
}

// Generate the Word document
export async function generateWordDocument(
  data: FormData,
  sig: SigData,
  mcqs: MCQ[],
  settings: DocumentSettings = DEFAULT_DOCUMENT_SETTINGS
): Promise<void> {
  activeSettings = settings;
  activeTheme = getThemeColors(data.jenjang as Parameters<typeof getThemeColors>[0]);
  try {
    const totalMenit = parseTime(data.waktu);
    const { awal, inti, penutup } = distributeTime(totalMenit);
    const dims = data.dimensi || [];
    const metodes = data.metode || [];
    const ling = data.lingkungan || [];
    const sigTgl = [sig.tglHari, sig.tglBulan, sig.tglTahun].filter(Boolean).join(" ");
    const jumlahPertemuan = Math.max(parseInt(data.jumlahPertemuan) || 1, 1);
    const rubrik = buildRubrik(data);
    const pakaiKelompok = metodes.includes("Diskusi Kelompok");
    const pakaiPresentasi = metodes.includes("Presentasi");
    const kepalaSekolahLabel = data.sekolah ? `Kepala ${data.sekolah}` : "Kepala Satuan Pendidikan";

    const pertemuanList = Array.from({ length: jumlahPertemuan }, (_, idx) =>
      buildPertemuan(idx, jumlahPertemuan, data, awal, inti, penutup, pakaiKelompok, pakaiPresentasi)
    );

    const children: (Paragraph | Table)[] = [];

    // ===== HEADER =====
    children.push(
      new Paragraph({
        children: [txt("MODUL AJAR DEEP LEARNING", { bold: true, size: 16, color: COLORS.primary })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        shading: { fill: COLORS.primaryLight, type: ShadingType.CLEAR },
        border: {
          top: { style: BorderStyle.DOUBLE, size: 2, color: COLORS.primary },
          left: { style: BorderStyle.DOUBLE, size: 2, color: COLORS.primary },
          right: { style: BorderStyle.DOUBLE, size: 2, color: COLORS.primary },
        },
      }),
      new Paragraph({
        children: [txt("KURIKULUM MERDEKA", { bold: true, size: 12, color: COLORS.primary })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
        shading: { fill: COLORS.primaryLight, type: ShadingType.CLEAR },
        border: {
          left: { style: BorderStyle.DOUBLE, size: 2, color: COLORS.primary },
          right: { style: BorderStyle.DOUBLE, size: 2, color: COLORS.primary },
        },
      }),
      new Paragraph({
        children: [txt("(Bermakna, Berkesadaran, Menggembirakan)", { italic: true, size: 11, color: COLORS.textLight })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 300 },
        shading: { fill: COLORS.primaryLight, type: ShadingType.CLEAR },
        border: {
          bottom: { style: BorderStyle.DOUBLE, size: 2, color: COLORS.primary },
          left: { style: BorderStyle.DOUBLE, size: 2, color: COLORS.primary },
          right: { style: BorderStyle.DOUBLE, size: 2, color: COLORS.primary },
        },
      })
    );

    // ===== A. IDENTITAS MODUL =====
    children.push(sectionHeader("A. IDENTITAS MODUL"));

    const identitasData = [
      ["Nama Penyusun", data.nama || "-"],
      ["Satuan Pendidikan", data.sekolah || "-"],
      ["Tahun Ajaran", data.tahun || "-"],
      ["Jenjang", data.jenjang || "-"],
      ["Mata Pelajaran", data.mapel || "-"],
      ["Fase / Kelas", `${data.fase || "-"} / ${data.kelas || "-"}`],
      ["Semester", data.semester || "-"],
      ["Topik/Materi Pembelajaran", data.tema || "-"],
      ["Alokasi Waktu", data.waktu || "-"],
      ["Jumlah Pertemuan", `${jumlahPertemuan} Kali Pertemuan`],
    ];

    children.push(table(
      identitasData.map((r, i) => row([
        cell(r[0], { bold: true, width: 35, shading: i % 2 === 0 ? COLORS.gray : undefined }),
        cell(`: ${r[1]}`, { width: 65, shading: i % 2 === 0 ? COLORS.gray : undefined }),
      ]))
    ));

    // ===== B. IDENTIFIKASI PESERTA DIDIK =====
    children.push(sectionHeader("B. IDENTIFIKASI PESERTA DIDIK"));
    children.push(subHeader("1. Karakteristik Peserta Didik"));

    const karakteristik = [
      `Siswa kelas ${data.kelas || "..."} berada pada tahap perkembangan kognitif konkret-operasional dengan rentang perhatian 15–20 menit per sesi.`,
      "Sebagian besar siswa bergantung pada media visual (gambar, warna, video) untuk memahami materi baru secara efektif.",
      "Pendekatan Total Physical Response (TPR) efektif untuk mengaitkan konsep abstrak dengan aktivitas fisik yang konkret.",
      "Variasi kemampuan antar siswa cukup signifikan; diferensiasi konten, proses, dan produk sangat diperlukan.",
      "Siswa termotivasi tinggi oleh permainan, lagu, dan kompetisi positif yang menyenangkan.",
    ];
    karakteristik.forEach(k => children.push(bullet(k)));

    children.push(subHeader("2. Kebutuhan Belajar Khusus"));
    children.push(table([
      row([
        cell("Kelompok Siswa", { bold: true, shading: COLORS.primaryLight }),
        cell("Karakteristik", { bold: true, shading: COLORS.primaryLight }),
        cell("Solusi / Strategi Diferensiasi", { bold: true, shading: COLORS.primaryLight }),
      ]),
      row([
        cell("Slow Learners"),
        cell("Membutuhkan waktu lebih lama untuk memproses dan memahami materi baru"),
        cell(`Gunakan media visual, scaffolding bertahap, word bank, dan contoh konkret sesuai topik "${data.tema || "-"}"`),
      ]),
      row([
        cell("Advanced Learners", { shading: COLORS.gray }),
        cell("Cepat selesai dan membutuhkan tantangan yang lebih kompleks", { shading: COLORS.gray }),
        cell(`Berikan tugas pengayaan: membuat proyek lanjutan, menganalisis masalah nyata, atau menjadi tutor sebaya`, { shading: COLORS.gray }),
      ]),
      row([
        cell("Shy Learners"),
        cell("Enggan berbicara atau tampil di depan kelas secara langsung"),
        cell("Gunakan pair-work dan kelompok kecil 2–3 orang; berikan penguatan positif; mulai dari peran yang lebih kecil"),
      ]),
    ]));

    children.push(subHeader("3. Minat dan Motivasi"));
    children.push(para([
      txt(`Untuk membangun ketertarikan dan motivasi belajar siswa secara optimal terhadap topik `, { size: 11 }),
      txt(data.tema || "pembelajaran ini", { bold: true, size: 11 }),
      txt(`, guru menerapkan beberapa pendekatan berikut:`, { size: 11 }),
    ]));

    const minatItems = [
      "Aktivitas Tematik yang Relevan: Kegiatan pembelajaran dirancang agar berkaitan langsung dengan topik dan kehidupan nyata siswa.",
      "Roleplay dan Simulasi Interaktif: Siswa diajak melakukan simulasi situasi autentik yang berhubungan dengan materi.",
      "Penyajian Konteks Dunia Nyata: Guru menampilkan contoh-contoh konkret penerapan materi dalam kehidupan sehari-hari.",
      "Kompetisi Positif yang Memotivasi: Penggunaan kuis interaktif berbasis aplikasi seperti Quizizz atau Kahoot.",
      "Penghargaan dan Apresiasi Berkelanjutan: Guru memberikan pujian dan apresiasi atas usaha dan pencapaian siswa.",
    ];
    minatItems.forEach(m => children.push(bullet(m)));

    // ===== C. DIMENSI PROFIL LULUSAN =====
    if (dims.length > 0) {
      children.push(sectionHeader("C. DIMENSI PROFIL LULUSAN"));
      children.push(table([
        row([
          cell("Dimensi", { bold: true, shading: COLORS.primaryLight }),
          cell("Indikator Pencapaian", { bold: true, shading: COLORS.primaryLight }),
          cell("Aktivitas Pembelajaran", { bold: true, shading: COLORS.primaryLight }),
          cell("Hasil yang Diharapkan", { bold: true, shading: COLORS.primaryLight }),
        ]),
        ...dims.map((d, i) => {
          const r = DIMENSI_MAP[d] || { ind: "-", akt: "-", hasil: "-" };
          const bg = i % 2 === 1 ? COLORS.gray : undefined;
          return row([
            cell(d, { shading: bg }),
            cell(r.ind, { shading: bg }),
            cell(r.akt, { shading: bg }),
            cell(r.hasil, { shading: bg }),
          ]);
        }),
      ]));
    }

    // ===== D. DESAIN PEMBELAJARAN =====
    children.push(sectionHeader("D. DESAIN PEMBELAJARAN"));
    children.push(subHeader("1. Tujuan Pembelajaran"));
    children.push(new Paragraph({
      children: [txt(data.tujuan || "-", { size: 11 })],
      spacing: { before: 60, after: 150 },
      shading: { fill: COLORS.blue, type: ShadingType.CLEAR },
      indent: { left: 100, right: 100 },
    }));

    if (data.lintasDisiplin) {
      children.push(subHeader("2. Lintas Disiplin Ilmu"));
      children.push(new Paragraph({
        children: [txt(data.lintasDisiplin, { size: 11 })],
        spacing: { before: 60, after: 150 },
        shading: { fill: COLORS.purple, type: ShadingType.CLEAR },
        indent: { left: 100, right: 100 },
      }));
    }

    const praktikNum = data.lintasDisiplin ? "3" : "2";
    children.push(subHeader(`${praktikNum}. Praktik Pedagogis (Deep Learning)`));
    children.push(table([
      row([
        cell("Fase Deep Learning", { bold: true, shading: COLORS.primaryLight }),
        cell("Strategi Pedagogis", { bold: true, shading: COLORS.primaryLight }),
        cell("Implementasi dalam Pembelajaran", { bold: true, shading: COLORS.primaryLight }),
      ]),
      row([
        cell("Bermakna (Meaningful)"),
        cell("Kontekstualisasi materi dengan pengalaman nyata siswa"),
        cell(`Mengaitkan topik "${data.tema || "-"}" dengan situasi kehidupan sehari-hari`),
      ]),
      row([
        cell("Berkesadaran (Mindful)", { shading: COLORS.gray }),
        cell("Refleksi metakognitif dan penguatan kesadaran belajar", { shading: COLORS.gray }),
        cell(`Jurnal belajar: "Apa yang saya pelajari tentang ${data.tema || "-"}?"`, { shading: COLORS.gray }),
      ]),
      row([
        cell("Menggembirakan (Joyful)"),
        cell("Gamifikasi, aktivitas kolaboratif, pembelajaran berbasis permainan"),
        cell(`Permainan edukatif, kompetisi positif berbasis topik "${data.tema || "-"}"`),
      ]),
      row([
        cell("Refleksi", { shading: COLORS.gray }),
        cell("Evaluasi diri dan umpan balik berkelanjutan", { shading: COLORS.gray }),
        cell("Siswa mengisi lembar refleksi dan mendiskusikannya bersama guru", { shading: COLORS.gray }),
      ]),
      row([
        cell("Berbasis Masalah"),
        cell("Pemecahan masalah autentik yang relevan"),
        cell("Siswa merancang solusi nyata atas permasalahan terkait materi"),
      ]),
    ]));

    // Kemitraan Belajar
    const kemitraanNum = data.lintasDisiplin ? "4" : "3";
    children.push(subHeader(`${kemitraanNum}. Kemitraan Belajar`));
    const kemitraanItems = [
      "Peer Teaching: Siswa yang telah memahami materi membimbing teman sebayanya.",
      "Kerja Kelompok Terstruktur: Siswa dibagi dalam kelompok 3–4 orang untuk menyelesaikan LKPD kolaboratif.",
      "Guru sebagai Fasilitator: Guru memantau proses belajar dan memberikan umpan balik konstruktif.",
      "Peran Orang Tua: Orang tua dilibatkan sebagai mitra belajar di rumah.",
    ];
    kemitraanItems.forEach(k => children.push(bullet(k)));

    // Lingkungan Belajar
    const lingkunganNum = data.lintasDisiplin ? "5" : "4";
    children.push(subHeader(`${lingkunganNum}. Lingkungan Belajar`));
    if (ling.includes("Ruang Fisik (Kelas)")) {
      children.push(bullet("Ruang Fisik (Kelas): Penataan meja fleksibel, pojok baca, area display karya siswa."));
    }
    if (ling.includes("Ruang Virtual (Online)")) {
      children.push(bullet("Ruang Virtual (Online): Platform digital untuk penugasan dan kuis interaktif."));
    }
    if (ling.length === 0) {
      children.push(bullet("Belum dipilih."));
    }

    // Pemanfaatan Teknologi
    const teknoNum = data.lintasDisiplin ? "6" : "5";
    children.push(subHeader(`${teknoNum}. Pemanfaatan Teknologi Digital`));
    const mediaItems = (data.media || "").split(/[,\n]/).map(m => m.trim()).filter(Boolean);
    mediaItems.forEach(m => children.push(bullet(m)));
    if (metodes.length > 0) {
      children.push(bullet(`Metode aktif: ${metodes.join(", ")}`));
    }

    // ===== E. PENGALAMAN BELAJAR =====
    children.push(sectionHeader("E. PENGALAMAN BELAJAR"));
    children.push(subHeader("1. Eksplorasi dan Koneksi Konsep Awal"));
    children.push(para([txt("Guru membuka eksplorasi dengan pertanyaan pemantik:", { size: 11 })]));

    const eksplorasiQ = [
      `"Apa yang sudah kalian ketahui tentang ${data.tema || "topik ini"}?"`,
      `"Di mana kalian pernah menemukan hal yang berhubungan dengan ${data.tema || "topik ini"}?"`,
      `"Mengapa penting mempelajari ${data.tema || "topik ini"}?"`,
      `"Bagaimana cara belajar tentang ${data.tema || "topik ini"} yang menyenangkan?"`,
      `"Apa hal paling menarik yang ingin kalian pelajari tentang ${data.tema || "topik ini"}?"`,
    ];
    eksplorasiQ.forEach(q => children.push(bullet(q, { shading: COLORS.yellow })));

    children.push(subHeader("2. Aplikasi dalam Kehidupan Nyata"));
    children.push(table([
      row([
        cell("Peran", { bold: true, shading: COLORS.primaryLight, width: 15 }),
        cell("Dialog / Aktivitas", { bold: true, shading: COLORS.primaryLight, width: 85 }),
      ]),
      row([cell("Guru"), cell(`Hari ini kita akan mempelajari ${data.tema || "topik ini"}. Siapa yang bisa cerita pengalaman mereka?`)]),
      row([cell("Siswa A", { shading: COLORS.gray }), cell("Saya pernah melihatnya, Bu/Pak! Waktu itu saya sedang...", { shading: COLORS.gray })]),
      row([cell("Guru"), cell("Wah, pengalaman yang menarik! Bagaimana perasaanmu saat itu?")]),
      row([cell("Siswa B", { shading: COLORS.gray }), cell("Saya belum terlalu paham, Bu/Pak. Bisa dijelaskan dari awal?", { shading: COLORS.gray })]),
      row([cell("Guru"), cell("Tentu! Mari kita pelajari bersama langkah demi langkah dengan cara menyenangkan.")]),
    ]));

    children.push(subHeader("3. Merefleksikan"));
    const refleksiQ = [
      `"Apa hal paling penting yang kamu pelajari hari ini tentang ${data.tema || "topik ini"}?"`,
      `"Bagaimana kamu akan menerapkan pengetahuan ini dalam kehidupan sehari-hari?"`,
      `"Apa yang masih membingungkan atau belum kamu pahami sepenuhnya?"`,
      `"Bagaimana perasaanmu selama proses belajar hari ini?"`,
      `"Jika kamu harus menjelaskan topik ini kepada temanmu, apa yang akan kamu sampaikan?"`,
    ];
    refleksiQ.forEach((q, i) => children.push(new Paragraph({
      children: [txt(`${i + 1}. ${q}`, { size: 11, italic: true })],
      spacing: { before: 40, after: 40 },
      indent: { left: 300 },
      shading: { fill: COLORS.blue, type: ShadingType.CLEAR },
    })));

    // ===== F. KEGIATAN PEMBELAJARAN =====
    children.push(sectionHeader("F. KEGIATAN PEMBELAJARAN"));

    pertemuanList.forEach((p) => {
      children.push(pertemuanHeader(p.ke, jumlahPertemuan));
      children.push(new Paragraph({
        children: [
          txt(`Fokus Pertemuan ${p.ke}: `, { bold: true, size: 11 }),
          txt(p.fokus, { size: 11 }),
        ],
        spacing: { before: 60, after: 150 },
        shading: { fill: COLORS.yellow, type: ShadingType.CLEAR },
        indent: { left: 100, right: 100 },
      }));

      // Kegiatan Awal
      children.push(para([txt("Kegiatan Awal", { bold: true, size: 14, color: COLORS.primary })]));
      children.push(table([
        row([
          cell("No.", { bold: true, shading: COLORS.primaryLight, width: 8 }),
          cell("Deskripsi Kegiatan", { bold: true, shading: COLORS.primaryLight, width: 77 }),
          cell("Waktu", { bold: true, shading: COLORS.primaryLight, width: 15 }),
        ]),
        ...p.awa.map((r, i) => row([
          cell(r[0], { shading: i % 2 === 1 ? COLORS.gray : undefined }),
          cell(r[1], { shading: i % 2 === 1 ? COLORS.gray : undefined }),
          cell(r[2], { shading: i % 2 === 1 ? COLORS.gray : undefined }),
        ])),
      ]));

      // Kegiatan Inti
      children.push(para([txt("Kegiatan Inti", { bold: true, size: 14, color: COLORS.primary })]));
      children.push(table([
        row([
          cell("No.", { bold: true, shading: COLORS.primaryLight, width: 8 }),
          cell("Deskripsi Kegiatan", { bold: true, shading: COLORS.primaryLight, width: 77 }),
          cell("Waktu", { bold: true, shading: COLORS.primaryLight, width: 15 }),
        ]),
        ...p.inti.map((r, i) => row([
          cell(r[0], { shading: i % 2 === 1 ? COLORS.gray : undefined }),
          cell(r[1], { shading: i % 2 === 1 ? COLORS.gray : undefined }),
          cell(r[2], { shading: i % 2 === 1 ? COLORS.gray : undefined }),
        ])),
      ]));

      // Kegiatan Penutup
      children.push(para([txt("Kegiatan Penutup", { bold: true, size: 14, color: COLORS.primary })]));
      children.push(table([
        row([
          cell("No.", { bold: true, shading: COLORS.primaryLight, width: 8 }),
          cell("Deskripsi Kegiatan", { bold: true, shading: COLORS.primaryLight, width: 77 }),
          cell("Waktu", { bold: true, shading: COLORS.primaryLight, width: 15 }),
        ]),
        ...p.penutup.map((r, i) => row([
          cell(r[0], { shading: i % 2 === 1 ? COLORS.gray : undefined }),
          cell(r[1], { shading: i % 2 === 1 ? COLORS.gray : undefined }),
          cell(r[2], { shading: i % 2 === 1 ? COLORS.gray : undefined }),
        ])),
      ]));
    });

    // ===== G. INSTRUMEN PENILAIAN =====
    children.push(sectionHeader("G. INSTRUMEN PENILAIAN"));
    children.push(subHeader("1. Instrumen Dimensi Profil Lulusan (Observasi)"));

    const dimRows = dims.length > 0
      ? dims.map((d, i) => {
          const r = DIMENSI_MAP[d] || { ind: "-", bukti: "-" };
          const bg = i % 2 === 1 ? COLORS.gray : undefined;
          return row([
            cell(d, { shading: bg }),
            cell(r.ind, { shading: bg }),
            cell(r.bukti, { shading: bg }),
            cell("□", { shading: bg }),
            cell("□", { shading: bg }),
            cell("□", { shading: bg }),
            cell("□", { shading: bg }),
          ]);
        })
      : [row([cell("(Belum ada dimensi dipilih)"), cell("—"), cell("—"), cell("—"), cell("—"), cell("—"), cell("—")])];

    children.push(table([
      row([
        cell("Dimensi", { bold: true, shading: COLORS.primaryLight }),
        cell("Indikator", { bold: true, shading: COLORS.primaryLight }),
        cell("Bukti/Evidence", { bold: true, shading: COLORS.primaryLight }),
        cell("BB(1)", { bold: true, shading: COLORS.primaryLight }),
        cell("MB(2)", { bold: true, shading: COLORS.primaryLight }),
        cell("BSH(3)", { bold: true, shading: COLORS.primaryLight }),
        cell("SB(4)", { bold: true, shading: COLORS.primaryLight }),
      ]),
      ...dimRows,
    ]));

    children.push(para([txt("BB=Belum Berkembang | MB=Mulai Berkembang | BSH=Berkembang Sesuai Harapan | SB=Sangat Berkembang", { size: 11, color: COLORS.textLight })]));

    // LKPD Soal
    children.push(subHeader("2. Penilaian Akhir / LKPD (10 Soal Pilihan Ganda)"));

    if (mcqs.length > 0) {
      mcqs.forEach((q, i) => {
        children.push(new Paragraph({
          children: [txt(`${i + 1}. ${q.q}`, { bold: true, size: 11 })],
          spacing: { before: 150, after: 80 },
          shading: { fill: COLORS.gray, type: ShadingType.CLEAR },
          indent: { left: 100, right: 100 },
        }));

        ["A", "B", "C", "D"].forEach((opt, j) => {
          const isCorrect = q.ans === opt;
          children.push(new Paragraph({
            children: [
              txt(`${opt}. `, { bold: isCorrect, size: 11, color: isCorrect ? COLORS.greenText : COLORS.text }),
              txt(q.opts[j] || "", { bold: isCorrect, size: 11, color: isCorrect ? COLORS.greenText : COLORS.text }),
            ],
            spacing: { before: 30, after: 30 },
            indent: { left: 400 },
          }));
        });

        if (q.explanation) {
          children.push(new Paragraph({
            children: [
              txt(`✓ Kunci: ${q.ans} — `, { bold: true, size: 11, color: COLORS.greenText }),
              txt(q.explanation, { size: 11, color: COLORS.greenText }),
            ],
            spacing: { before: 50, after: 100 },
            indent: { left: 400 },
            shading: { fill: COLORS.green, type: ShadingType.CLEAR },
          }));
        }
      });
    } else {
      children.push(para([txt("(Soal akan ditampilkan setelah generate)", { size: 11, italic: true })]));
    }

    // Rubrik Penilaian
    children.push(subHeader("3. Penilaian Keterampilan (Rubrik 1–4)"));
    children.push(table([
      row([
        cell("Aspek", { bold: true, shading: COLORS.primaryLight }),
        cell("Skor 1 (Kurang)", { bold: true, shading: COLORS.primaryLight }),
        cell("Skor 2 (Cukup)", { bold: true, shading: COLORS.primaryLight }),
        cell("Skor 3 (Baik)", { bold: true, shading: COLORS.primaryLight }),
        cell("Skor 4 (Sangat Baik)", { bold: true, shading: COLORS.primaryLight }),
      ]),
      ...rubrik.map((r, i) => {
        const bg = i % 2 === 1 ? COLORS.gray : undefined;
        return row([
          cell(r.aspek, { shading: bg }),
          cell(r.k1, { shading: bg }),
          cell(r.k2, { shading: bg }),
          cell(r.k3, { shading: bg }),
          cell(r.k4, { shading: bg }),
        ]);
      }),
    ]));

    children.push(new Paragraph({
      children: [
        txt("Perhitungan Nilai: ", { bold: true, size: 11 }),
        txt("Nilai = (Total Skor / 16) × 100  |  ", { size: 11 }),
        txt("Kriteria: ", { bold: true, size: 11 }),
        txt("90–100 = A | 75–89 = B | 60–74 = C | <60 = D", { size: 11 }),
      ],
      spacing: { before: 100, after: 250 },
      shading: { fill: COLORS.blue, type: ShadingType.CLEAR },
      indent: { left: 100, right: 100 },
    }));

    // ===== TANDA TANGAN =====
    children.push(new Paragraph({
      children: [],
      spacing: { before: 300, after: 0 },
      border: { top: { style: BorderStyle.SINGLE, size: 2, color: COLORS.grayBorder } },
    }));

    children.push(table([
      row([
        cellP([
          para([txt("Mengetahui,", { size: 11 })], { alignment: AlignmentType.CENTER, spacing: { after: 20, line: 240, lineRule: LineRuleType.AUTO } }),
          para([txt(`${kepalaSekolahLabel},`, { bold: true, size: 11 })], { alignment: AlignmentType.CENTER, spacing: { after: 20, line: 240, lineRule: LineRuleType.AUTO } }),
        ], { width: 50 }),
        cellP([
          para([txt(`${sig.tempat || "________________"}, ${sigTgl || "________________"}`, { size: 11 })], { alignment: AlignmentType.CENTER, spacing: { after: 20, line: 240, lineRule: LineRuleType.AUTO } }),
          para([txt(`Guru ${data.mapel || ""},`, { bold: true, size: 11 })], { alignment: AlignmentType.CENTER, spacing: { after: 20, line: 240, lineRule: LineRuleType.AUTO } }),
        ], { width: 50 }),
      ]),
      row([
        cellP([para([txt("", { size: 11 })], { spacing: { before: 800, after: 0 } })]),
        cellP([para([txt("", { size: 11 })], { spacing: { before: 800, after: 0 } })]),
      ]),
      row([
        cellP([
          para([txt(sig.kepalaName || "________________________", { bold: true, size: 11 })], { alignment: AlignmentType.CENTER, spacing: { after: 20, line: 240, lineRule: LineRuleType.AUTO } }),
          para([txt(`NIP. ${sig.kepalaNip || "________________________"}`, { size: 11 })], { alignment: AlignmentType.CENTER, spacing: { after: 0, line: 240, lineRule: LineRuleType.AUTO } }),
        ]),
        cellP([
          para([txt(sig.guruName || "________________________", { bold: true, size: 11 })], { alignment: AlignmentType.CENTER, spacing: { after: 20, line: 240, lineRule: LineRuleType.AUTO } }),
          para([txt(`NIP. ${sig.guruNip || "________________________"}`, { size: 11 })], { alignment: AlignmentType.CENTER, spacing: { after: 0, line: 240, lineRule: LineRuleType.AUTO } }),
        ]),
      ]),
    ]));

    // Create document
    const { width: pageWmm, height: pageHmm } = getPageDimensionsMm(settings);
    const marginCm = getEffectiveMarginCm(settings);
    const mgn = {
      top: marginCm.top * 10,
      right: marginCm.right * 10,
      bottom: marginCm.bottom * 10,
      left: marginCm.left * 10,
    };
    const lineSpacingUnits = Math.round(settings.lineSpacing * 240);

    const headerObj = settings.showHeader
      ? {
          default: new Header({
            children: [
              new Paragraph({
                tabStops: [{ type: TabStopType.RIGHT, position: convertMillimetersToTwip(pageWmm - mgn.left - mgn.right) }],
                children: [
                  txt(data.sekolah || "-", { bold: true, size: 10 }),
                  new TextRun({ text: "\t" }),
                  txt(data.tema || "-", { size: 10 }),
                ],
                border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: COLORS.grayBorder } },
                spacing: { after: 100 },
              }),
            ],
          }),
        }
      : undefined;

    const footerChildren: TextRun[] = [
      txt(data.nama || "-", { size: 10 }),
      new TextRun({ text: "   |   " }),
      txt(`Tahun Ajaran ${data.tahun || "-"}`, { size: 10 }),
    ];
    if (settings.showPageNumber) {
      footerChildren.push(
        new TextRun({ text: "   |   " }),
        txt("Halaman ", { size: 10 }),
        new TextRun({ children: [PageNumber.CURRENT], size: 20 }),
        txt(" dari ", { size: 10 }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 20 })
      );
    }
    const footerObj = settings.showFooter
      ? {
          default: new Footer({
            children: [
              new Paragraph({
                border: { top: { style: BorderStyle.SINGLE, size: 4, color: COLORS.grayBorder } },
                spacing: { before: 100 },
                children: footerChildren,
              }),
            ],
          }),
        }
      : undefined;

    const doc = new Document({
      styles: {
        default: {
          document: {
            paragraph: { spacing: { line: lineSpacingUnits, lineRule: LineRuleType.AUTO } },
          },
        },
      },
      sections: [{
        properties: {
          page: {
            size: {
              orientation: settings.orientation === "landscape" ? PageOrientation.LANDSCAPE : PageOrientation.PORTRAIT,
              width: convertMillimetersToTwip(pageWmm),
              height: convertMillimetersToTwip(pageHmm),
            },
            margin: {
              top: convertMillimetersToTwip(mgn.top),
              right: convertMillimetersToTwip(mgn.right),
              bottom: convertMillimetersToTwip(mgn.bottom),
              left: convertMillimetersToTwip(mgn.left),
            },
          },
        },
        headers: headerObj,
        footers: footerObj,
        children: children,
      }],
    });

    // Generate blob and download
    const blob = await Packer.toBlob(doc);
    
    // Create filename
    const mapelClean = (data.mapel || "Pembelajaran").replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_");
    const temaClean = (data.tema || "Topik").replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_").substring(0, 30);
    const filename = `Modul_Ajar_${mapelClean}_${temaClean}.docx`;
    
    // Use file-saver to download
    saveAs(blob, filename);
    
  } catch (error) {
    console.error("Error generating Word document:", error);
    throw error;
  }
}