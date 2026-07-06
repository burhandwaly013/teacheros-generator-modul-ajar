interface ComingSoonScreenProps {
  title: string;
}

export default function ComingSoonScreen({
  title,
}: ComingSoonScreenProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-xl text-center">
        <div className="text-6xl mb-4">🚧</div>

        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          {title}
        </h1>

        <p className="text-slate-600 text-lg">
          Fitur ini sedang dalam tahap pengembangan.
        </p>

        <p className="text-slate-500 mt-2">
          Nantikan pada update TeacherOS berikutnya.
        </p>
      </div>
    </div>
  );
}