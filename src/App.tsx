import { useState, useCallback, useRef } from "react";
import {
  DIMENSI_OPTIONS,
  METODE_OPTIONS,
  MODEL_OPTIONS,
  BULAN,
  INIT_FORM,
  INIT_SIG,
} from "./constants";
import type { FormData, SigData } from "./constants";
import type { MCQ } from "./helpers";
import { generateMCQFromAI } from "./helpers";
import { ic, ta, LI, Card } from "./components/ui";
import OutputSection from "./components/OutputSection";
import DocumentSettingsPanel from "./components/DocumentSettingsPanel";
import { generateWordDocument } from "./wordExport";
import {
  JENJANG_OPTIONS,
  getFaseOptions,
  getKelasOptions,
  getMapelOptions,
} from "./data";
import type { Jenjang } from "./data";
import {
  DEFAULT_DOCUMENT_SETTINGS,
  getEffectiveMarginCm,
  getPageDimensionsMm,
} from "./documentSettings";
import type { DocumentSettings } from "./documentSettings";

export default function App() {
  const [form, setForm] = useState<FormData>(INIT_FORM);
  const [sig, setSig] = useState<SigData>(INIT_SIG);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState<FormData | null>(null);
  const [toast, setToast] = useState("");
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [mcqLoading, setMcqLoading] = useState(false);
  const [mcqError, setMcqError] = useState("");
  const [exportingWord, setExportingWord] = useState(false);
  const [mapelManual, setMapelManual] = useState(false);
  const [docSettings, setDocSettings] = useState<DocumentSettings>(DEFAULT_DOCUMENT_SETTINGS);
  const [pendingAction, setPendingAction] = useState<"word" | "print" | null>(null);
  const mcqRequestId = useRef(0);
  const generateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const set = useCallback(
    (k: keyof FormData, v: string) =>
      setForm((p) => ({ ...p, [k]: v })),
    []
  );
  const setSF = useCallback(
    (k: keyof SigData, v: string) =>
      setSig((p) => ({ ...p, [k]: v })),
    []
  );
  const toggleArr = useCallback(
    (k: "dimensi" | "metode" | "lingkungan", v: string) =>
      setForm((p) => {
        const arr = p[k] || [];
        return {
          ...p,
          [k]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v],
        };
      }),
    []
  );

  const setJenjang = useCallback((v: string) => {
    setForm((p) => ({
      ...p,
      jenjang: v,
      fase: getFaseOptions(v as Jenjang | "").includes(p.fase) ? p.fase : "",
      kelas: getKelasOptions(v as Jenjang | "").includes(p.kelas) ? p.kelas : "",
      mapel: getMapelOptions(v as Jenjang | "").includes(p.mapel) ? p.mapel : "",
    }));
  }, []);

  const REQUIRED: [keyof FormData, string][] = [
    ["nama", "Nama Penyusun"],
    ["sekolah", "Satuan Pendidikan"],
    ["tahun", "Tahun Ajaran"],
    ["jenjang", "Jenjang"],
    ["mapel", "Mata Pelajaran"],
    ["fase", "Fase"],
    ["kelas", "Kelas"],
    ["semester", "Semester"],
    ["tema", "Topik/Materi Pembelajaran"],
    ["waktu", "Alokasi Waktu"],
    ["tujuan", "Tujuan Pembelajaran"],
  ];

  function validate() {
    const e: Record<string, string> = {};
    REQUIRED.forEach(([k, lbl]) => {
      const val = form[k];
      if (typeof val === "string" && (!val || !val.trim()))
        e[k] = `${lbl} wajib diisi.`;
    });
    return e;
  }
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }

  async function fetchMcq() {
    const requestId = ++mcqRequestId.current;
    setMcqLoading(true);
    setMcqError("");
    setMcqs([]);
    try {
      const r = await generateMCQFromAI(form.mapel, form.tema, form.tujuan);
      if (mcqRequestId.current !== requestId) return; // hasil basi (mis. sudah di-Reset), abaikan
      setMcqs(r);
    } catch (err: unknown) {
      if (mcqRequestId.current !== requestId) return;
      const message = err instanceof Error ? err.message : String(err);
      setMcqError("❌ Gagal membuat soal otomatis. " + message);
      setMcqs([]);
    } finally {
      if (mcqRequestId.current === requestId) setMcqLoading(false);
    }
  }

  async function generate() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      showToast(
        `❌ ${Object.keys(e).length} field wajib belum lengkap. Silakan periksa kembali form (ditandai merah).`
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setErrors({});
    setGenerating(true);
    setOutput(null);
    setMcqs([]);
    setMcqError("");
    if (generateTimeoutRef.current) clearTimeout(generateTimeoutRef.current);
    generateTimeoutRef.current = setTimeout(() => {
      generateTimeoutRef.current = null;
      setGenerating(false);
      setOutput({ ...form });
    }, 800);
    fetchMcq();
  }

  function handleReset() {
    if (window.confirm("Reset semua data form?")) {
      mcqRequestId.current++; // batalkan hasil fetchMcq yang mungkin masih berjalan
      if (generateTimeoutRef.current) {
        clearTimeout(generateTimeoutRef.current); // batalkan setOutput lama yang masih tertunda
        generateTimeoutRef.current = null;
      }
      setForm(INIT_FORM);
      setSig(INIT_SIG);
      setOutput(null);
      setErrors({});
      setMcqs([]);
      setMcqError("");
      setMcqLoading(false);
      setGenerating(false);
      setMapelManual(false);
    }
  }

  function handleCopy() {
    const el = document.getElementById("modul-output");
    if (!el) {
      showToast("❌ Tidak ada konten untuk disalin.");
      return;
    }
    const text = el.innerText;
    const doFallback = () => {
      const t = document.createElement("textarea");
      t.value = text;
      t.style.cssText = "position:fixed;opacity:0;top:0;left:0";
      document.body.appendChild(t);
      t.select();
      try {
        document.execCommand("copy");
        showToast("✅ Teks modul berhasil disalin!");
      } catch {
        showToast("❌ Gagal menyalin. Coba Ctrl+A lalu Ctrl+C.");
      }
      document.body.removeChild(t);
    };
    if (navigator.clipboard?.writeText)
      navigator.clipboard
        .writeText(text)
        .then(() => showToast("✅ Teks modul berhasil disalin!"))
        .catch(doFallback);
    else doFallback();
  }

  function handlePrint() {
    const el = document.getElementById("modul-output");
    if (!el) {
      showToast("❌ Tidak ada konten untuk dicetak.");
      return;
    }
    const bodyHtml = el.innerHTML;

    const oldArea = document.getElementById("__print_area__");
    if (oldArea) oldArea.remove();
    const oldStyle = document.getElementById("__print_style__");
    if (oldStyle) oldStyle.remove();

    const { width: pageW, height: pageH } = getPageDimensionsMm(docSettings);
    const m = getEffectiveMarginCm(docSettings);
    const bodyPt = docSettings.fontSize;
    const smallPt = docSettings.fontSize - 1.5;
    const lh = docSettings.lineSpacing;

    const styleTag = document.createElement("style");
    styleTag.id = "__print_style__";
    styleTag.innerHTML = `
      @media print {
        @page { size: ${pageW}mm ${pageH}mm; margin: ${m.top}cm ${m.right}cm ${m.bottom}cm ${m.left}cm; }
        html, body { height:auto !important; }
        body > *:not(#__print_area__) { display:none !important; }
        #__print_area__ {
          display:block !important;
          position:static !important;
          width:100% !important;
          margin:0 !important; padding:0 !important;
          box-shadow:none !important; border:none !important;
          font-family:'${docSettings.font}', sans-serif !important;
        }
        #__print_area__ * { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; visibility:visible !important; font-family:'${docSettings.font}', sans-serif !important; }
        #__print_area__ p, #__print_area__ li, #__print_area__ td, #__print_area__ th { line-height:${lh} !important; }
        #__print_area__ .text-sm { font-size:${bodyPt}pt !important; line-height:${lh} !important; }
        #__print_area__ .text-xs { font-size:${smallPt}pt !important; line-height:${lh} !important; }
        #__print_area__ table { width:100%; border-collapse:collapse; font-size:${smallPt}pt; margin:6pt 0 10pt; }
        #__print_area__ th, #__print_area__ td { border:1px solid #777 !important; padding:5pt 7pt !important; text-align:left; vertical-align:top; }
        #__print_area__ th { background:#f7e3e3 !important; font-weight:bold; }
        #__print_area__ tr { page-break-inside:avoid; break-inside:avoid-page; }
        #__print_area__ thead { break-after:avoid-page !important; page-break-after:avoid !important; }
        #__print_area__ ul, #__print_area__ ol { margin:4pt 0 8pt 0 !important; padding-left:18pt !important; }
        #__print_area__ li { margin-bottom:3pt; }
        #__print_area__ .bg-red-800 { background:#8b0000 !important; color:#fff !important; break-after:avoid-page !important; page-break-after:avoid !important; }
        #__print_area__ .bg-rose-700 { background:#be123c !important; color:#fff !important; break-after:avoid-page !important; page-break-after:avoid !important; }
        #__print_area__ .border-red-100 { break-after:avoid-page !important; page-break-after:avoid !important; }
        #__print_area__ .bg-red-50 { background:#fdf2f2 !important; }
        #__print_area__ .bg-blue-50 { background:#eff6ff !important; }
        #__print_area__ .bg-yellow-50 { background:#fffbeb !important; }
        #__print_area__ .bg-amber-50 { background:#fffbeb !important; }
        #__print_area__ .bg-purple-50 { background:#faf5ff !important; }
        #__print_area__ .bg-green-50 { background:#f0fdf4 !important; }
        #__print_area__ .bg-gray-50 { background:#f9fafb !important; }
        #__print_area__ .bg-green-600 { background:#16a34a !important; color:#fff !important; }
        #__print_area__ .text-white { color:#fff !important; }
        #__print_area__ .border-2 { border:2pt solid #8b0000 !important; }
        #__print_area__ .border-t-2 { border-top:2pt solid #ccc !important; break-inside:avoid-page !important; page-break-inside:avoid !important; }
        #__print_area__ .rounded-full { border-radius:999px !important; }
        #__print_area__ .grid { display:grid !important; }
        #__print_area__ .grid-cols-2 { grid-template-columns:1fr 1fr !important; }
        #__print_area__ .flex { display:flex !important; }
        #__print_area__ .inline-flex { display:inline-flex !important; }
        #__print_area__ .items-center { align-items:center !important; }
        #__print_area__ .justify-center { justify-content:center !important; }
        #__print_area__ .shadow, #__print_area__ .shadow-sm { box-shadow:none !important; }
        #__print_area__ .no-print { display:none !important; }
        #__print_area__ .doc-header, #__print_area__ .doc-footer { break-inside:avoid-page !important; page-break-inside:avoid !important; }
      }
      @media screen { #__print_area__ { display:none !important; } }
    `;
    document.head.appendChild(styleTag);

    const container = document.createElement("div");
    container.id = "__print_area__";
    container.innerHTML = bodyHtml;
    document.body.appendChild(container);

    const cleanup = () => {
      const c = document.getElementById("__print_area__");
      if (c) c.remove();
      const s = document.getElementById("__print_style__");
      if (s) s.remove();
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);

    showToast("✅ Membuka dialog cetak / simpan PDF...");
    setTimeout(() => {
      window.print();
      // afterprint adalah pemicu utama pembersihan. Timer ini hanya jaring
      // pengaman untuk browser yang tidak memicu afterprint sama sekali —
      // durasinya dibuat longgar (60 dtk) supaya tidak menghapus area cetak
      // saat dialog "Simpan sebagai PDF" masih terbuka (mis. dokumen dengan
      // banyak pertemuan yang butuh waktu render lebih lama).
      setTimeout(cleanup, 60000);
    }, 250);
  }

  async function handleExportWord() {
    if (!output) {
      showToast("❌ Tidak ada konten untuk diekspor.");
      return;
    }
    setExportingWord(true);
    try {
      await generateWordDocument(output, sig, mcqs, docSettings);
      showToast("✅ Dokumen Word berhasil diunduh!");
    } catch (err) {
      console.error(err);
      showToast("❌ Gagal mengekspor dokumen Word.");
    } finally {
      setExportingWord(false);
    }
  }

  return (
    <div
      style={{ fontFamily: "'Inter',sans-serif" }}
      className="min-h-screen bg-gray-50"
    >
      {toast && (
        <div
          className="fixed top-4 left-1/2 z-50 max-w-[92vw] sm:max-w-md bg-gray-800 text-white text-sm px-5 py-2.5 rounded-xl shadow-lg text-center"
          style={{ transform: "translateX(-50%)" }}
        >
          {toast}
        </div>
      )}

      {output && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="no-print fixed bottom-5 right-5 z-40 bg-red-800 hover:bg-red-900 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg text-lg transition"
          aria-label="Kembali ke atas"
          title="Kembali ke atas"
        >
          ↑
        </button>
      )}

      <DocumentSettingsPanel
        open={pendingAction !== null}
        settings={docSettings}
        onChange={setDocSettings}
        onCancel={() => setPendingAction(null)}
        onConfirm={() => {
          const action = pendingAction;
          setPendingAction(null);
          if (action === "word") handleExportWord();
          else if (action === "print") handlePrint();
        }}
        confirmLabel={pendingAction === "word" ? "Export Word Sekarang" : "Cetak / Simpan PDF Sekarang"}
      />

      <header className="bg-gradient-to-r from-red-800 to-rose-900 text-white px-4 md:px-8 py-4 flex items-center gap-3">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="9" y1="7" x2="15" y2="7" />
          <line x1="9" y1="11" x2="15" y2="11" />
          <line x1="9" y1="15" x2="13" y2="15" />
        </svg>
        <div>
          <h1 className="text-lg md:text-xl font-bold leading-tight">
            Generator Modul Ajar
          </h1>
          <p className="text-red-200 text-xs">
            Deep Learning · Kurikulum Merdeka · AI-Powered
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 md:px-6 py-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="1. Identifikasi">
            {(
              [
                ["nama", "Nama Penyusun", "Cth. Burhand Wally, S.Pd, Gr."],
                ["sekolah", "Satuan Pendidikan", "Cth. SD Negeri 1 Bahari 1"],
                ["tahun", "Tahun Ajaran", "Cth. 2026/2027"],
              ] as [keyof FormData, string, string][]
            ).map(([k, lbl, ph]) => (
              <LI key={k} label={lbl} required error={errors[k]}>
                <input
                  className={`${ic}${errors[k] ? " border-red-400" : ""}`}
                  value={form[k] as string}
                  onChange={(e) => set(k, e.target.value)}
                  placeholder={ph}
                />
              </LI>
            ))}

            <LI label="Jenjang" required error={errors.jenjang}>
              <select
                className={`${ic}${errors.jenjang ? " border-red-400" : ""}`}
                value={form.jenjang}
                onChange={(e) => {
                  setJenjang(e.target.value);
                  setMapelManual(false);
                }}
              >
                <option value="">-- Pilih Jenjang --</option>
                {JENJANG_OPTIONS.map((j) => (
                  <option key={j.kode} value={j.kode}>
                    {j.label}
                  </option>
                ))}
              </select>
            </LI>

            <LI label="Mata Pelajaran" required error={errors.mapel}>
              {mapelManual ? (
                <input
                  className={`${ic}${errors.mapel ? " border-red-400" : ""}`}
                  value={form.mapel}
                  onChange={(e) => set("mapel", e.target.value)}
                  placeholder="Tulis nama mata pelajaran..."
                />
              ) : (
                <select
                  className={`${ic}${errors.mapel ? " border-red-400" : ""}`}
                  value={form.mapel}
                  disabled={!form.jenjang}
                  onChange={(e) => {
                    if (e.target.value === "__custom__") {
                      setMapelManual(true);
                      set("mapel", "");
                    } else {
                      set("mapel", e.target.value);
                    }
                  }}
                >
                  <option value="">
                    {form.jenjang ? "-- Pilih Mata Pelajaran --" : "-- Pilih Jenjang dahulu --"}
                  </option>
                  {getMapelOptions(form.jenjang as Jenjang | "").map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                  <option value="__custom__">Lainnya (isi manual)</option>
                </select>
              )}
            </LI>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(
                [
                  ["fase", "Fase", getFaseOptions(form.jenjang as Jenjang | "")],
                  ["kelas", "Kelas", getKelasOptions(form.jenjang as Jenjang | "")],
                  ["semester", "Semester", ["Ganjil", "Genap"]],
                ] as [keyof FormData, string, string[]][]
              ).map(([k, lbl, opts]) => (
                <div key={k}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {lbl}
                    <span className="text-red-600"> *</span>
                  </label>
                  <select
                    className={`${ic}${errors[k] ? " border-red-400" : ""}`}
                    value={form[k] as string}
                    disabled={k !== "semester" && !form.jenjang}
                    onChange={(e) => set(k, e.target.value)}
                  >
                    <option value="">-- Pilih --</option>
                    {opts.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  {errors[k] && (
                    <p className="text-red-500 text-xs mt-1">{errors[k]}</p>
                  )}
                </div>
              ))}
            </div>
            <LI
              label="Topik/Materi Pembelajaran"
              required
              error={errors.tema}
            >
              <input
                className={`${ic}${errors.tema ? " border-red-400" : ""}`}
                value={form.tema}
                onChange={(e) => set("tema", e.target.value)}
                placeholder="Input topik/materi pembelajaran..."
              />
            </LI>
            <LI label="Alokasi Waktu" required error={errors.waktu}>
              <input
                className={`${ic}${errors.waktu ? " border-red-400" : ""}`}
                value={form.waktu}
                onChange={(e) => set("waktu", e.target.value)}
                placeholder="Cth. 2 x 35 Menit"
              />
            </LI>
            <LI label="Jumlah Pertemuan" required>
              <select
                className={ic}
                value={form.jumlahPertemuan}
                onChange={(e) => set("jumlahPertemuan", e.target.value)}
              >
                {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} Kali Pertemuan
                  </option>
                ))}
              </select>
            </LI>
            <LI label="Kesiapan & Karakteristik Siswa (Opsional)">
              <textarea
                className={ta}
                rows={3}
                value={form.karakteristik}
                onChange={(e) => set("karakteristik", e.target.value)}
                placeholder="Deskripsikan kesiapan dan karakteristik siswa di kelas..."
              />
            </LI>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Dimensi Profil Lulusan
              </label>
              <div className="h-36 overflow-y-auto border border-gray-200 p-3 rounded-lg bg-gray-50">
                {DIMENSI_OPTIONS.map((d) => (
                  <label
                    key={d}
                    className="flex items-center gap-2 text-sm py-1.5 cursor-pointer hover:text-red-700"
                  >
                    <input
                      type="checkbox"
                      checked={form.dimensi.includes(d)}
                      onChange={() => toggleArr("dimensi", d)}
                      className="accent-red-700"
                    />
                    {d}
                  </label>
                ))}
              </div>
            </div>
          </Card>

          <Card title="2. Desain Pembelajaran">
            <LI
              label="Tujuan Pembelajaran"
              required
              error={errors.tujuan}
            >
              <textarea
                className={`${ta}${errors.tujuan ? " border-red-400" : ""}`}
                rows={4}
                value={form.tujuan}
                onChange={(e) => set("tujuan", e.target.value)}
                placeholder="Input tujuan pembelajaran..."
              />
            </LI>
            <LI label="Lintas Disiplin Ilmu">
              <input
                className={ic}
                value={form.lintasDisiplin}
                onChange={(e) => set("lintasDisiplin", e.target.value)}
                placeholder="Input lintas disiplin ilmu..."
              />
            </LI>
            <LI label="Model Pembelajaran" required>
              <select
                className={ic}
                value={form.model}
                onChange={(e) => set("model", e.target.value)}
              >
                {MODEL_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </LI>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Pilihan Metode Pembelajaran
              </label>
              <div className="h-40 overflow-y-auto border border-gray-200 p-3 rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  {METODE_OPTIONS.map((m) => (
                    <label
                      key={m}
                      className="flex items-center gap-2 text-sm py-1.5 cursor-pointer hover:text-red-700"
                    >
                      <input
                        type="checkbox"
                        checked={form.metode.includes(m)}
                        onChange={() => toggleArr("metode", m)}
                        className="accent-red-700"
                      />
                      {m}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <LI label="Media & Pemanfaatan Teknologi Digital">
              <textarea
                className={ta}
                rows={3}
                value={form.media}
                onChange={(e) => set("media", e.target.value)}
                placeholder="Input media pembelajaran atau teknologi digital yang digunakan..."
              />
            </LI>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Lingkungan Belajar
              </label>
              <div className="flex flex-wrap gap-4">
                {["Ruang Fisik (Kelas)", "Ruang Virtual (Online)"].map(
                  (l) => (
                    <label
                      key={l}
                      className="flex items-center gap-2 text-sm cursor-pointer hover:text-red-700"
                    >
                      <input
                        type="checkbox"
                        checked={form.lingkungan.includes(l)}
                        onChange={() => toggleArr("lingkungan", l)}
                        className="accent-red-700"
                      />
                      {l}
                    </label>
                  )
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm font-bold text-red-800 mb-3">
                Konfigurasi Tanda Tangan
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-0.5">
                    Tempat
                  </label>
                  <input
                    className={ic}
                    placeholder="Input tempat..."
                    value={sig.tempat}
                    onChange={(e) => setSF("tempat", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Tanggal
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-gray-400 mb-0.5 text-center">
                        Tanggal
                      </label>
                      <select
                        className={ic}
                        value={sig.tglHari}
                        onChange={(e) => setSF("tglHari", e.target.value)}
                      >
                        <option value="">-Pilih-</option>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(
                          (d) => (
                            <option
                              key={d}
                              value={String(d).padStart(2, "0")}
                            >
                              {String(d).padStart(2, "0")}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-0.5 text-center">
                        Bulan
                      </label>
                      <select
                        className={ic}
                        value={sig.tglBulan}
                        onChange={(e) => setSF("tglBulan", e.target.value)}
                      >
                        <option value="">-Pilih-</option>
                        {BULAN.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-0.5 text-center">
                        Tahun
                      </label>
                      <select
                        className={ic}
                        value={sig.tglTahun}
                        onChange={(e) => setSF("tglTahun", e.target.value)}
                      >
                        <option value="">-Pilih-</option>
                        {Array.from({ length: 11 }, (_, i) => 2020 + i).map(
                          (y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                </div>
                {(
                  [
                    [
                      "kepalaName",
                      "Nama Kepala Sekolah",
                      "Input nama kepala sekolah...",
                    ],
                    [
                      "kepalaNip",
                      "NIP Kepala Sekolah",
                      "Input NIP kepala sekolah...",
                    ],
                    ["guruName", "Nama Guru", "Input nama guru..."],
                    ["guruNip", "NIP Guru", "Input NIP guru..."],
                  ] as [keyof SigData, string, string][]
                ).map(([k, lbl, ph]) => (
                  <div key={k}>
                    <label className="block text-xs font-semibold text-gray-600 mb-0.5">
                      {lbl}
                    </label>
                    <input
                      className={ic}
                      placeholder={ph}
                      value={sig[k]}
                      onChange={(e) => setSF(k, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-xs text-blue-800 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          <span>
            <b>AI-Powered:</b> Soal LKPD (10 soal pilihan ganda) akan dibuat otomatis
            berdasarkan mata pelajaran, topik/materi, dan tujuan pembelajaran yang
            Anda isi. Soal akan menyesuaikan dengan konteks pembelajaran secara cerdas.
            Kegiatan pembelajaran juga akan otomatis dibagi sesuai jumlah pertemuan yang dipilih.
          </span>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={generate}
            disabled={generating || mcqLoading}
            className="bg-red-800 hover:bg-red-900 disabled:bg-red-400 text-white font-bold py-3 px-10 rounded-lg text-base transition flex items-center justify-center gap-2 shadow-lg"
          >
            {generating ? (
              <>
                <svg
                  className="animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Menyiapkan Modul...
              </>
            ) : mcqLoading ? (
              <>
                <svg
                  className="animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                AI Membuat Soal LKPD...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                Generate Modul Ajar
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            className="border border-gray-300 hover:bg-gray-100 text-gray-600 font-semibold py-3 px-6 rounded-lg text-base transition"
          >
            Reset Form
          </button>
        </div>

        {Object.keys(errors).length > 0 && (
          <div
            className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700"
            role="alert"
          >
            <b>Harap lengkapi field berikut:</b>
            <ul className="list-disc pl-5 mt-1">
              {Object.values(errors).map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {output && (
          <div className="mt-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 mb-3 flex flex-wrap gap-3 items-center">
              <span className="text-sm font-bold text-gray-700 mr-auto">
                📄 Modul Ajar Berhasil Dibuat
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                Copy Teks
              </button>
              <button
                onClick={() => setPendingAction("word")}
                disabled={exportingWord}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
              >
                {exportingWord ? (
                  <svg
                    className="animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                )}
                {exportingWord ? "Mengekspor..." : "Export Word"}
              </button>
              <button
                onClick={() => setPendingAction("print")}
                className="flex items-center gap-1 bg-red-800 hover:bg-red-900 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" />
                  <rect width="12" height="8" x="6" y="14" rx="1" />
                </svg>
                Print / Save PDF
              </button>
            </div>
            <OutputSection
              data={output}
              sig={sig}
              mcqs={mcqs}
              mcqLoading={mcqLoading}
              mcqError={mcqError}
              onRetryMcq={fetchMcq}
              docSettings={docSettings}
            />
          </div>
        )}
      </main>
    </div>
  );
}
