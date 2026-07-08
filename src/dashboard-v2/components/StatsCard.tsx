import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "text-indigo-600",
}: StatsCardProps) {
  return (
    <div
      className="
        group
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-md
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between">

        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-slate-100
            transition-all
            duration-300
            group-hover:scale-110
          "
        >
          <Icon
            size={28}
            strokeWidth={2}
            className={color}
          />
        </div>

        <ArrowUpRight
          size={20}
          className="
            text-slate-400
            transition
            group-hover:text-indigo-600
          "
        />

      </div>

      {/* Content */}

      <div className="mt-6">

        <p className="text-sm text-slate-500">
          {title}
        </p>

        <h2 className="mt-2 text-4xl font-black text-slate-900">
          {value}
        </h2>

        <p className="mt-3 text-sm text-slate-500">
          {subtitle}
        </p>

      </div>
    </div>
  );
}