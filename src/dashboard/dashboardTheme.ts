/**
 * ==========================================================
 * TeacherOS Dashboard Theme
 * ----------------------------------------------------------
 * Seluruh identitas visual Dashboard TeacherOS
 * diatur dari file ini.
 * ==========================================================
 */

export const dashboardTheme = {
  colors: {
    primary: "bg-indigo-600",
    primaryHover: "hover:bg-indigo-700",

    sidebar: "bg-slate-950",
    sidebarBorder: "border-slate-800",

    page: "bg-slate-100",

    card: "bg-white",

    textPrimary: "text-slate-900",
    textSecondary: "text-slate-500",

    activeMenu: "bg-indigo-600 text-white",
    inactiveMenu:
      "text-slate-300 hover:bg-slate-800 hover:text-white",

    border: "border-slate-200",
  },

  shadow: {
    card: "shadow-xl",
    sidebar: "shadow-2xl",
    floating: "shadow-lg",
  },

  radius: {
    card: "rounded-3xl",
    button: "rounded-xl",
  },

  transition: {
    normal: "transition-all duration-200",
    smooth: "transition-all duration-300",
  },
};