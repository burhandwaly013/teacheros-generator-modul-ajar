import {
  Bell,
  Search,
  Settings,
  UserCircle2,
} from "lucide-react";

interface HeaderProps {
  userName: string;
}

export default function Header({
  userName,
}: HeaderProps) {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

      {/* ================= LEFT ================= */}

      <div>

        <h1 className="text-4xl font-black text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Selamat datang kembali di TeacherOS.
        </p>

      </div>

      {/* ================= RIGHT ================= */}

      <div className="flex flex-wrap items-center gap-4">

        {/* Search */}

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Cari menu..."
            className="
              w-72
              rounded-2xl
              border
              border-slate-200
              bg-white
              py-3
              pl-11
              pr-4
              outline-none
              transition
              focus:border-indigo-500
              focus:ring-4
              focus:ring-indigo-100
            "
          />

        </div>

        {/* Notification */}

        <button
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            border
            border-slate-200
            bg-white
            transition
            hover:bg-slate-50
          "
        >
          <Bell size={20} />
        </button>

        {/* Settings */}

        <button
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            border
            border-slate-200
            bg-white
            transition
            hover:bg-slate-50
          "
        >
          <Settings size={20} />
        </button>

        {/* User */}

        <div
          className="
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-4
            py-2
          "
        >

          <UserCircle2
            size={42}
            className="text-indigo-600"
          />

          <div>

            <div className="font-semibold text-slate-900">
              {userName}
            </div>

            <div className="text-sm text-slate-500">
              Guru
            </div>

          </div>

        </div>

      </div>

    </header>
  );
}