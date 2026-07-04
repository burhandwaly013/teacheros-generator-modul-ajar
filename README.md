# Generator Modul Ajar — Deep Learning Kurikulum Merdeka

React + Vite + TypeScript + Tailwind CSS 4. Semua source sudah divalidasi (sintaks, import/export, tipe field, dependency) — tidak ada file yang hilang atau rusak.

## Struktur Proyek

```
.
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx              # entry point
    ├── App.tsx                # komponen utama (form input + orchestration)
    ├── constants.ts           # opsi dropdown, nilai default form
    ├── helpers.ts             # util waktu, pembagian pertemuan, panggilan AI MCQ
    ├── mcqGenerator.ts        # generator soal pilihan ganda per mata pelajaran
    ├── wordExport.ts          # ekspor modul ajar ke file .docx (library `docx`)
    ├── index.css              # Tailwind entry + font import
    ├── components/
    │   ├── ui.tsx              # komponen UI reusable (Card, LI, Tbl, dll)
    │   └── OutputSection.tsx   # render hasil modul ajar
    └── utils/
        └── cn.ts               # helper className (clsx + tailwind-merge)
```

## Menjalankan di Lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Build Produksi

```bash
npm run build
```

Catatan: proyek ini memakai `vite-plugin-singlefile`, sehingga hasil build (`dist/index.html`) adalah **satu file HTML tunggal** yang sudah membundel semua JS & CSS. Ini artinya:
- Bisa dibuka langsung dari file system (double click `dist/index.html`) tanpa server.
- Deploy jadi sangat sederhana — cukup upload satu file `dist/index.html` ke hosting statis mana pun.

Preview hasil build:
```bash
npm run preview
```

## Deploy

Karena output build adalah 1 file HTML statis, semua opsi berikut berlaku:

### Vercel / Netlify (drag & drop atau CI)
1. `npm run build`
2. Upload folder `dist/` (atau hubungkan repo Git, biarkan platform menjalankan `npm run build` dengan output directory `dist`).

### GitHub Pages
1. `npm run build`
2. Push isi `dist/` ke branch `gh-pages`, atau gunakan action seperti `peaceiris/actions-gh-pages`.

### Hosting statis lain (S3, Cloudflare Pages, dsb.)
Upload isi folder `dist/` (cukup `index.html`) ke bucket/hosting.

## Dependency Utama

| Package | Fungsi |
|---|---|
| `react`, `react-dom` | UI framework |
| `docx` | Generate file Word (.docx) |
| `file-saver` | Trigger download file di browser |
| `clsx`, `tailwind-merge` | Utility className |
| `tailwindcss` v4 + `@tailwindcss/vite` | Styling |
| `vite-plugin-singlefile` | Bundle build jadi satu file HTML |
