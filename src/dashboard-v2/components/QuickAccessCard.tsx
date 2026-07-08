import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
  onClick?: () => void;
}

export default function QuickAccessCard({
  title,
  description,
  icon: Icon,
  color = "text-indigo-600",
  onClick,
}: QuickAccessCardProps) {
  return (
    <button
      onClick={onClick}
      className="
        group
        w-full
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-6
        text-left
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-indigo-300
        hover:shadow-2xl
      "
    >
      <div className="flex items-center justify-between">

        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-indigo-50
          "
        >
          <Icon
            size={30}
            strokeWidth={2}
            className={`${color} transition-transform duration-300 group-hover:scale-110`}
          />
        </div>

        <ArrowRight
          size={20}
          className="
            text-slate-400
            transition-all
            duration-300
            group-hover:translate-x-1
            group-hover:text-indigo-600
          "
        />

      </div>

      <h3 className="mt-6 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </button>
  );
}