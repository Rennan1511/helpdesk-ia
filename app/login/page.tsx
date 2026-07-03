"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [erro, setErro] =
    useState(false);

  function entrar() {
    /* ADMIN */
    if (
      email ===
        "admin@helpdesk.com" &&
      senha ===
        (localStorage.getItem("adminPassword") || "N@n1511")
    ) {
      localStorage.setItem(
        "auth",
        "true"
      );

      localStorage.setItem(
        "role",
        "admin"
      );

      localStorage.setItem(
        "userEmail",
        email
      );

      router.push("/");
    }

    /* USER */
    else if (
      email ===
        "usuario@helpdesk.com" &&
      senha ===
        (localStorage.getItem("userPassword") || "123456")
    ) {
      localStorage.setItem(
        "auth",
        "true"
      );

      localStorage.setItem(
        "role",
        "user"
      );

      localStorage.setItem(
        "userEmail",
        email
      );

      router.push(
        "/assistente"
      );
    }

    /* ERRO */
    else {
      setErro(true);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md surface-card p-10">
        <h1 className="text-4xl font-bold text-white">
          HelpDesk IA
        </h1>

        <p className="text-slate-400 mt-3">
          Plataforma Inteligente
        </p>

        <div className="space-y-5 mt-10">
          {/* EMAIL */}
          <div>
            <label className="block text-slate-400 text-sm mb-2">
              Email
            </label>

            <input
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              placeholder="Digite seu email"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* SENHA */}
          <div>
            <label className="block text-slate-400 text-sm mb-2">
              Senha
            </label>

            <input
              type="password"
              value={senha}
              onChange={(e) =>
                setSenha(
                  e.target.value
                )
              }
              placeholder="Digite sua senha"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* ERRO */}
          {erro && (
            <div className="surface-panel border-red-500/20 text-red-400 px-4 py-3 rounded-2xl">
              Usuário ou senha inválidos
            </div>
          )}

          {/* BOTÃO */}
          <button
            onClick={entrar}
            className="w-full btn-primary rounded-2xl py-4 text-lg font-semibold text-white"
          >
            Entrar
          </button>
        </div>

        {/* LOGINS */}
        <div className="mt-8 space-y-2 text-sm text-slate-500">
          <p>
            👑 Admin:
            admin@helpdesk.com
          </p>

          <p>
            👤 Usuário:
            usuario@helpdesk.com
          </p>

          <p>Senha</p>
        </div>
      </div>
    </main>
  );
}