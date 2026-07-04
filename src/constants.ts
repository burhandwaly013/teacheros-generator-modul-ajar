export const DIMENSI_OPTIONS = [
  "Keimanan dan Ketakwaan",
  "Kewargaan",
  "Penalaran Kritis",
  "Kreativitas",
  "Kemandirian",
  "Kolaborasi",
  "Komunikasi",
  "Kesehatan",
];

export const METODE_OPTIONS = [
  "Ceramah Interaktif",
  "Demonstrasi",
  "Simulasi",
  "Diskusi Kelompok",
  "Tanya Jawab",
  "Observasi",
  "Presentasi",
  "Studi Kasus",
  "Bermain Peran (Roleplay)",
  "Eksperimen",
  "Penugasan",
  "Mind Mapping",
];

export const MODEL_OPTIONS = [
  "Problem Based Learning (PBL)",
  "Project Based Learning (PjBL)",
  "Discovery Learning",
  "Inquiry Learning",
  "Cooperative Learning",
  "Pembelajaran Berdiferensiasi",
  "Flipped Classroom",
];

export const BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const DIMENSI_MAP: Record<
  string,
  { ind: string; akt: string; hasil: string; bukti: string }
> = {
  "Keimanan dan Ketakwaan": {
    ind: "Menunjukkan sikap syukur, berdoa sebelum dan sesudah belajar, serta merefleksikan nilai-nilai keimanan dalam kehidupan sehari-hari",
    akt: "Berdoa bersama, refleksi syukur, jurnal rasa syukur harian",
    hasil:
      "Siswa mampu mengungkapkan rasa syukur secara lisan maupun tulisan, menunjukkan sikap tawadhu dalam belajar, dan mengaitkan materi pembelajaran dengan nilai-nilai ketuhanan yang diyakininya secara konsisten dalam kehidupan sehari-hari",
    bukti:
      "Jurnal refleksi syukur siswa, catatan observasi guru tentang sikap berdoa dan perilaku ketakwaan, rekaman ungkapan syukur lisan saat apersepsi dan penutup pembelajaran",
  },
  Kewargaan: {
    ind: "Menghargai keberagaman, menunjukkan sikap toleransi, dan berpartisipasi aktif dalam kehidupan bermasyarakat di lingkungan sekolah",
    akt: "Diskusi nilai kebersamaan, presentasi keberagaman budaya, proyek kolaborasi lintas kelompok",
    hasil:
      "Siswa mampu menunjukkan sikap toleran terhadap perbedaan pendapat dan latar belakang teman, aktif berpartisipasi dalam kegiatan kelompok, serta mampu mengidentifikasi peran warga negara yang baik dalam kehidupan bermasyarakat dan berbangsa",
    bukti:
      "Hasil diskusi kelompok, lembar penilaian sikap toleransi dari observasi guru, portofolio proyek kebersamaan, catatan partisipasi siswa dalam diskusi kelas",
  },
  "Penalaran Kritis": {
    ind: "Menganalisis informasi secara logis, membandingkan berbagai sudut pandang, dan menarik kesimpulan berdasarkan bukti yang valid",
    akt: "Membandingkan dan mengevaluasi data, diskusi pemecahan masalah, analisis studi kasus",
    hasil:
      "Siswa mampu mengidentifikasi masalah, mengumpulkan informasi yang relevan, menganalisis data secara sistematis, membandingkan berbagai alternatif solusi, dan menarik kesimpulan yang logis dan didukung oleh bukti serta argumen yang kuat",
    bukti:
      "Lembar kerja analisis, hasil presentasi pemecahan masalah, catatan proses berpikir siswa dalam jurnal belajar, produk karya tulis argumentatif",
  },
  Kreativitas: {
    ind: "Menciptakan karya orisinal yang mencerminkan imajinasi dan inovasi, serta mampu mengekspresikan ide secara unik dan autentik",
    akt: "Membuat proyek kreatif, mind mapping, presentasi karya, eksperimen inovatif",
    hasil:
      "Siswa mampu menghasilkan karya orisinal yang mencerminkan pemikiran kreatif dan inovatif, mengembangkan ide-ide baru yang relevan dengan topik pembelajaran, serta berani mengekspresikan diri melalui berbagai media dan bentuk karya yang autentik",
    bukti:
      "Portofolio karya kreatif siswa, rekaman presentasi karya, penilaian rubrik kreativitas oleh guru dan teman sebaya, dokumentasi proses kreatif",
  },
  Kemandirian: {
    ind: "Mengelola proses belajar secara mandiri, menetapkan tujuan belajar pribadi, dan bertanggung jawab atas kemajuan belajarnya sendiri",
    akt: "Mengisi jurnal belajar harian, menetapkan target belajar pribadi, refleksi mandiri berkala",
    hasil:
      "Siswa mampu merencanakan dan melaksanakan kegiatan belajar secara mandiri tanpa bergantung sepenuhnya pada guru, mengelola waktu belajar dengan efektif, mengevaluasi kemajuan belajar dirinya sendiri, dan menunjukkan inisiatif dalam mencari sumber belajar tambahan",
    bukti:
      "Jurnal belajar mandiri siswa, catatan target dan refleksi belajar pribadi, portofolio tugas yang diselesaikan secara mandiri, observasi guru tentang kemandirian belajar",
  },
  Kolaborasi: {
    ind: "Bekerja sama secara efektif dalam kelompok, menghargai kontribusi setiap anggota, dan mampu menyelesaikan tugas bersama dengan harmonis",
    akt: "Kerja kelompok proyek, diskusi kelompok LKPD, presentasi bersama, peer teaching",
    hasil:
      "Siswa mampu berkontribusi secara aktif dan positif dalam kerja kelompok, mendengarkan dan menghargai pendapat teman, membagi tugas secara adil, menyelesaikan konflik kelompok secara konstruktif, dan menghasilkan produk kolaborasi yang berkualitas bersama tim",
    bukti:
      "Produk hasil kerja kelompok, penilaian teman sebaya (peer assessment), rekaman diskusi kelompok, lembar observasi kolaborasi guru, portofolio proyek bersama",
  },
  Komunikasi: {
    ind: "Menyampaikan ide, pendapat, dan informasi secara jelas, runtut, dan efektif baik secara lisan maupun tulisan kepada berbagai audiens",
    akt: "Presentasi di depan kelas, diskusi panel, penulisan laporan, tanya jawab interaktif",
    hasil:
      "Siswa mampu menyampaikan pendapat dan gagasan dengan bahasa yang jelas, runtut, dan santun; mampu membuat tulisan yang terstruktur dengan baik; mampu mendengarkan secara aktif; serta mampu menyesuaikan gaya komunikasi dengan situasi dan audiens yang berbeda",
    bukti:
      "Rekaman presentasi siswa, laporan tertulis, lembar penilaian komunikasi lisan dan tulisan, catatan observasi guru selama diskusi, umpan balik teman sebaya",
  },
  Kesehatan: {
    ind: "Menerapkan pola hidup sehat secara fisik dan mental, memahami pentingnya kesehatan, dan membuat pilihan yang mendukung kesejahteraan diri",
    akt: "Mengidentifikasi kebiasaan sehat, refleksi gaya hidup, diskusi kesehatan fisik dan mental",
    hasil:
      "Siswa mampu mengidentifikasi dan mempraktikkan kebiasaan hidup sehat dalam keseharian, memahami hubungan antara pilihan gaya hidup dengan kesehatan jangka panjang, mengelola stres belajar secara sehat, serta mampu membuat keputusan yang mendukung kesejahteraan fisik dan mental dirinya",
    bukti:
      "Jurnal kesehatan harian siswa, lembar refleksi gaya hidup sehat, dokumentasi kegiatan fisik, catatan observasi guru tentang kebiasaan sehat siswa di sekolah",
  },
};

export const INIT_FORM = {
  nama: "",
  sekolah: "",
  tahun: "",
  jenjang: "",
  mapel: "",
  fase: "",
  kelas: "",
  semester: "",
  tema: "",
  waktu: "",
  jumlahPertemuan: "1",
  karakteristik: "",
  dimensi: [] as string[],
  tujuan: "",
  lintasDisiplin: "",
  model: MODEL_OPTIONS[0],
  metode: [] as string[],
  media: "",
  lingkungan: [] as string[],
};

export const INIT_SIG = {
  tempat: "",
  tglHari: "",
  tglBulan: "",
  tglTahun: "",
  kepalaName: "",
  kepalaNip: "",
  guruName: "",
  guruNip: "",
};

export type FormData = typeof INIT_FORM;
export type SigData = typeof INIT_SIG;
