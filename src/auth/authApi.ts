// Klien API Login — memanggil Google Apps Script sebagai backend autentikasi.
// Modul ini murni fungsi network, tidak menyimpan state apa pun (state
// sesi ditangani oleh useAuth.ts).
//
// CATATAN PENTING soal Content-Type:
// Google Apps Script Web App tidak menyediakan handler doOptions(), jadi
// tidak bisa menjawab CORS preflight (OPTIONS) yang otomatis dikirim
// browser setiap kali fetch() memakai header "Content-Type: application/json"
// (ini disebut "non-simple request" di spesifikasi CORS). Akibatnya request
// gagal total di level jaringan SEBELUM doPost() sempat dijalankan di sisi
// Apps Script.
//
// Solusinya: kirim body dengan Content-Type "text/plain;charset=utf-8" —
// salah satu dari sedikit Content-Type yang tergolong "simple request" per
// spesifikasi CORS sehingga TIDAK memicu preflight sama sekali. Isi body
// tetap string JSON seperti biasa; Apps Script membaca lewat
// e.postData.contents tanpa peduli header Content-Type-nya, jadi
// JSON.parse(e.postData.contents) di doPost() tetap berfungsi normal.
// JANGAN kembalikan Content-Type ke "application/json" — itu akan
// memunculkan lagi masalah preflight yang sama.

const LOGIN_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwzlE2dYdyVw_Kc5AxK2FRu23w2xr_UvrO5psBondJesuLY_E3sfigFYE0r6qcGHIrM/exec";

export interface LoginResponse {
  success: boolean;
  [key: string]: unknown;
}

/**
 * Kirim email+password ke endpoint login. Melempar Error kalau request
 * gagal di level jaringan (server tidak terjangkau, CORS diblokir, dsb) —
 * ini dibedakan dari "success: false" (email/password salah) supaya
 * LoginPage bisa menampilkan pesan yang sesuai untuk masing-masing kasus.
 */
export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  let res: Response;
  try {
    res = await fetch(LOGIN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error("Tidak dapat menghubungi server login. Periksa koneksi internet Anda.");
  }

  if (!res.ok) {
    throw new Error("Server login mengembalikan error. Silakan coba lagi.");
  }

  try {
    return (await res.json()) as LoginResponse;
  } catch {
    throw new Error("Respons server login tidak valid.");
  }
}