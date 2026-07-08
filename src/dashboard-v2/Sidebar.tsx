import { menuItems } from "./menuItems";
import { dashboardTheme } from "./dashboardTheme";

interface SidebarProps {
  activeMenu: string;
  onMenuClick: (item: (typeof menuItems)[number]) => void;
}

export default function Sidebar({
  activeMenu,
  onMenuClick,
}: SidebarProps) {
  return (
    <aside
      className={`
        ${dashboardTheme.layout.sidebarWidth}
        ${dashboardTheme.colors.sidebar}
        text-white
        flex-shrink-0
        ${dashboardTheme.shadow.sidebar}
      `}
    >
      {/* Header */}

      <div className="px-6 py-7 border-b border-slate-800">

        <h1 className="text-3xl font-black tracking-wide">
          {dashboardTheme.app.name}
        </h1>

        <p className="text-sm text-slate-400 mt-2">
          {dashboardTheme.app.slogan}
        </p>

      </div>

      {/* Menu */}

      <nav className="py-4">

        {menuItems.map((item) => {

          const active = activeMenu === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onMenuClick(item)}
              className={`

                w-full
                flex
                items-center
                gap-4
                px-6
                py-3

                transition-all
                duration-200

                ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }

              `}
            >

              <span className="text-xl">
                {item.icon}
              </span>

              <span className="font-medium">
                {item.label}
              </span>

            </button>
          );

        })}

      </nav>

      {/* Footer */}

      <div className="mt-auto border-t border-slate-800 px-6 py-5">

        <p className="text-xs text-slate-500">
          TeacherOS V2
        </p>

        <p className="text-xs text-slate-600 mt-1">
          Dashboard Modern
        </p>

      </div>

    </aside>
  );
}