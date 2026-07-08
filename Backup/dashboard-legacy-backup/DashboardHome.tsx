interface DashboardHomeProps {
  userName: string;
}

export default function DashboardHome({
  userName,
}: DashboardHomeProps) {
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            TeacherOS
          </h1>

          <p className="text-slate-600 text-lg">
            Selamat Datang,
          </p>

          <p className="text-2xl font-semibold text-slate-800 mt-2">
            {userName} 👋
          </p>

          <hr className="my-8" />

          <h2 className="text-xl font-semibold mb-3">
            Dashboard
          </h2>

          <p className="text-slate-600 leading-8">
            Selamat datang di TeacherOS.
          </p>

          <p className="text-slate-600 leading-8">
            Silakan pilih salah satu menu di sebelah kiri untuk mulai bekerja.
          </p>

        </div>

      </div>
    </div>
  );
}