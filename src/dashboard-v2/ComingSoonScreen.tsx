import Card from "./Card";

interface ComingSoonScreenProps {
  title: string;
}

export default function ComingSoonScreen({
  title,
}: ComingSoonScreenProps) {
  return (
    <div className="bg-slate-100 min-h-screen p-8">

      <div className="max-w-5xl mx-auto">

        <Card>

          <div className="text-center py-16">

            <div className="text-7xl">
              🚀
            </div>

            <h1 className="mt-8 text-4xl font-black text-slate-800">
              {title}
            </h1>

            <p className="mt-6 text-slate-600 text-lg leading-8">
              Menu ini sedang dalam tahap pengembangan.
            </p>

            <p className="mt-2 text-slate-500">
              Akan tersedia pada update TeacherOS berikutnya.
            </p>

          </div>

        </Card>

      </div>

    </div>
  );
}