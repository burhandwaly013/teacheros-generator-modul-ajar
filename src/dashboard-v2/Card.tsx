import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Card({
  title,
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`
        bg-white
        rounded-3xl
        shadow-lg
        border
        border-slate-200
        p-8
        ${className}
      `}
    >
      {title && (
        <h2 className="text-xl font-bold text-slate-800 mb-6">
          {title}
        </h2>
      )}

      {children}
    </div>
  );
}