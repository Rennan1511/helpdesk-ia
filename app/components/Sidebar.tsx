"use client";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  LayoutDashboard,
  Ticket,
  Bot,
  Menu,
  ChevronLeft,
  LogOut,
  Users,
  Settings,
  FileBarChart2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

export default function Sidebar() {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const [collapsed, setCollapsed] =
    useState(false);

  const [role, setRole] =
    useState("");

  useEffect(() => {
    const storedRole =
      localStorage.getItem(
        "role"
      ) || "";

    setRole(storedRole);
  }, []);

  /* MENU ADMIN */
  const adminMenu = [
    {
      label:
        "Dashboard",

      href:
        "/",

      icon:
        LayoutDashboard,
    },

    {
      label:
        "Chamados",

      href:
        "/chamados",

      icon:
        Ticket,
    },

    {
      label:
        "Assistente IA",

      href:
        "/assistente",

      icon:
        Bot,
    },

    {
      label:
        "Usuários",

      href:
        "/usuarios",

      icon:
        Users,
    },

    {
      label:
        "Relatórios",

      href:
        "/relatorios",

      icon:
        FileBarChart2,
    },

    {
      label:
        "Configurações",

      href:
        "/configuracoes",

      icon:
        Settings,
    },

  ];

  /* MENU USER */
  const userMenu = [
    {
      label:
        "Assistente IA",

      href:
        "/assistente",

      icon:
        Bot,
    },

    {
      label:
        "Novo Chamado",

      href:
        "/novo-ticket",

      icon:
        Ticket,
    },

    {
      label:
        "Meus Chamados",

      href:
        "/meus-chamados",

      icon:
        Ticket,
    },

    {
      label:
        "Configurações",

      href:
        "/configuracoes",

      icon:
        Settings,
    },
  ];

  const menuItems =
    role === "admin"
      ? adminMenu
      : userMenu;

  function logout() {
    localStorage.removeItem(
      "usuario"
    );

    localStorage.removeItem(
      "role"
    );

    router.push(
      "/login"
    );
  }

  return (
    <aside
      className={`h-screen bg-slate-950 border-r border-slate-800 transition-all duration-300 flex flex-col ${
        collapsed
          ? "w-24 items-center"
          : "w-72"
      }`}
    >
      {/* HEADER */}
      <div className="w-full p-6 border-b border-slate-800">
        <div
          className={`flex items-center ${
            collapsed
              ? "justify-center"
              : "justify-between"
          }`}
        >
          {!collapsed && (
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                HelpDesk IA
              </h1>

              <p className="text-slate-400 mt-2">
                Plataforma Inteligente
              </p>
            </div>
          )}

          <button
            onClick={() =>
              setCollapsed(
                !collapsed
              )
            }
            className="bg-blue-600 hover:bg-blue-500 transition-all w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          >
            {collapsed ? (
              <Menu size={24} />
            ) : (
              <ChevronLeft size={24} />
            )}
          </button>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 p-4 space-y-3 w-full">
        {menuItems.map(
          (item) => {
            const Icon =
              item.icon;

            const active =
              pathname ===
              item.href;

            return (
              <Link
                key={
                  item.href
                }
                href={
                  item.href
                }
                className={`flex items-center transition-all rounded-2xl ${
                  collapsed
                    ? "justify-center w-16 h-16 mx-auto"
                    : "gap-4 px-5 py-4"
                } ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icon className="w-6 h-6 shrink-0" />

                {!collapsed && (
                  <span className="font-medium text-lg">
                    {
                      item.label
                    }
                  </span>
                )}
              </Link>
            );
          }
        )}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-800 w-full">
        <button
          onClick={logout}
          className={`w-full bg-slate-900 hover:bg-red-500/20 border border-slate-800 hover:border-red-500/30 transition-all rounded-2xl text-white ${
            collapsed
              ? "h-16 flex items-center justify-center"
              : "px-5 py-4 flex items-center gap-4"
          }`}
        >
          <LogOut className="w-5 h-5 shrink-0" />

          {!collapsed && (
            <span className="font-medium">
              Sair
            </span>
          )}
        </button>

        {!collapsed && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mt-5">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />

              <p className="text-green-400 font-semibold">
                IA ONLINE
              </p>
            </div>

            <p className="text-slate-400 text-sm mt-3 leading-6">
              Atendimento automatizado ativo.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}