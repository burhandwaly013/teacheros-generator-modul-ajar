/**
 * ==========================================================
 * TeacherOS Design Language (TDL)
 * Dashboard V2 Theme
 * ==========================================================
 */

export const dashboardTheme = {
  app: {
    name: "TeacherOS",
    slogan: "Platform Administrasi Guru Indonesia",
  },

  colors: {
    background: "bg-slate-100",

    sidebar: "bg-slate-950",
    sidebarHover: "hover:bg-slate-800",
    sidebarActive: "bg-indigo-600",

    card: "bg-white",

    primary: "bg-indigo-600",
    primaryHover: "hover:bg-indigo-700",

    text: "text-slate-900",
    textLight: "text-slate-500",

    border: "border-slate-200",
  },

  radius: {
    card: "rounded-3xl",
    button: "rounded-xl",
  },

  shadow: {
    card: "shadow-xl",
    sidebar: "shadow-2xl",
  },

  transition: {
    normal: "transition-all duration-200",
    smooth: "transition-all duration-300",
  },

  layout: {
    sidebarWidth: "w-72",
    contentPadding: "p-8",
    maxWidth: "max-w-7xl",
  },
};