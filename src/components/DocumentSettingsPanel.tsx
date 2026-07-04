import React from "react";
import type { DocumentSettings, MarginCm } from "../documentSettings";
import { DEFAULT_DOCUMENT_SETTINGS } from "../documentSettings";

const selCls =
  "w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white transition";
const numCls =
  "w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white transition";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

/**
 * Satu grup pengaturan (mis. "Kertas & Layout", "Tipografi"). Dialog ini
 * dibangun dari beberapa SettingGroup — menambah grup baru di masa depan
 * (mis. "Template & Cover", "Watermark") tinggal menambah satu
 * <SettingGroup> baru di bawah, tanpa mengubah struktur yang sudah ada.
 */
function SettingGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{title}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{children}</div>
    </div>
  );
}

export default function DocumentSettingsPanel({
  open,
  settings,
  onChange,
  onCancel,
  onConfirm,
  confirmLabel,
}: {
  open: boolean;
  settings: DocumentSettings;
  onChange: (next: DocumentSettings) => void;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel: string;
}) {
  if (!open) return null;

  const set = <K extends keyof DocumentSettings>(key: K, value: DocumentSettings[K]) =>
    onChange({ ...settings, [key]: value });

  const setCustomMargin = (side: keyof MarginCm, value: number) =>
    onChange({
      ...settings,
      marginPreset: "custom",
      customMargin: { ...settings.customMargin, [side]: value },
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 text-base">⚙️ Pengaturan Dokumen</h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 text-sm"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4">
          <SettingGroup title="Kertas & Layout">
            <Field label="Ukuran Kertas">
              <select
                className={selCls}
                value={settings.paperSize}
                onChange={(e) => set("paperSize", e.target.value as DocumentSettings["paperSize"])}
              >
                <option value="F4">F4 / Folio (21,59 × 33,02 cm)</option>
                <option value="A4">A4 (21 × 29,7 cm)</option>
              </select>
            </Field>
            <Field label="Orientasi">
              <select
                className={selCls}
                value={settings.orientation}
                onChange={(e) => set("orientation", e.target.value as DocumentSettings["orientation"])}
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </Field>
            <Field label="Margin">
              <select
                className={selCls}
                value={settings.marginPreset}
                onChange={(e) => set("marginPreset", e.target.value as DocumentSettings["marginPreset"])}
              >
                <option value="normal">Normal (2 cm)</option>
                <option value="narrow">Sempit (1,27 cm)</option>
                <option value="wide">Lebar (3 cm)</option>
                <option value="custom">Kustom...</option>
              </select>
            </Field>
          </SettingGroup>

          {settings.marginPreset === "custom" && (
            <SettingGroup title="Margin Kustom (cm)">
              <Field label="Margin Atas">
                <input
                  type="number"
                  step={0.1}
                  min={0}
                  className={numCls}
                  value={settings.customMargin.top}
                  onChange={(e) => setCustomMargin("top", Number(e.target.value))}
                />
              </Field>
              <Field label="Margin Kanan">
                <input
                  type="number"
                  step={0.1}
                  min={0}
                  className={numCls}
                  value={settings.customMargin.right}
                  onChange={(e) => setCustomMargin("right", Number(e.target.value))}
                />
              </Field>
              <Field label="Margin Bawah">
                <input
                  type="number"
                  step={0.1}
                  min={0}
                  className={numCls}
                  value={settings.customMargin.bottom}
                  onChange={(e) => setCustomMargin("bottom", Number(e.target.value))}
                />
              </Field>
              <Field label="Margin Kiri">
                <input
                  type="number"
                  step={0.1}
                  min={0}
                  className={numCls}
                  value={settings.customMargin.left}
                  onChange={(e) => setCustomMargin("left", Number(e.target.value))}
                />
              </Field>
            </SettingGroup>
          )}

          <SettingGroup title="Tipografi">
            <Field label="Font">
              <select
                className={selCls}
                value={settings.font}
                onChange={(e) => set("font", e.target.value as DocumentSettings["font"])}
              >
                <option value="Calibri">Calibri</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Arial">Arial</option>
              </select>
            </Field>
            <Field label="Ukuran Font">
              <select
                className={selCls}
                value={settings.fontSize}
                onChange={(e) => set("fontSize", Number(e.target.value) as DocumentSettings["fontSize"])}
              >
                <option value={11}>11</option>
                <option value={12}>12</option>
              </select>
            </Field>
            <Field label="Line Spacing">
              <select
                className={selCls}
                value={settings.lineSpacing}
                onChange={(e) => set("lineSpacing", Number(e.target.value) as DocumentSettings["lineSpacing"])}
              >
                <option value={1.15}>1.15</option>
                <option value={1.5}>1.5</option>
              </select>
            </Field>
          </SettingGroup>

          <SettingGroup title="Elemen Halaman">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showPageNumber}
                onChange={(e) => set("showPageNumber", e.target.checked)}
              />
              Nomor Halaman
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showHeader}
                onChange={(e) => set("showHeader", e.target.checked)}
              />
              Header
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showFooter}
                onChange={(e) => set("showFooter", e.target.checked)}
              />
              Footer
            </label>
          </SettingGroup>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onChange(DEFAULT_DOCUMENT_SETTINGS)}
            className="text-xs font-semibold text-gray-500 hover:text-gray-700 underline"
          >
            Reset ke Default
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="text-sm font-semibold text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="text-sm font-semibold text-white bg-red-800 hover:bg-red-900 px-4 py-2 rounded-lg transition"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
