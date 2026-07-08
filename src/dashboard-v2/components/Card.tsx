interface CardProps {
  title?: string;
  children: React.ReactNode;
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
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-8
        shadow-lg
        ${className}
      `}
    >
      {title && (
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          {title}
        </h2>
      )}

      {children}
    </div>
  );
}