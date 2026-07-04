import type { FormData } from "./constants";
import { generateMCQLocally } from "./mcqGenerator";
import type { MCQ } from "./mcqGenerator";

export type { MCQ } from "./mcqGenerator";

export function parseTime(s = "") {
  const m = s.match(/(\d+)\s*[xX×]\s*(\d+)/);
  if (m) return parseInt(m[1]) * parseInt(m[2]);
  const single = s.match(/(\d+)/);
  return single ? parseInt(single[1]) : 70;
}

export function distributeTime(total: number) {
  const awal = Math.max(Math.round(total * 0.15), 5);
  const penutup = Math.max(Math.round(total * 0.14), 5);
  return { awal, inti: total - awal - penutup, penutup };
}

// AI-Powered MCQ Generator using local intelligent system
export async function generateMCQFromAI(
  mapel: string,
  tema: string,
  tujuan: string
) {
  // Simulate slight delay for better UX
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));
  
  // Generate questions using local intelligent generator
  const questions = generateMCQLocally(mapel, tema, tujuan);
  
  if (questions.length === 0) {
    throw new Error("Tidak dapat membuat soal. Silakan coba lagi.");
  }
  
  return questions;
}

// ── Multi-Pertemuan Kegiatan Pembelajaran Builder ──
export interface PertemuanData {
  ke: number;
  fokus: string;
  awa: string[][];
  inti: string[][];
  penutup: string[][];
}

function getPertemuanTahap(idx: number, total: number) {
  if (total <= 1) return "tunggal";
  if (idx === 0) return "eksplorasi";
  if (idx === total - 1) return "akhir";
  return "pendalaman";
}

// Variasi pendekatan untuk pertemuan "tengah" (pendalaman), supaya pertemuan
// ke-2, ke-3, dst tidak berisi teks yang identik satu sama lain.
const PENDALAMAN_VARIANTS = [
  {
    aksi: "memperdalam konsep dasar",
    investigasi: "melakukan penyelidikan dan pengumpulan data lebih lanjut",
    presentasi: "memaparkan temuan investigasinya",
  },
  {
    aksi: "menerapkan konsep pada situasi baru",
    investigasi: "menerapkan konsep pada permasalahan atau kasus baru yang lebih menantang",
    presentasi: "mendemonstrasikan hasil penerapannya",
  },
  {
    aksi: "membandingkan dan menghubungkan konsep",
    investigasi: "membandingkan beberapa contoh atau kasus terkait untuk menemukan pola",
    presentasi: "memaparkan hasil perbandingannya",
  },
  {
    aksi: "mengevaluasi penerapan konsep",
    investigasi: "mengevaluasi dan menilai berbagai contoh penerapan konsep secara kritis",
    presentasi: "menyampaikan hasil evaluasi kritisnya",
  },
];

export function buildPertemuan(
  idx: number,
  total: number,
  data: FormData,
  wAwal: number,
  wInti: number,
  wPenutup: number,
  pakaiKelompok: boolean,
  pakaiPresentasi: boolean
): PertemuanData {
  const tema = data.tema || "-";
  const tahap = getPertemuanTahap(idx, total);
  const ke = idx + 1;
  const indikatorList = splitTujuanIntoIndikator(data.tujuan);
  const tujuanFokus = indikatorList[idx % indikatorList.length];

  let fokus = "";
  let awa: string[][] = [];
  let inti: string[][] = [];
  let penutup: string[][] = [];

  if (tahap === "tunggal") {
    fokus = `Peserta didik mampu ${tujuanFokus} melalui pembelajaran tentang "${tema}" secara utuh dalam satu pertemuan.`;
    awa = [
      [
        "1",
        "Mindful Breathing & Doa: Guru mengajak seluruh siswa menarik napas dalam 3 kali, menghembuskannya perlahan, lalu berdoa bersama untuk membuka pembelajaran dengan penuh kesadaran dan ketenangan.",
        "2 menit",
      ],
      [
        "2",
        "Ice Breaker & Salam Semangat: Guru menyapa siswa dengan ceria, mengajak tepuk semangat atau permainan singkat untuk membangun suasana kelas yang menyenangkan dan penuh energi positif.",
        "3 menit",
      ],
      [
        "3",
        `Apersepsi Kontekstual: Guru menampilkan gambar, video pendek, atau benda nyata yang berkaitan dengan topik "${tema}". Guru mengajukan pertanyaan pemantik untuk menghubungkan materi dengan pengalaman nyata siswa.`,
        `${Math.max(wAwal - 8, 3)} menit`,
      ],
      [
        "4",
        "Penyampaian Tujuan & Kontrak Belajar: Guru menyampaikan tujuan pembelajaran secara jelas, menjelaskan manfaat materi dalam kehidupan nyata, dan menyepakati aturan serta target belajar bersama siswa.",
        "3 menit",
      ],
    ];
    inti = [
      [
        "1",
        `Fase Eksplorasi Bermakna (Meaningful): Guru menyajikan materi "${tema}" menggunakan media interaktif. Siswa diajak mengidentifikasi konsep kunci dan menghubungkannya dengan pengalaman sehari-hari mereka.`,
        `${Math.round(wInti * 0.18)} menit`,
      ],
      [
        "2",
        "Fase Latihan Terbimbing & Diferensiasi: Guru memberikan bimbingan sesuai kebutuhan siswa. Slow learners mendapat scaffolding bertahap; advanced learners mengerjakan tantangan pengayaan.",
        `${Math.round(wInti * 0.22)} menit`,
      ],
      ...(pakaiKelompok
        ? [
            [
              "3",
              `Fase Diskusi Kelompok & Proyek Kreatif (Joyful): Siswa berkelompok 3–4 orang mengerjakan LKPD secara kolaboratif terkait "${tema}", suasana belajar dibuat menyenangkan dengan permainan atau musik ringan.`,
              `${Math.round(wInti * 0.32)} menit`,
            ],
          ]
        : [
            [
              "3",
              `Fase Latihan Mandiri (Joyful): Siswa mengerjakan latihan terkait "${tema}" dengan diselingi permainan edukatif singkat agar suasana tetap menyenangkan.`,
              `${Math.round(wInti * 0.32)} menit`,
            ],
          ]),
      ...(pakaiPresentasi
        ? [
            [
              "4",
              "Fase Presentasi & Umpan Balik: Siswa/kelompok mempresentasikan hasil kerjanya di depan kelas. Guru memberikan umpan balik yang bermakna dan mengaitkannya dengan tujuan pembelajaran.",
              `${Math.round(wInti * 0.16)} menit`,
            ],
          ]
        : [
            [
              "4",
              "Fase Penguatan Konsep: Guru mengulas kembali poin-poin penting dan memberikan umpan balik langsung kepada siswa atas hasil latihan yang telah dikerjakan.",
              `${Math.round(wInti * 0.16)} menit`,
            ],
          ]),
      [
        "5",
        'Fase Refleksi Terbimbing (Mindful): Siswa menulis 3 hal yang dipelajari, 2 hal yang menarik, dan 1 pertanyaan yang masih ingin diketahui (metode 3-2-1).',
        `${Math.round(wInti * 0.12)} menit`,
      ],
    ];
    penutup = [
      [
        "1",
        `Menyimpulkan Bersama (Meaningful): Guru dan siswa merangkum inti materi "${tema}" yang telah dipelajari secara bergantian.`,
        "3 menit",
      ],
      [
        "2",
        "Evaluasi Interaktif (Joyful): Kuis singkat 3–5 soal secara lisan atau digital untuk mengecek pemahaman siswa secara menyenangkan.",
        `${Math.max(wPenutup - 9, 2)} menit`,
      ],
      [
        "3",
        "Pesan Moral & Refleksi Nilai (Mindful): Guru menyampaikan pesan moral terkait materi dan kehidupan nyata.",
        "2 menit",
      ],
      [
        "4",
        "Tindak Lanjut & Motivasi: Guru memberi informasi tindak lanjut dan menutup pembelajaran dengan kalimat motivasi.",
        "2 menit",
      ],
    ];
  } else if (tahap === "eksplorasi") {
    fokus = `Membangun pemahaman awal dan ketertarikan siswa terhadap konsep dasar dari "${tema}" sebagai fondasi menuju kemampuan ${tujuanFokus}, melalui eksplorasi konkret dan pengalaman nyata.`;
    awa = [
      [
        "1",
        "Mindful Breathing & Doa: Guru mengajak siswa menarik napas dalam 3 kali dan berdoa bersama untuk membuka pertemuan pertama dengan tenang dan fokus.",
        "2 menit",
      ],
      [
        "2",
        "Ice Breaker & Salam Semangat: Guru menyapa siswa dengan ceria dan mengajak permainan ringan untuk mencairkan suasana awal pertemuan.",
        "3 menit",
      ],
      [
        "3",
        `Apersepsi Awal: Guru menampilkan gambar, video, atau benda nyata terkait "${tema}" dan mengajukan pertanyaan pemantik untuk menggali pengetahuan awal siswa.`,
        `${Math.max(wAwal - 8, 3)} menit`,
      ],
      [
        "4",
        "Penyampaian Tujuan Pertemuan 1 & Peta Belajar: Guru menjelaskan fokus pertemuan ini serta gambaran umum rangkaian pertemuan yang akan dilalui siswa.",
        "3 menit",
      ],
    ];
    inti = [
      [
        "1",
        `Fase Pengenalan Konsep Dasar (Meaningful): Guru memperkenalkan konsep-konsep dasar "${tema}" menggunakan media visual dan contoh konkret yang dekat dengan kehidupan siswa.`,
        `${Math.round(wInti * 0.25)} menit`,
      ],
      [
        "2",
        "Fase Eksplorasi Terbimbing: Siswa diajak mengamati, bertanya, dan mengidentifikasi unsur-unsur penting dari materi dengan bimbingan guru, menggunakan pendekatan diferensiasi sesuai kemampuan masing-masing.",
        `${Math.round(wInti * 0.3)} menit`,
      ],
      ...(pakaiKelompok
        ? [
            [
              "3",
              "Fase Diskusi Awal Berkelompok (Joyful): Siswa berkelompok kecil untuk saling berbagi pemahaman awal dan menyusun pertanyaan lanjutan yang ingin digali pada pertemuan berikutnya.",
              `${Math.round(wInti * 0.28)} menit`,
            ],
          ]
        : [
            [
              "3",
              "Fase Latihan Pengenalan (Joyful): Siswa berlatih secara individu mengenali konsep dasar melalui aktivitas ringan dan menyenangkan.",
              `${Math.round(wInti * 0.28)} menit`,
            ],
          ]),
      [
        "4",
        "Fase Pencatatan Temuan: Siswa mencatat poin-poin penting dan pertanyaan yang muncul dalam jurnal belajar sebagai bekal pertemuan selanjutnya.",
        `${Math.round(wInti * 0.17)} menit`,
      ],
    ];
    penutup = [
      [
        "1",
        `Menyimpulkan Sementara (Meaningful): Guru dan siswa merangkum pemahaman awal tentang "${tema}" yang telah diperoleh pada pertemuan ini.`,
        "3 menit",
      ],
      [
        "2",
        "Evaluasi Awal (Joyful): Tanya jawab ringan atau kuis sederhana untuk mengecek pemahaman dasar siswa secara menyenangkan.",
        `${Math.max(wPenutup - 9, 2)} menit`,
      ],
      [
        "3",
        "Refleksi Singkat (Mindful): Siswa menuliskan satu hal yang baru dipahami dan satu pertanyaan untuk pertemuan berikutnya.",
        "2 menit",
      ],
      [
        "4",
        "Penyampaian Gambaran Pertemuan Berikutnya: Guru menjelaskan secara singkat apa yang akan dipelajari pada pertemuan selanjutnya sebagai kelanjutan dari pertemuan ini.",
        "2 menit",
      ],
    ];
  } else if (tahap === "pendalaman") {
    const variant = PENDALAMAN_VARIANTS[(idx - 1) % PENDALAMAN_VARIANTS.length];
    fokus = `Peserta didik ${variant.aksi} terkait "${tema}" agar mampu ${tujuanFokus}, melanjutkan hasil Pertemuan ${ke - 1} dengan ${variant.investigasi}.`;
    awa = [
      [
        "1",
        "Salam & Pengecekan Kesiapan: Guru menyapa siswa dan memastikan kesiapan belajar tanpa mengulang doa pembuka secara penuh, cukup dengan sapaan hangat singkat.",
        "2 menit",
      ],
      [
        "2",
        `Review Hasil Pertemuan Sebelumnya (Mindful): Guru mengajak siswa mengingat kembali poin-poin penting dari Pertemuan ${ke - 1} melalui tanya jawab singkat dan menghubungkannya dengan fokus pertemuan hari ini.`,
        `${Math.max(wAwal - 5, 4)} menit`,
      ],
      [
        "3",
        "Penyampaian Fokus Pertemuan Ini: Guru menjelaskan secara singkat tujuan dan tahapan kegiatan pertemuan ini sebagai kelanjutan dari pertemuan sebelumnya.",
        "3 menit",
      ],
    ];
    inti = [
      [
        "1",
        `Pendalaman Konsep (Meaningful): Guru mengajak siswa ${variant.aksi} dari "${tema}", mengaitkannya dengan tujuan pembelajaran agar peserta didik mampu ${tujuanFokus}.`,
        `${Math.round(wInti * 0.22)} menit`,
      ],
      [
        "2",
        `Investigasi: Siswa ${variant.investigasi} terkait "${tema}", baik melalui pengamatan, pengumpulan data, maupun analisis sumber belajar yang disediakan guru.`,
        `${Math.round(wInti * 0.23)} menit`,
      ],
      ...(pakaiKelompok
        ? [
            [
              "3",
              "Kerja Kelompok (Joyful): Siswa bekerja dalam kelompok untuk menyelesaikan tugas investigasi secara kolaboratif, saling berbagi peran dan tanggung jawab dalam suasana belajar yang menyenangkan.",
              `${Math.round(wInti * 0.25)} menit`,
            ],
          ]
        : [
            [
              "3",
              "Kerja Mandiri Lanjutan (Joyful): Siswa melanjutkan investigasi secara mandiri dengan diselingi aktivitas ringan agar tetap termotivasi dan bersemangat.",
              `${Math.round(wInti * 0.25)} menit`,
            ],
          ]),
      ...(pakaiPresentasi
        ? [
            [
              "4",
              "Presentasi Hasil Investigasi: Siswa/kelompok " + variant.presentasi + " secara singkat di depan kelas, dilanjutkan dengan tanya jawab dan masukan dari teman maupun guru.",
              `${Math.round(wInti * 0.18)} menit`,
            ],
          ]
        : [
            [
              "4",
              "Penguatan Hasil Investigasi: Guru mengulas hasil investigasi siswa dan memberikan penguatan terhadap konsep-konsep penting yang ditemukan.",
              `${Math.round(wInti * 0.18)} menit`,
            ],
          ]),
      [
        "5",
        "Penguatan: Guru memberikan penguatan konsep secara menyeluruh, meluruskan miskonsepsi jika ada, dan memastikan seluruh siswa memahami keterkaitan antar konsep yang telah dipelajari.",
        `${Math.round(wInti * 0.12)} menit`,
      ],
    ];
    penutup = [
      [
        "1",
        "Refleksi (Mindful): Siswa merefleksikan proses investigasi dan pendalaman yang telah dilakukan, serta mengidentifikasi bagian mana yang masih perlu diperdalam lebih lanjut.",
        "3 menit",
      ],
      [
        "2",
        "Evaluasi Singkat (Joyful): Kuis interaktif singkat untuk mengecek pemahaman terhadap hasil pendalaman pertemuan ini.",
        `${Math.max(wPenutup - 9, 2)} menit`,
      ],
      [
        "3",
        "Penguatan Pesan Pembelajaran: Guru menyampaikan keterkaitan materi dengan kehidupan nyata serta pentingnya pendalaman yang telah dilakukan.",
        "2 menit",
      ],
      [
        "4",
        `Jembatan ke Pertemuan Berikutnya: Guru menjelaskan secara singkat bagaimana hasil pertemuan ini akan digunakan dan dikembangkan lebih lanjut pada Pertemuan ${ke + 1}.`,
        "2 menit",
      ],
    ];
  } else {
    // akhir
    fokus = `Menyelesaikan dan memantapkan kemampuan ${tujuanFokus} terkait "${tema}" melalui unjuk karya, evaluasi formatif, dan refleksi mendalam, sebagai puncak dari rangkaian pertemuan sebelumnya.`;
    awa = [
      [
        "1",
        "Salam & Aktivasi Semangat: Guru menyapa siswa dengan hangat dan membangun semangat untuk menyelesaikan rangkaian pembelajaran pada pertemuan puncak ini.",
        "2 menit",
      ],
      [
        "2",
        `Aktivasi Pengetahuan (Mindful): Guru mengajak siswa mengingat kembali keseluruhan perjalanan belajar dari Pertemuan 1 hingga Pertemuan ${ke - 1} terkait "${tema}" melalui tanya jawab reflektif singkat.`,
        `${Math.max(wAwal - 5, 4)} menit`,
      ],
      [
        "3",
        "Penyampaian Tujuan Pertemuan Akhir: Guru menjelaskan bahwa pertemuan ini adalah puncak pembelajaran berupa unjuk karya/produk dan evaluasi menyeluruh.",
        "3 menit",
      ],
    ];
    inti = [
      [
        "1",
        `Projek/Produk (Meaningful): Siswa menyelesaikan dan menyempurnakan projek atau produk akhir terkait "${tema}" yang telah dikembangkan sejak pertemuan-pertemuan sebelumnya, mengintegrasikan seluruh pengetahuan dan keterampilan yang telah dipelajari.`,
        `${Math.round(wInti * 0.3)} menit`,
      ],
      ...(pakaiPresentasi
        ? [
            [
              "2",
              "Presentasi (Joyful): Siswa/kelompok mempresentasikan produk akhir mereka di depan kelas dengan penuh percaya diri, dilanjutkan sesi apresiasi dan tanya jawab yang meriah dan menyenangkan.",
              `${Math.round(wInti * 0.25)} menit`,
            ],
          ]
        : [
            [
              "2",
              "Pameran Karya (Joyful): Siswa memajang hasil karya mereka dan saling mengamati hasil karya teman dalam suasana galeri kelas yang menyenangkan.",
              `${Math.round(wInti * 0.25)} menit`,
            ],
          ]),
      [
        "3",
        "Evaluasi Asesmen Formatif: Guru melaksanakan penilaian akhir berupa tes tertulis (LKPD pilihan ganda) dan penilaian keterampilan berdasarkan produk/presentasi yang dihasilkan siswa.",
        `${Math.round(wInti * 0.25)} menit`,
      ],
      [
        "4",
        "Refleksi Mendalam (Mindful): Siswa melakukan refleksi menyeluruh terhadap seluruh proses belajar yang telah dilalui, termasuk tantangan, pencapaian, dan pembelajaran berharga yang diperoleh.",
        `${Math.round(wInti * 0.2)} menit`,
      ],
    ];
    penutup = [
      [
        "1",
        `Kesimpulan (Meaningful): Guru dan siswa menyimpulkan keseluruhan pembelajaran tentang "${tema}" dari pertemuan pertama hingga pertemuan terakhir secara utuh dan menyeluruh.`,
        "3 menit",
      ],
      [
        "2",
        "Apresiasi & Perayaan Pencapaian (Joyful): Guru memberikan apresiasi atas usaha dan pencapaian seluruh siswa selama rangkaian pembelajaran dengan cara yang meriah dan menyenangkan.",
        `${Math.max(wPenutup - 9, 2)} menit`,
      ],
      [
        "3",
        "Pesan Moral & Penutup Reflektif (Mindful): Guru menyampaikan pesan moral menyeluruh terkait perjalanan belajar yang telah dilalui siswa.",
        "2 menit",
      ],
      [
        "4",
        "Tindak Lanjut: Guru memberikan informasi mengenai materi berikutnya atau kegiatan pengayaan/remedial berdasarkan hasil evaluasi formatif yang telah dilaksanakan.",
        "2 menit",
      ],
    ];
  }

  return { ke, fokus, awa, inti, penutup };
}

// splitTujuanIntoIndikator dipakai oleh buildPertemuan (Kegiatan Pembelajaran)
// untuk menyinkronkan fokus tiap pertemuan dengan tujuan pembelajaran.
function splitTujuanIntoIndikator(tujuan: string): string[] {
  const parts = tujuan
    .split(/[;\n]|\.\s+|,\s+(?=[A-Za-z])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);
  return parts.length > 0 ? parts : [tujuan.trim() || "Memahami materi pembelajaran yang diajarkan"];
}

// ── Rubrik Penilaian Keterampilan (LKPD) ──
// Kontekstual terhadap tema pembelajaran, bukan lagi teks statis yang sama untuk semua modul.
export interface RubrikRow {
  aspek: string;
  k1: string;
  k2: string;
  k3: string;
  k4: string;
}

export function buildRubrik(data: FormData): RubrikRow[] {
  const tema = data.tema?.trim() || "materi";
  return [
    { aspek: "Kelancaran", k1: "Tidak dapat menyampaikan", k2: "Banyak hambatan", k3: "Sedikit hambatan", k4: "Sangat lancar" },
    { aspek: "Kepercayaan Diri", k1: "Tidak mau tampil", k2: "Tampil dengan ragu", k3: "Cukup percaya diri", k4: "Sangat percaya diri" },
    { aspek: "Kerja Sama", k1: "Tidak berkontribusi", k2: "Berkontribusi sedikit", k3: "Berkontribusi cukup", k4: "Berkontribusi penuh" },
    {
      aspek: `Ketepatan Materi "${tema}"`,
      k1: `Belum memahami konsep dasar ${tema}`,
      k2: `Memahami sebagian konsep ${tema}, kesalahan 30–50%`,
      k3: `Memahami sebagian besar konsep ${tema}, kesalahan <30%`,
      k4: `Memahami konsep ${tema} secara menyeluruh dan tepat`,
    },
  ];
}
