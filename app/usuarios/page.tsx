"use client";

import { useEffect, useState } from "react";

import {
  Users,
  Plus,
  Trash2,
  Shield,
  User,
  X,
  KeyRound,
} from "lucide-react";

interface IUser {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  status: string;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] =
    useState<IUser[]>([]);

  const [showModal, setShowModal] =
    useState(false);

  const [nome, setNome] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [perfil, setPerfil] =
    useState("Usuário");

  const [role, setRole] =
    useState("admin");

  const [showResetModal, setShowResetModal] =
    useState(false);

  const [usuarioSelecionado, setUsuarioSelecionado] =
    useState<IUser | null>(null);

  useEffect(() => {
    const storedRole =
      localStorage.getItem("role") || "admin";
    setRole(storedRole);

    carregarUsuarios();
  }, []);

  function carregarUsuarios() {
    const usuariosSalvos =
      JSON.parse(
        localStorage.getItem(
          "usuarios"
        ) || "[]"
      );

    if (
      usuariosSalvos.length === 0
    ) {
      const padrao = [
        {
          id: 1,
          nome: "Administrador",
          email:"admin@helpdesk.com",
          perfil: "Super Admin",
          status: "Ativo",
        },
        {
          id: 2,
          nome: "Usuário",
          email:
            "usuario@helpdesk.com",
          perfil: "Usuário",
          status: "Ativo",
        },
      ];

      localStorage.setItem(
        "usuarios",
        JSON.stringify(
          padrao
        )
      );

      setUsuarios(padrao);
      return;
    }

    setUsuarios(
      usuariosSalvos
    );
  }

  function notificarUsuariosAtualizados() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new Event("usuarios-atualizados")
      );
    }
  }

  function criarUsuario() {
    if (
      !nome ||
      !email
    ) {
      alert(
        "Preencha todos os campos."
      );
      return;
    }

    const novoUsuario = {
      id: Date.now(),
      nome,
      email,
      perfil,
      status: "Ativo",
    };

    const atualizados = [
      ...usuarios,
      novoUsuario,
    ];

    localStorage.setItem(
      "usuarios",
      JSON.stringify(
        atualizados
      )
    );

    setUsuarios(
      atualizados
    );

    setNome("");
    setEmail("");
    setPerfil(
      "Usuário"
    );

    setShowModal(
      false
    );

    notificarUsuariosAtualizados();
  }

  function excluirUsuario(
    id: number
  ) {
    const atualizados =
      usuarios.filter(
        (u) =>
          u.id !== id
      );

    localStorage.setItem(
      "usuarios",
      JSON.stringify(
        atualizados
      )
    );

    setUsuarios(
      atualizados
    );

    notificarUsuariosAtualizados();
  }

  const totalUsuarios =
    usuarios.length;

  const totalAdmins =
    usuarios.filter(
      (u) =>
        u.perfil ===
        "Super Admin"
    ).length;

  const totalUsuariosComuns =
    usuarios.filter(
      (u) =>
        u.perfil ===
        "Usuário"
    ).length;

  function abrirResetSenha(usuario: IUser) {
    setUsuarioSelecionado(usuario);
    setShowResetModal(true);
  }

  function resetarSenhaUsuario() {
    if (!usuarioSelecionado) return;

    const atualizados = usuarios.map((usuario) => {
  if (usuario.id === usuarioSelecionado.id) {
    return {
      ...usuario,
      senha: "123456",
      senhaResetada: true,
    };
  }

  return usuario;
});

    localStorage.setItem(
      "usuarios",
      JSON.stringify(atualizados)
    );

    setUsuarios(atualizados);
    notificarUsuariosAtualizados();
    setShowResetModal(false);
    setUsuarioSelecionado(null);
  }

  const isAdmin = role === "admin";

  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-5xl font-bold">
            Usuários
          </h1>

          <p className="text-[var(--muted)] mt-3">
            Gestão de usuários do sistema
          </p>
        </div>

        <button
          onClick={() =>
            setShowModal(
              true
            )
          }
          className="btn-primary px-6 py-4 rounded-2xl flex items-center gap-3 transition-all"
        >
          <Plus size={20} />
          Novo Usuário
        </button>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="surface-card p-8">
          <div className="flex items-center justify-between">
            <p className="text-[var(--muted)]">
              Total
            </p>

            <div className="bg-orange-500/20 text-orange-400 p-3 rounded-2xl">
              <Users size={22} />
            </div>
          </div>

          <h2 className="text-5xl font-bold text-orange-400 mt-4">
            {totalUsuarios}
          </h2>
        </div>

        <div className="surface-card p-8">
          <div className="flex items-center justify-between">
            <p className="text-[var(--muted)]">
              Administradores
            </p>

            <div className="bg-yellow-500/20 text-yellow-400 p-3 rounded-2xl">
              <Shield size={22} />
            </div>
          </div>

          <h2 className="text-5xl font-bold text-yellow-400 mt-4">
            {totalAdmins}
          </h2>
        </div>

        <div className="surface-card p-8">
          <div className="flex items-center justify-between">
            <p className="text-[var(--muted)]">
              Usuários
            </p>

            <div className="bg-green-500/20 text-green-400 p-3 rounded-2xl">
              <User size={22} />
            </div>
          </div>

          <h2 className="text-5xl font-bold text-green-400 mt-4">
            {totalUsuariosComuns}
          </h2>
        </div>
      </div>

      {/* TABELA */}
      <div className="surface-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left p-5">
                Nome
              </th>

              <th className="text-left p-5">
                Email
              </th>

              <th className="text-left p-5">
                Perfil
              </th>

              <th className="text-left p-5">
                Status
              </th>

              <th className="text-right p-5">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map(
              (
                usuario
              ) => (
                <tr
                  key={
                    usuario.id
                  }
                  className="border-b border-slate-800"
                >
                  <td className="p-5">
                    {
                      usuario.nome
                    }
                  </td>

                  <td className="p-5 text-slate-400">
                    {
                      usuario.email
                    }
                  </td>

                  <td className="p-5">
                    <span
                      className={`px-3 py-1 rounded-xl text-sm ${
                    usuario.perfil === "Super Admin"
                    ? "bg-red-500/20 text-red-400"
                    : usuario.perfil === "Admin"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-blue-500/20 text-blue-400"
               }`}
>
  {usuario.perfil}
</span>
                  </td>

                  <td className="p-5">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-xl text-sm">
                      {
                        usuario.status
                      }
                    </span>
                  </td>

                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {isAdmin && (
  <button
    onClick={() =>
      abrirResetSenha(usuario)
    }
    className="text-cyan-400 hover:text-cyan-300"
    title="Redefinir senha"
  >
    <KeyRound size={18} />
  </button>
)}

                      <button
                        onClick={() =>
                          excluirUsuario(
                            usuario.id
                          )
                        }
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2
                          size={18}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {showResetModal && usuarioSelecionado && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Redefinir senha
              </h2>

              <button onClick={() => {
                setShowResetModal(false);
                setUsuarioSelecionado(null);
              }}>
                <X />
              </button>
            </div>

            <p className="text-slate-400 leading-7">
              Deseja redefinir a senha de <span className="text-white font-semibold">{usuarioSelecionado.nome}</span> para <span className="text-cyan-400 font-semibold">123456</span>?
            </p>

            <div className="flex items-center justify-end gap-3 mt-8">
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setUsuarioSelecionado(null);
                }}
                className="bg-slate-800 hover:bg-slate-700 px-5 py-3 rounded-2xl transition-all"
              >
                Cancelar
              </button>

              <button
                onClick={resetarSenhaUsuario}
                className="bg-cyan-600 hover:bg-cyan-500 px-5 py-3 rounded-2xl transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                Novo Usuário
              </h2>

              <button
                onClick={() =>
                  setShowModal(
                    false
                  )
                }
              >
                <X />
              </button>
            </div>

            <div className="space-y-5">
              <input
                value={nome}
                onChange={(
                  e
                ) =>
                  setNome(
                    e.target
                      .value
                  )
                }
                placeholder="Nome"
                className="w-full surface-input rounded-2xl px-5 py-4"
              />

              <input
                value={email}
                onChange={(
                  e
                ) =>
                  setEmail(
                    e.target
                      .value
                  )
                }
                placeholder="Email"
                className="w-full surface-input rounded-2xl px-5 py-4"
              />

              <select
                value={
                  perfil
                }
                onChange={(
                  e
                ) =>
                  setPerfil(
                    e.target
                      .value
                  )
                }
                className="w-full surface-input rounded-2xl px-5 py-4"
              >
                <option>
                  Usuário
                </option>

                <option>
                  Admin
                </option>
              </select>

              <button
                onClick={
                  criarUsuario
                }
                className="w-full bg-blue-600 hover:bg-blue-500 rounded-2xl py-4 font-semibold"
              >
                Salvar Usuário
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}