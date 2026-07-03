"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  Ticket,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function MeusChamadosPage() {
  const [chamados, setChamados] =
    useState<any[]>([]);

  useEffect(() => {
    carregarChamados();
  }, []);

  function carregarChamados() {
    const tickets =
      JSON.parse(
        localStorage.getItem(
          "chamados"
        ) || "[]"
      );

    const usuario =
      localStorage.getItem(
        "usuario"
      );

    const role =
      localStorage.getItem(
        "role"
      );

    /* ADMIN VÊ TODOS */
    if (
      role === "admin"
    ) {
      setChamados(
        tickets
      );

      return;
    }

    /* USER VÊ APENAS OS DELE */
    const chamadosUsuario =
      tickets.filter(
        (item: any) =>
          item.usuario ===
          usuario
      );

    setChamados(
      chamadosUsuario
    );
  }

  function corPrioridade(
    prioridade: string
  ) {
    if (
      prioridade ===
      "Alta"
    ) {
      return "bg-red-500/20 text-red-400 border-red-500/30";
    }

    if (
      prioridade ===
      "Média"
    ) {
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    }

    return "bg-green-500/20 text-green-400 border-green-500/30";
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-5xl font-bold">
            Meus Chamados
          </h1>

          <p className="text-slate-400 mt-3 text-lg">
            Acompanhe seus atendimentos
          </p>
        </div>

        <Link
          href="/assistente"
          className="bg-blue-600 hover:bg-blue-500 transition-all px-6 py-4 rounded-2xl font-semibold"
        >
          Novo Chamado
        </Link>
      </div>

      {/* SEM CHAMADOS */}
      {chamados.length ===
        0 && (
        <div className="surface-card p-14 text-center">
          <Ticket className="w-16 h-16 mx-auto text-[var(--muted)] mb-6" />

          <h2 className="text-3xl font-bold mb-3">
            Nenhum chamado encontrado
          </h2>

          <p className="text-slate-400 text-lg">
            Você ainda não possui chamados abertos.
          </p>
        </div>
      )}

      {/* LISTA */}
      <div className="space-y-5">
        {chamados.map(
          (
            chamado,
            index
          ) => (
            <Link
              key={index}
              href={`/ticket/${chamado.id}`}
              className="block surface-card p-6 hover:border-blue-500 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* ESQUERDA */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-slate-500 text-sm">
                      🎫 #
                      {
                        chamado.id
                      }
                    </span>

                    <span
                      className={`px-4 py-2 rounded-xl border text-sm font-medium ${corPrioridade(
                        chamado.prioridade
                      )}`}
                    >
                      {
                        chamado.prioridade
                      }
                    </span>

                    <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-xl text-sm font-medium">
                      {
                        chamado.categoria
                      }
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold mt-4">
                    {
                      chamado.titulo
                    }
                  </h2>

                  <p className="text-slate-400 mt-3 leading-7">
                    {
                      chamado.descricao
                    }
                  </p>

                  {/* DETALHES */}
                  {chamado.detalhes && (
                    <div className="mt-5 surface-panel rounded-2xl p-5">
                      <p className="text-sm text-[var(--muted)] mb-3">
                        Informações enviadas
                      </p>

                      <p className="whitespace-pre-line text-slate-200 leading-7">
                        {
                          chamado.detalhes
                        }
                      </p>
                    </div>
                  )}
                </div>

                {/* DIREITA */}
                <div className="flex flex-col items-start lg:items-end gap-4">
                  <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-5 py-3 rounded-2xl font-medium">
                    {
                      chamado.status
                    }
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Clock className="w-4 h-4" />

                    <span>
                      {
                        chamado.criadoEm
                      }
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <AlertCircle className="w-4 h-4" />

                    <span>
                      Clique para abrir
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )
        )}
      </div>
    </main>
  );
}