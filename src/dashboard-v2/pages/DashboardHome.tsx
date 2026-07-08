import {
  BookOpen,
  LibraryBig,
  Sparkles,
  FileText,
} from "lucide-react";

import Header from "../components/Header";
import Card from "../components/Card";
import StatsCard from "../components/StatsCard";
import QuickAccessCard from "../components/QuickAccessCard";

import { dashboardStats } from "../config/dashboardStats";

interface DashboardHomeProps {
  userName: string;
}

export default function DashboardHome({
  userName,
}: DashboardHomeProps) {
  return (
    <div className="min-h-screen bg-slate-100">

      <div className="mx-auto max-w-7xl p-8 space-y-8">

        {/* ================= HEADER ================= */}

        <Header userName={userName} />

        {/* ================= STATISTICS ================= */}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

          {dashboardStats.map((item) => (

            <StatsCard
              key={item.title}
              title={item.title}
              value={item.value}
              subtitle={item.subtitle}
              icon={item.icon}
              color={item.color}
            />

          ))}

        </div>

        {/* ================= QUICK ACCESS ================= */}

        <Card title="Quick Access">

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

            <QuickAccessCard
              title="Generator Modul Ajar"
              description="Buat Modul Ajar AI"
              icon={BookOpen}
            />

            <QuickAccessCard
              title="Prompt Builder"
              description="Menyusun Prompt AI"
              icon={Sparkles}
              color="text-amber-500"
            />

            <QuickAccessCard
              title="Referensi Pendidikan"
              description="Materi & Regulasi"
              icon={LibraryBig}
              color="text-emerald-600"
            />

            <QuickAccessCard
              title="LKPD"
              description="Lembar Kerja Peserta Didik"
              icon={FileText}
              color="text-pink-600"
            />

          </div>

        </Card>

      </div>

    </div>
  );
}