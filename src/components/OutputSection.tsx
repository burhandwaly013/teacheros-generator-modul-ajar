import React from "react";
import { Tbl } from "./ui";
import { DIMENSI_MAP } from "../constants";
import type { FormData, SigData } from "../constants";
import type { MCQ } from "../helpers";
import { parseTime, distributeTime, buildPertemuan, buildRubrik } from "../helpers";
import { DEFAULT_DOCUMENT_SETTINGS, getBodySmallPt, getEffectiveMarginCm } from "../documentSettings";
import type { DocumentSettings } from "../documentSettings";

function DimensiTable({ dims }: { dims: string[] }) {
  return (
    <Tbl
      heads={[
        "Dimensi",
        "Indikator Pencapaian",
        "Aktivitas Pembelajaran",
        "Hasil yang Diharapkan",
      ]}
      rows={dims.map((d) => {
        const r = DIMENSI_MAP[d] || { ind: "-", akt: "-", hasil: "-" };
        return [d, r.ind, r.akt, r.hasil];
      })}
    />
  );
}

interface OutputSectionProps {
  data: FormData;
  sig: SigData;
  mcqs: MCQ[];
  mcqLoading: boolean;
  mcqError: string;
  onRetryMcq: () => void;
  docSettings?: DocumentSettings;
}

export default function OutputSection({
  data,
  sig,
  mcqs,
  mcqLoading,
  mcqError,
  onRetryMcq,
  docSettings = DEFAULT_DOCUMENT_SETTINGS,
}: OutputSectionProps) {
  const totalMenit = parseTime(data.waktu);
  const { awal, inti, penutup } = distributeTime(totalMenit);
  const dims = data.dimensi || [];
  const metodes = data.metode || [];
  const ling = data.lingkungan || [];
  const sigTgl = [sig.tglHari, sig.tglBulan, sig.tglTahun]
    .filter(Boolean)
    .join(" ");
  const jumlahPertemuan = Math.max(parseInt(data.jumlahPertemuan) || 1, 1);
  const pakaiKelompok = metodes.includes("Diskusi Kelompok");
  const pakaiPresentasi = metodes.includes("Presentasi");
  const rubrik = buildRubrik(data);

  const pertemuanList = Array.from({ length: jumlahPertemuan }, (_, idx) =>
    buildPertemuan(
      idx,
      jumlahPertemuan,
      data,
      awal,
      inti,
      penutup,
      pakaiKelompok,
      pakaiPresentasi
    )
  );

  const Sec = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="mb-6">
      <div className="bg-red-800 text-white px-4 py-2 rounded-t-lg font-bold text-sm">
        {title}
      </div>
      <div className="border border-gray-200 rounded-b-lg p-4">{children}</div>
    </div>
  );
  const Sub = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="mb-4">
      <div className="font-bold text-red-800 text-sm mb-2 border-b border-red-100 pb-1">
        {title}
      </div>
      {children}
    </div>
  );

  const kepalaSekolahLabel = data.sekolah
    ? `Kepala ${data.sekolah}`
    : "Kepala Satuan Pendidikan";

  const previewMargin = getEffectiveMarginCm(docSettings);

  return (
    <div
      id="modul-output"
      className="bg-white rounded-xl shadow border border-gray-200 mt-6 text-gray-800"
      style={{ fontFamily: `'${docSettings.font}', sans-serif` }}
    >
      <style>{`
        #modul-output { padding: ${previewMargin.top}cm ${previewMargin.right}cm ${previewMargin.bottom}cm ${previewMargin.left}cm; }
        @media (max-width: 640px) {
          #modul-output { padding: 1rem !important; }
        }
        #modul-output .text-sm { font-size:${docSettings.fontSize}pt !important; line-height:${docSettings.lineSpacing} !important; }
        #modul-output .text-xs { font-size:${getBodySmallPt(docSettings)}pt !important; line-height:${docSettings.lineSpacing} !important; }
        #modul-output p, #modul-output li, #modul-output td, #modul-output th { line-height:${docSettings.lineSpacing}; }
      `}</style>

      {docSettings.showHeader && (
        <div className="doc-header flex justify-between items-center text-xs text-gray-600 border-b border-gray-200 pb-2 mb-4">
          <span className="font-semibold">{data.sekolah || "-"}</span>
          <span>{data.tema || "-"}</span>
        </div>
      )}

      <div className="text-center mb-6 border-2 border-red-800 rounded-lg p-4 bg-red-50">
        <div className="text-red-800 font-bold text-base md:text-lg">
          MODUL AJAR DEEP LEARNING
        </div>
        <div className="text-red-700 font-semibold text-sm">
          KURIKULUM MERDEKA
        </div>
        <div className="text-gray-600 text-xs italic mt-1">
          (Bermakna, Berkesadaran, Menggembirakan)
        </div>
      </div>

      {/* A */}
      <Sec title="A. IDENTITAS MODUL">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <tbody>
              {(
                [
                  ["Nama Penyusun", data.nama],
                  ["Satuan Pendidikan", data.sekolah],
                  ["Tahun Ajaran", data.tahun],
                  ["Jenjang", data.jenjang],
                  ["Mata Pelajaran", data.mapel],
                  ["Fase / Kelas", `${data.fase} / ${data.kelas}`],
                  ["Semester", data.semester],
                  ["Topik/Materi Pembelajaran", data.tema],
                  ["Alokasi Waktu", data.waktu],
                  [
                    "Jumlah Pertemuan",
                    `${jumlahPertemuan} Kali Pertemuan`,
                  ],
                ] as [string, string][]
              ).map(([k, v], i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="border border-gray-200 px-3 py-1.5 font-semibold w-48 whitespace-nowrap">
                    {k}
                  </td>
                  <td className="border border-gray-200 px-3 py-1.5">
                    : {v || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Sec>

      {/* B */}
      <Sec title="B. IDENTIFIKASI PESERTA DIDIK">
        <Sub title="1. Karakteristik Peserta Didik">
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>
              Siswa kelas {data.kelas || "..."} berada pada tahap perkembangan
              kognitif konkret-operasional dengan rentang perhatian 15–20 menit
              per sesi.
            </li>
            <li>
              Sebagian besar siswa bergantung pada media visual (gambar, warna,
              video) untuk memahami materi baru secara efektif.
            </li>
            <li>
              Pendekatan Total Physical Response (TPR) efektif untuk mengaitkan
              konsep abstrak dengan aktivitas fisik yang konkret.
            </li>
            <li>
              Variasi kemampuan antar siswa cukup signifikan; diferensiasi
              konten, proses, dan produk sangat diperlukan.
            </li>
            <li>
              Siswa termotivasi tinggi oleh permainan, lagu, dan kompetisi
              positif yang menyenangkan.
            </li>
          </ul>
        </Sub>
        <Sub title="2. Kebutuhan Belajar Khusus">
          <Tbl
            heads={[
              "Kelompok Siswa",
              "Karakteristik",
              "Solusi / Strategi Diferensiasi",
            ]}
            rows={[
              [
                "Slow Learners",
                "Membutuhkan waktu lebih lama untuk memproses dan memahami materi baru",
                `Gunakan media visual, scaffolding bertahap, word bank, dan contoh konkret sesuai topik "${data.tema || "-"}"`,
              ],
              [
                "Advanced Learners",
                "Cepat selesai dan membutuhkan tantangan yang lebih kompleks",
                `Berikan tugas pengayaan: membuat proyek lanjutan, menganalisis masalah nyata, atau menjadi tutor sebaya terkait "${data.tema || "-"}"`,
              ],
              [
                "Shy Learners",
                "Enggan berbicara atau tampil di depan kelas secara langsung",
                "Gunakan pair-work dan kelompok kecil 2–3 orang; berikan penguatan positif; mulai dari peran yang lebih kecil",
              ],
            ]}
          />
        </Sub>
        <Sub title="3. Minat dan Motivasi">
          <p className="text-sm mb-2">
            Untuk membangun ketertarikan dan motivasi belajar siswa secara
            optimal terhadap topik{" "}
            <b>{data.tema || "pembelajaran ini"}</b>, guru menerapkan
            beberapa pendekatan berikut secara terintegrasi dalam proses
            pembelajaran:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-2">
            <li>
              <b>Aktivitas Tematik yang Relevan:</b> Kegiatan pembelajaran
              dirancang secara khusus agar selalu berkaitan langsung dengan topik
              "{data.tema || "-"}", dengan menghadirkan situasi dan permasalahan
              yang dekat dengan kehidupan nyata siswa sehingga mereka merasa
              bahwa apa yang dipelajari benar-benar bermanfaat dan dapat
              diterapkan dalam kesehariannya.
            </li>
            <li>
              <b>Roleplay dan Simulasi Interaktif:</b> Siswa diajak melakukan
              simulasi situasi autentik yang berhubungan dengan materi, sehingga
              pembelajaran tidak hanya bersifat teoretis tetapi juga memberikan
              pengalaman langsung yang membekas dan mudah diingat, sekaligus
              melatih keterampilan sosial dan komunikasi mereka.
            </li>
            <li>
              <b>Penyajian Konteks Dunia Nyata:</b> Guru secara konsisten
              menampilkan contoh-contoh konkret penerapan materi dalam kehidupan
              sehari-hari, baik melalui gambar, video, cerita pengalaman, maupun
              kunjungan virtual, agar siswa dapat melihat keterkaitan langsung
              antara apa yang dipelajari di kelas dengan dunia di sekitar mereka.
            </li>
            <li>
              <b>Kompetisi Positif yang Memotivasi:</b> Penggunaan kuis
              interaktif berbasis aplikasi seperti Quizizz atau Kahoot dengan
              papan peringkat kelas mampu menumbuhkan semangat kompetisi yang
              sehat, mendorong partisipasi aktif seluruh siswa, sekaligus
              memberikan umpan balik instan yang membantu mereka mengetahui
              sejauh mana pemahaman yang telah dicapai.
            </li>
            <li>
              <b>Penghargaan dan Apresiasi Berkelanjutan:</b> Guru secara rutin
              memberikan pujian, stiker prestasi, atau bentuk apresiasi lainnya
              atas usaha dan pencapaian siswa, sekecil apapun itu, untuk
              membangun rasa percaya diri dan motivasi intrinsik dalam belajar.
            </li>
          </ul>
        </Sub>
      </Sec>

      {/* C */}
      {dims.length > 0 && (
        <Sec title="C. DIMENSI PROFIL LULUSAN">
          <DimensiTable dims={dims} />
        </Sec>
      )}

      {/* D */}
      <Sec title="D. DESAIN PEMBELAJARAN">
        <Sub title="1. Tujuan Pembelajaran">
          <p className="text-sm bg-blue-50 border border-blue-200 rounded p-3 whitespace-pre-wrap">
            {data.tujuan || "-"}
          </p>
        </Sub>
        {data.lintasDisiplin && (
          <Sub title="2. Lintas Disiplin Ilmu">
            <p className="text-sm bg-purple-50 border border-purple-200 rounded p-3 whitespace-pre-wrap">
              {data.lintasDisiplin}
            </p>
          </Sub>
        )}
        <Sub
          title={`${data.lintasDisiplin ? "3" : "2"}. Praktik Pedagogis (Deep Learning)`}
        >
          <Tbl
            heads={[
              "Fase Deep Learning",
              "Strategi Pedagogis",
              "Implementasi dalam Pembelajaran",
            ]}
            rows={[
              [
                "Bermakna (Meaningful)",
                "Kontekstualisasi materi dengan pengalaman nyata siswa",
                `Mengaitkan topik "${data.tema || "-"}" dengan situasi kehidupan sehari-hari yang dialami siswa; menggunakan contoh konkret dan relevan`,
              ],
              [
                "Berkesadaran (Mindful)",
                "Refleksi metakognitif dan penguatan kesadaran belajar secara berkala",
                `Jurnal belajar: "Apa yang saya pelajari hari ini tentang ${data.tema || "-"}? Apa yang masih membingungkan saya?"`,
              ],
              [
                "Menggembirakan (Joyful)",
                "Gamifikasi, aktivitas kolaboratif, dan pembelajaran berbasis permainan",
                `Permainan edukatif, lagu tematik, kompetisi positif, dan proyek kreatif berbasis topik "${data.tema || "-"}"`,
              ],
              [
                "Refleksi",
                "Evaluasi diri dan umpan balik berkelanjutan antar siswa dan guru",
                `Siswa mengisi lembar refleksi: "Apa yang sudah saya kuasai? Apa yang masih perlu saya tingkatkan tentang ${data.tema || "-"}?" lalu mendiskusikannya bersama guru`,
              ],
              [
                "Berbasis Masalah",
                "Pemecahan masalah autentik yang relevan dengan konteks nyata",
                "Siswa merancang solusi nyata atas permasalahan terkait materi dan mempresentasikannya di depan kelas",
              ],
            ]}
          />
        </Sub>
        <Sub
          title={`${data.lintasDisiplin ? "4" : "3"}. Kemitraan Belajar`}
        >
          <p className="text-sm mb-2">
            Pembelajaran yang efektif tidak terlepas dari peran berbagai pihak
            yang saling mendukung dan bersinergi. Berikut adalah bentuk
            kemitraan belajar yang diterapkan dalam pembelajaran topik{" "}
            <b>{data.tema || "ini"}</b>:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-2">
            <li>
              <b>Peer Teaching (Pembelajaran Antarteman):</b> Siswa yang telah
              lebih dahulu memahami materi diberi kesempatan untuk membimbing
              dan menjelaskan kembali konsep kepada teman sebayanya menggunakan
              bahasa yang lebih mudah dipahami, sehingga tercipta proses belajar
              dua arah yang saling menguatkan pemahaman baik bagi yang mengajar
              maupun yang diajar.
            </li>
            <li>
              <b>Kerja Kelompok yang Terstruktur:</b> Siswa dibagi dalam
              kelompok kecil berisi 3–4 orang untuk menyelesaikan Lembar Kerja
              Peserta Didik (LKPD) secara kolaboratif, di mana setiap anggota
              memiliki peran dan tanggung jawab yang jelas sehingga tercipta
              rasa kebersamaan dan saling ketergantungan yang positif dalam
              mencapai tujuan belajar bersama.
            </li>
            <li>
              <b>Guru sebagai Fasilitator Pembelajaran:</b> Guru berperan aktif
              memantau proses belajar siswa, memberikan umpan balik yang
              konstruktif dan tepat waktu, serta memancing pertanyaan-pertanyaan
              reflektif yang mendorong siswa untuk berpikir lebih mendalam dan
              menemukan jawabannya sendiri, bukan sekadar memberikan jawaban
              secara langsung.
            </li>
            <li>
              <b>Peran dan Fungsi Orang Tua Siswa:</b> Orang tua dilibatkan
              sebagai mitra belajar di rumah dengan cara mendampingi anak
              mengerjakan tugas, memberikan motivasi dan dukungan emosional,
              mengomunikasikan perkembangan belajar anak secara berkala dengan
              guru, serta menciptakan lingkungan belajar yang kondusif di rumah
              agar terjadi keselarasan antara pembelajaran di sekolah dan
              penguatan di lingkungan keluarga.
            </li>
          </ul>
        </Sub>
        <Sub
          title={`${data.lintasDisiplin ? "5" : "4"}. Lingkungan Belajar`}
        >
          <ul className="list-disc pl-5 text-sm space-y-1">
            {ling.includes("Ruang Fisik (Kelas)") && (
              <li>
                <b>Ruang Fisik (Kelas):</b> Penataan meja kelompok yang
                fleksibel, pojok baca, area display karya siswa, dan dekorasi
                tematik yang mendukung pembelajaran.
              </li>
            )}
            {ling.includes("Ruang Virtual (Online)") && (
              <li>
                <b>Ruang Virtual (Online):</b> Platform digital untuk
                penugasan, kuis interaktif, diskusi asinkron, dan berbagi sumber
                belajar.
              </li>
            )}
            {ling.length === 0 && (
              <li className="text-gray-400">Belum dipilih.</li>
            )}
          </ul>
        </Sub>
        <Sub
          title={`${data.lintasDisiplin ? "6" : "5"}. Pemanfaatan Teknologi Digital`}
        >
          <ul className="list-disc pl-5 text-sm space-y-1">
            {(data.media || "")
              .split(/[,\n]/)
              .map((m) => m.trim())
              .filter(Boolean)
              .map((m, i) => (
                <li key={i}>• {m}</li>
              ))}
            {metodes.length > 0 && (
              <li>
                • Metode aktif yang diterapkan: {metodes.join(", ")}
              </li>
            )}
            {!data.media && metodes.length === 0 && (
              <li className="text-gray-400">Belum diisi.</li>
            )}
          </ul>
        </Sub>
      </Sec>

      {/* E */}
      <Sec title="E. PENGALAMAN BELAJAR">
        <Sub title="1. Eksplorasi dan Koneksi Konsep Awal">
          <p className="text-sm mb-2">
            Guru membuka eksplorasi dengan pertanyaan pemantik yang mendorong
            rasa ingin tahu dan keterhubungan dengan pengalaman nyata siswa:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-2 bg-yellow-50 border border-yellow-200 rounded p-3">
            <li>
              "Apa yang sudah kalian ketahui tentang{" "}
              <b>{data.tema || "topik ini"}</b>? Ceritakan pengalaman kalian
              yang berkaitan!"
            </li>
            <li>
              "Di mana saja kalian pernah menemukan atau melihat hal yang
              berhubungan dengan <b>{data.tema || "topik ini"}</b> dalam
              kehidupan sehari-hari? Bagaimana perasaan kalian saat itu?"
            </li>
            <li>
              "Menurut kalian, mengapa penting bagi kita untuk mempelajari{" "}
              <b>{data.tema || "topik ini"}</b>? Apa manfaatnya dalam
              kehidupan nyata?"
            </li>
            <li>
              "Jika kalian bisa merancang cara belajar tentang{" "}
              <b>{data.tema || "topik ini"}</b> sendiri, apa yang akan kalian
              lakukan pertama kali? Mengapa?"
            </li>
            <li>
              "Apa hal paling menarik atau paling membingungkan yang ingin
              kalian pelajari lebih dalam tentang{" "}
              <b>{data.tema || "topik ini"}</b> hari ini?"
            </li>
          </ul>
        </Sub>
        <Sub title="2. Aplikasi dalam Kehidupan Nyata">
          <p className="text-sm mb-2">
            Contoh interaksi pembelajaran terkait{" "}
            <b>{data.tema || "topik pembelajaran"}</b>:
          </p>
          <Tbl
            heads={["Peran", "Dialog / Aktivitas"]}
            rows={[
              [
                "Guru",
                "Hari ini kita akan mempelajari tentang " +
                  (data.tema || "topik ini") +
                  ". Sebelum kita mulai, siapa yang bisa cerita pengalaman mereka yang berhubungan dengan topik ini?",
              ],
              [
                "Siswa A",
                "Saya pernah melihatnya, Bu/Pak! Waktu itu saya sedang...",
              ],
              [
                "Guru",
                "Wah, pengalaman yang sangat menarik! Bagaimana perasaanmu saat itu? Coba ceritakan lebih lanjut kepada teman-teman.",
              ],
              [
                "Siswa B",
                "Saya belum terlalu paham, Bu/Pak. Bisa dijelaskan dari awal dengan contoh yang lebih mudah?",
              ],
              [
                "Guru",
                "Tentu saja! Tidak ada yang salah dengan belum memahami. Mari kita pelajari bersama langkah demi langkah dengan cara yang menyenangkan.",
              ],
            ]}
          />
        </Sub>
        <Sub title="3. Merefleksikan">
          <p className="text-sm mb-2">
            Siswa merefleksikan pengalaman belajar melalui 5 pertanyaan
            refleksi mendalam berikut:
          </p>
          <ul className="list-decimal pl-5 text-sm space-y-2 bg-blue-50 border border-blue-200 rounded p-3">
            <li>
              <i>
                "Apa hal paling penting atau paling bermakna yang kamu pelajari
                hari ini tentang <b>{data.tema || "topik ini"}</b>? Mengapa
                hal itu terasa penting bagimu?"
              </i>
            </li>
            <li>
              <i>
                "Bagaimana kamu akan menerapkan pengetahuan dan keterampilan
                yang kamu peroleh hari ini dalam kehidupan sehari-hari di luar
                kelas?"
              </i>
            </li>
            <li>
              <i>
                "Apa yang masih membingungkan atau belum kamu pahami
                sepenuhnya? Langkah apa yang akan kamu ambil untuk memahaminya
                lebih baik?"
              </i>
            </li>
            <li>
              <i>
                "Bagaimana perasaanmu selama proses belajar hari ini? Apa yang
                membuatmu semangat dan apa yang terasa menantang?"
              </i>
            </li>
            <li>
              <i>
                "Jika kamu harus menjelaskan topik{" "}
                <b>{data.tema || "ini"}</b> kepada teman atau anggota
                keluargamu, apa yang akan kamu sampaikan pertama kali dan
                bagaimana caramu menjelaskannya?"
              </i>
            </li>
          </ul>
          <p className="text-sm mt-3 text-gray-600">
            Guru menutup sesi refleksi dengan penguatan bahwa proses bertanya
            dan merefleksikan diri adalah tanda kecerdasan yang sesungguhnya,
            dan belajar adalah perjalanan yang indah dan tidak pernah berhenti.
          </p>
        </Sub>
      </Sec>

      {/* F — Multi-Pertemuan */}
      <Sec title="F. KEGIATAN PEMBELAJARAN">
        {pertemuanList.map((p, idx) => (
          <div key={idx} className="mb-6">
            <div className="bg-rose-700 text-white px-3 py-2 rounded-lg font-bold text-sm mb-2">
              PERTEMUAN {p.ke}{jumlahPertemuan > 1 ? ` dari ${jumlahPertemuan}` : ""}
            </div>
            <p className="text-sm bg-amber-50 border border-amber-200 rounded p-3 mb-3">
              <b>Fokus Pertemuan {p.ke}:</b> {p.fokus}
            </p>
            <Sub title="Kegiatan Awal">
              <Tbl
                heads={["No.", "Deskripsi Kegiatan", "Waktu"]}
                rows={p.awa}
              />
            </Sub>
            <Sub title="Kegiatan Inti">
              <Tbl
                heads={["No.", "Deskripsi Kegiatan", "Waktu"]}
                rows={p.inti}
              />
            </Sub>
            <Sub title="Kegiatan Penutup">
              <Tbl
                heads={["No.", "Deskripsi Kegiatan", "Waktu"]}
                rows={p.penutup}
              />
            </Sub>
          </div>
        ))}
      </Sec>

      {/* G */}
      <Sec title="G. INSTRUMEN PENILAIAN">
        <Sub title="1. Instrumen Dimensi Profil Lulusan (Observasi)">
          <Tbl
            heads={[
              "Dimensi",
              "Indikator",
              "Bukti/Evidence",
              "BB(1)",
              "MB(2)",
              "BSH(3)",
              "SB(4)",
            ]}
            rows={
              dims.length > 0
                ? dims.map((d) => {
                    const r = DIMENSI_MAP[d] || { ind: "-", bukti: "-" };
                    return [d, r.ind, r.bukti, "□", "□", "□", "□"];
                  })
                : [
                    [
                      "(Belum ada dimensi dipilih)",
                      "—",
                      "—",
                      "—",
                      "—",
                      "—",
                      "—",
                    ],
                  ]
            }
          />
          <p className="text-xs text-gray-500 mt-1">
            BB=Belum Berkembang | MB=Mulai Berkembang | BSH=Berkembang Sesuai
            Harapan | SB=Sangat Berkembang
          </p>
        </Sub>

        <Sub title="2. Penilaian Akhir / LKPD (10 Soal Pilihan Ganda)">
          {!mcqLoading && !mcqError && mcqs.length > 0 && (
            <div className="mb-3 flex justify-end no-print">
              <button
                onClick={onRetryMcq}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 border border-blue-200 hover:bg-blue-50 rounded-lg px-3 py-1.5 transition"
              >
                🔄 Buat Ulang Soal
              </button>
            </div>
          )}
          {mcqLoading && (
            <div className="flex items-center gap-3 py-6 justify-center text-sm text-gray-500">
              <svg
                className="animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              AI sedang membuat soal yang relevan dengan topik{" "}
              <b className="ml-1">{data.tema}</b>...
            </div>
          )}
          {mcqError && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700 flex items-center justify-between gap-3 no-print">
              <span>{mcqError}</span>
              <button
                onClick={onRetryMcq}
                className="flex-shrink-0 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
              >
                Coba Lagi
              </button>
            </div>
          )}
          {!mcqLoading && !mcqError && mcqs.length > 0 && (
            <div className="space-y-3">
              {mcqs.map((q, i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-lg p-3 text-sm border border-gray-100"
                >
                  <p className="font-semibold mb-2 text-gray-800">
                    {i + 1}. {q.q}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pl-2 mb-2">
                    {["A", "B", "C", "D"].map((opt, j) => (
                      <span
                        key={j}
                        className={`flex items-center gap-1 ${q.ans === opt ? "text-green-700 font-bold" : "text-gray-700"}`}
                      >
                        {q.ans === opt ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-600 text-white text-xs font-bold flex-shrink-0">
                            {opt}
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 text-xs flex-shrink-0">
                            {opt}
                          </span>
                        )}
                        {q.opts?.[j]}
                      </span>
                    ))}
                  </div>
                  {q.explanation && (
                    <div className="mt-1 text-xs bg-green-50 border border-green-200 rounded px-2 py-1 text-green-800">
                      <b>✅ Kunci: {q.ans}</b> — {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Sub>

        <Sub title="3. Penilaian Keterampilan (Rubrik 1–4)">
          <Tbl
            heads={[
              "Aspek",
              "Skor 1 (Kurang)",
              "Skor 2 (Cukup)",
              "Skor 3 (Baik)",
              "Skor 4 (Sangat Baik)",
            ]}
            rows={rubrik.map((r) => [r.aspek, r.k1, r.k2, r.k3, r.k4])}
          />
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-3 text-xs">
            <b>Perhitungan Nilai:</b> Nilai = (Total Skor / 16) × 100
            &nbsp;|&nbsp;
            <b>Kriteria:</b> 90–100 = A (Sangat Baik) | 75–89 = B (Baik) |
            60–74 = C (Cukup) | &lt;60 = D (Kurang)
          </div>
        </Sub>
      </Sec>

      <div className="border-t-2 border-gray-300 pt-6 mt-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <p className="mb-1">Mengetahui,</p>
            <p className="font-semibold">{kepalaSekolahLabel},</p>
            <div style={{ height: "80px" }} />
            <p className="font-bold underline">
              {sig.kepalaName || "________________________"}
            </p>
            <p className="mt-1">
              NIP.{" "}
              {sig.kepalaNip && sig.kepalaNip.trim()
                ? sig.kepalaNip
                : "________________________"}
            </p>
          </div>
          <div className="text-center">
            <p className="mb-1">
              {sig.tempat || "________________"},{" "}
              {sigTgl || "________________"}
            </p>
            <p className="font-semibold">Guru {data.mapel || ""},</p>
            <div style={{ height: "80px" }} />
            <p className="font-bold underline">
              {sig.guruName || "________________________"}
            </p>
            <p className="mt-1">
              NIP.{" "}
              {sig.guruNip && sig.guruNip.trim()
                ? sig.guruNip
                : "________________________"}
            </p>
          </div>
        </div>
      </div>

      {docSettings.showFooter && (
        <div className="doc-footer flex justify-between items-center text-xs text-gray-500 border-t border-gray-200 pt-2 mt-6">
          <span>{data.nama || "-"}</span>
          <span>Tahun Ajaran {data.tahun || "-"}</span>
          {docSettings.showPageNumber && <span>Halaman</span>}
        </div>
      )}
    </div>
  );
}
