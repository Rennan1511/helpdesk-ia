"use client";

import { useEffect, useState } from "react";

import {
  Settings,
  User,
  Shield,
  Bell,
  Database,
  Save,
  Lock,
} from "lucide-react";

import { useTheme } from "../providers/ThemeProvider";

interface IUser {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  status: string;
}

export default function ConfiguracoesPage() {
  const [empresa, setEmpresa] =
    useState("HelpDesk IA");

  const [emailSuporte, setEmailSuporte] =
    useState(
      "suporte@helpdesk.com"
    );

    const {
  theme,
  toggleTheme,
} = useTheme();

const dark =
  theme === "dark";

  const [notificacoes, setNotificacoes] =
    useState(true);

  const [backup, setBackup] =
    useState(true);

  const [role, setRole] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("role") || "admin";
    }

    return "admin";
  });

  const [emailAtual, setEmailAtual] =
    useState("");

  const [novaSenha, setNovaSenha] =
    useState("");

  const [confirmarSenha, setConfirmarSenha] =
    useState("");

  const [mensagemSenha, setMensagemSenha] =
    useState("");

  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  const [usuarios, setUsuarios] =
    useState<IUser[]>([]);

  useEffect(() => {
    carregarUsuarios();

    const storedRole =
      localStorage.getItem("role") || "admin";

    const storedEmail =
      localStorage.getItem("userEmail") || "";

    setRole(storedRole);
    setEmailAtual(storedEmail);

    const handleUsuariosAtualizados = () => {
      carregarUsuarios();
    };

    window.addEventListener(
      "usuarios-atualizados",
      handleUsuariosAtualizados
    );
    window.addEventListener(
      "focus",
      handleUsuariosAtualizados
    );

    return () => {
      window.removeEventListener(
        "usuarios-atualizados",
        handleUsuariosAtualizados
      );
      window.removeEventListener(
        "focus",
        handleUsuariosAtualizados
      );
    };
  }, []);

  function carregarUsuarios() {
    const usuariosSalvos = JSON.parse(
      localStorage.getItem("usuarios") || "[]"
    );

    if (Array.isArray(usuariosSalvos)) {
      setUsuarios(usuariosSalvos);
    } else {
      setUsuarios([]);
    }
  }

  function salvar() {
    setShowSuccessModal(true);
  }

  function resetarSenha() {
    if (!novaSenha || novaSenha.length < 4) {
      setMensagemSenha(
        "A nova senha deve ter pelo menos 4 caracteres."
      );
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMensagemSenha(
        "As senhas não coincidem."
      );
      return;
    }

    const chaveSenha = isAdmin
      ? "adminPassword"
      : "userPassword";

    localStorage.setItem(
      chaveSenha,
      novaSenha
    );

    setMensagemSenha(
      isAdmin
        ? "Senha do administrador redefinida com sucesso."
        : "Senha redefinida com sucesso."
    );
    setNovaSenha("");
    setConfirmarSenha("");
  }

  const isAdmin = role === "admin";
  const totalUsuarios = usuarios.length;
  const totalAdmins = usuarios.filter(
    (usuario) => usuario.perfil === "Admin"
  ).length;
  const totalUsuariosComuns = usuarios.filter(
    (usuario) => usuario.perfil === "Usuário"
  ).length;

  return (
    <main
      className={`min-h-screen p-4 md:p-8 transition-colors ${
        dark
          ? "bg-slate-950 text-white"
          : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-5xl font-bold">
            Configurações
          </h1>

          <p className={`mt-3 text-lg ${dark ? "text-slate-400" : "text-slate-600"}`}>
            {isAdmin
              ? "Gerencie as configurações gerais da plataforma"
              : "Ajuste as opções de acesso e preferências da sua conta"}
          </p>
        </div>

        <button
          onClick={salvar}
          className="btn-primary transition-all px-6 py-4 rounded-2xl flex items-center justify-center gap-3 font-medium"
        >
          <Save size={20} />
          Salvar Configurações
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-10 max-w-7xl mx-auto">

        {/* GERAL */}
<div
  className={`rounded-3xl p-8 border transition-all ${
    dark
      ? "bg-slate-900 border-slate-800"
      : "bg-white border-slate-200 shadow-sm"
  }`}
>
  <div className="flex items-center gap-3 mb-6">
    <Settings className="text-blue-400" />

    <h2 className="text-2xl font-semibold">
      Geral
    </h2>
  </div>

  <div className="space-y-5">

    <div>
      <label
        className={`text-sm ${
          dark
            ? "text-slate-400"
            : "text-slate-600"
        }`}
      >
        Nome da Empresa
      </label>

      <input
        value={empresa}
        onChange={(e) =>
          setEmpresa(e.target.value)
        }
        className="w-full mt-2 rounded-2xl px-4 py-3 surface-input"
      />
    </div>

    <div>
      <label
        className={`text-sm ${
          dark
            ? "text-slate-400"
            : "text-slate-600"
        }`}
      >
        Email de Suporte
      </label>

      <input
        value={emailSuporte}
        onChange={(e) =>
          setEmailSuporte(e.target.value)
        }
        className="w-full mt-2 rounded-2xl px-4 py-3 surface-input"
      />
    </div>

  </div>
</div>

{/* APARÊNCIA */}
<div
  className={`rounded-3xl p-8 border transition-all ${
    dark
      ? "bg-slate-900 border-slate-800"
      : "bg-white border-slate-200 shadow-sm"
  }`}
>
  <div className="flex items-center gap-3 mb-6">
    <Settings className="text-cyan-400" />

    <h2 className="text-2xl font-semibold">
      Aparência
    </h2>
  </div>

  <p
    className={`mt-2 ${
      dark
        ? "text-slate-400"
        : "text-slate-600"
    }`}
  >
    Ajuste o tema visual da plataforma para o seu conforto.
  </p>

  <div className="mt-6 surface-panel p-5">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-semibold">Tema atual</p>
        <p className={`text-sm mt-1 ${dark ? "text-slate-400" : "text-slate-600"}`}>
          {dark ? "Escuro ativo" : "Claro ativo"}
        </p>
      </div>

      <button
        onClick={toggleTheme}
        className="relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none"
        aria-label="Alternar tema"
      >
        <span
          className={`absolute inset-0 rounded-full transition-colors duration-300 ${
            dark ? "bg-blue-600" : "bg-slate-300"
          }`}
        />
        <span
          className={`relative ml-1 inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white text-xs shadow transition-transform duration-300 ${
            dark ? "translate-x-7" : "translate-x-0"
          }`}
        >
          {dark ? "🌙" : "☀️"}
        </span>
      </button>
    </div>
  </div>
</div>

{isAdmin ? (
  <>
    {/* USUÁRIOS */}
    <div className="surface-card p-8 transition-all">
      <div className="flex items-center gap-3 mb-6">
        <User className="text-green-400" />

        <h2 className="text-2xl font-semibold">
          Usuários
        </h2>
      </div>

      <div className="space-y-4">
        <div className="surface-panel rounded-2xl p-4">
          Administradores: {totalAdmins}
        </div>

        <div className="surface-panel rounded-2xl p-4">
          Usuários: {totalUsuariosComuns}
        </div>

        <div className="surface-panel rounded-2xl p-4">
          Total: {totalUsuarios}
        </div>
      </div>
    </div>

    {/* SEGURANÇA */}
    <div className="surface-card p-8 transition-all">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="text-yellow-400" />

        <h2 className="text-2xl font-semibold">
          Segurança
        </h2>
      </div>

      <div className="space-y-4">
        <div
          className={`rounded-2xl p-4 border ${
            dark
              ? "bg-slate-950 border-slate-800"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          Login protegido
        </div>

        <div
          className={`rounded-2xl p-4 border ${
            dark
              ? "bg-slate-950 border-slate-800"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          Controle de permissões ativo
        </div>

        <div className="space-y-3 pt-2">
          <label className="block text-sm text-slate-400">
            Nova senha do administrador
          </label>
          <input
            type="password"
            value={novaSenha}
            onChange={(e) => {
              setNovaSenha(e.target.value);
              setMensagemSenha("");
            }}
            placeholder="Digite a nova senha"
            className="w-full rounded-2xl px-4 py-3 surface-input"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-slate-400">
            Confirmar senha
          </label>
          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) => {
              setConfirmarSenha(e.target.value);
              setMensagemSenha("");
            }}
            placeholder="Confirme a nova senha"
            className="w-full rounded-2xl px-4 py-3 surface-input"
          />
        </div>

        {mensagemSenha && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            {mensagemSenha}
          </div>
        )}

        <button
          onClick={resetarSenha}
          className="btn-primary px-5 py-3 rounded-2xl font-medium"
        >
          Redefinir minha senha
        </button>
      </div>
    </div>

    {/* SISTEMA */}
    <div className="surface-card p-8 transition-all">
      <div className="flex items-center gap-3 mb-6">
        <Database className="text-purple-400" />

        <h2 className="text-2xl font-semibold">
          Sistema
        </h2>
      </div>

      <div className="space-y-5">
        <label className="surface-panel flex items-center justify-between rounded-2xl p-4">
          <span>Backup automático</span>

          <input
            type="checkbox"
            checked={backup}
            onChange={() =>
              setBackup(!backup)
            }
          />
        </label>

        <label className="surface-panel flex items-center justify-between rounded-2xl p-4">
          <span>Notificações</span>

          <input
            type="checkbox"
            checked={notificacoes}
            onChange={() =>
              setNotificacoes(!notificacoes)
            }
          />
        </label>
      </div>
    </div>
  </>
) : (
  <div className="surface-card p-8 transition-all lg:col-span-2">
    <div className="flex items-center gap-3 mb-6">
      <Lock className="text-emerald-400" />

      <h2 className="text-2xl font-semibold">
        Segurança da conta
      </h2>
    </div>

    <div className="space-y-4">
      <div className="surface-panel rounded-2xl p-4">
        <p className="font-medium">Conta ativa</p>
        <p className="text-sm mt-1 text-slate-400">
          {emailAtual || "Usuário autenticado"}
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm text-slate-400">
          Nova senha
        </label>
        <input
          type="password"
          value={novaSenha}
          onChange={(e) => {
            setNovaSenha(e.target.value);
            setMensagemSenha("");
          }}
          placeholder="Digite a nova senha"
          className="w-full rounded-2xl px-4 py-3 surface-input"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm text-slate-400">
          Confirmar senha
        </label>
        <input
          type="password"
          value={confirmarSenha}
          onChange={(e) => {
            setConfirmarSenha(e.target.value);
            setMensagemSenha("");
          }}
          placeholder="Confirme a nova senha"
          className="w-full rounded-2xl px-4 py-3 surface-input"
        />
      </div>

      {mensagemSenha && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {mensagemSenha}
        </div>
      )}

      <button
        onClick={resetarSenha}
        className="btn-primary px-5 py-3 rounded-2xl font-medium"
      >
        Redefinir senha
      </button>
    </div>
  </div>
)}
</div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-5">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-8">
            <div className="flex justify-center">
              <div className="bg-emerald-500/20 text-emerald-400 p-5 rounded-full">
                <Save size={32} />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mt-6">
              Configurações salvas
            </h2>

            <p className="text-slate-400 text-center mt-3">
              Suas alterações foram aplicadas com sucesso.
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 py-3 rounded-2xl transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}

    </main>
  );
}