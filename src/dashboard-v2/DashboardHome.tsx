import Card from "./Card";

interface DashboardHomeProps {
  userName: string;
}

export default function DashboardHome({
  userName,
}: DashboardHomeProps) {
  return (
    <div className="bg-slate-100 min-h-screen p-8">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}

        <Card>

          <h1 className="text-4xl font-black text-slate-900">
            TeacherOS
          </h1>

          <p className="text-slate-500 mt-2">
            Platform Administrasi Guru Indonesia
          </p>

          <div className="mt-8">

            <p className="text-lg text-slate-600">
              Selamat Datang,
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              {userName} 👋
            </h2>

          </div>

        </Card>

        {/* Statistik */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <Card>

            <div className="text-5xl">📘</div>

            <h3 className="mt-5 text-xl font-bold">
              Modul Ajar
            </h3>

            <p className="text-slate-500 mt-2">
              Generator Modul Ajar AI
            </p>

          </Card>

          <Card>

            <div className="text-5xl">📚</div>

            <h3 className="mt-5 text-xl font-bold">
              Referensi
            </h3>

            <p className="text-slate-500 mt-2">
              Referensi Pendidikan
            </p>

          </Card>

          <Card>

            <div className="text-5xl">📝</div>

            <h3 className="mt-5 text-xl font-bold">
              Generator Soal
            </h3>

            <p className="text-slate-500 mt-2">
              AI Question Builder
            </p>

          </Card>

          <Card>

            <div className="text-5xl">📒</div>

            <h3 className="mt-5 text-xl font-bold">
              Buku Harian
            </h3>

            <p className="text-slate-500 mt-2">
              Catatan Aktivitas Guru
            </p>

          </Card>

        </div>

        {/* Quick Access */}

        <Card title="Quick Access">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <button className="rounded-2xl border border-slate-200 p-5 hover:bg-slate-50 transition">
              📘
              <div className="mt-3 font-semibold">
                Modul Ajar
              </div>
            </button>

            <button className="rounded-2xl border border-slate-200 p-5 hover:bg-slate-50 transition">
              ✨
              <div className="mt-3 font-semibold">
                Prompt Builder
              </div>
            </button>

            <button className="rounded-2xl border border-slate-200 p-5 hover:bg-slate-50 transition">
              📚
              <div className="mt-3 font-semibold">
                Referensi
              </div>
            </button>

            <button className="rounded-2xl border border-slate-200 p-5 hover:bg-slate-50 transition">
              📄
              <div className="mt-3 font-semibold">
                LKPD
              </div>
            </button>

          </div>

        </Card>

      </div>

    </div>
  );
}