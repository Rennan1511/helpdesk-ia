"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { analisarChamado } from "../lib/ai";

export default function NovoTicketPage() {
  const router = useRouter();

  const [titulo, setTitulo] =
    useState("");

  const [descricao, setDescricao] =
    useState("");

  const [prioridade, setPrioridade] =
    useState("Média");

  const [categoria, setCategoria] =
    useState("");

  const [sugestaoIA, setSugestaoIA] =
    useState("");

  const [responsavelIA, setResponsavelIA] =
    useState("");

    const [anexo, setAnexo] =
  useState<string>("");

  function criarTicket() {
    const analise =
      analisarChamado(
        titulo,
        descricao
      );

    setPrioridade(
      analise.prioridade
    );

    setCategoria(
      analise.categoria
    );

    setSugestaoIA(
      analise.sugestao
    );

    setResponsavelIA(
      analise.responsavel
    );

    const chamadosSalvos =
      JSON.parse(
        localStorage.getItem(
          "chamados"
        ) || "[]"
      );

    const usuario =
       localStorage.getItem(
           "userEmail"
      ) || "Usuário";

    const novoTicket = {
  id: `2026-${String(
    chamadosSalvos.length + 5000
  ).padStart(4, "0")}`,

  data_hora: new Date().toISOString(),

  titulo,

  solicitante: usuario,

  descricao,

  status: "Aberto",

  anexo,

  solucao: "",

  analista_responsavel:
    analise.responsavel,

  prioridade:
    analise.prioridade,

  categoria:
    analise.categoria,
};

    chamadosSalvos.push(
      novoTicket
    );

    localStorage.setItem(
      "chamados",
      JSON.stringify(
        chamadosSalvos
      )
    );

    router.push(
      "/meus-chamados"
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div>
          <h1 className="text-5xl font-bold">
            Novo Chamado
          </h1>

          <p className="text-slate-400 mt-3 text-lg">
            A IA fará a triagem
            automática do ticket
          </p>
        </div>

        {/* FORM */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mt-10 space-y-6">
          {/* TÍTULO */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Título
            </label>

            <input
              value={titulo}
              onChange={(e) =>
                setTitulo(
                  e.target.value
                )
              }
              placeholder="Ex: ERP não abre"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-blue-500"
            />
          </div>

          {/* DESCRIÇÃO */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Descrição
            </label>

            <textarea
              value={descricao}
              onChange={(e) =>
                setDescricao(
                  e.target.value
                )
              }
              placeholder="Descreva o problema..."
              rows={6}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-blue-500"
            />
          </div>

          {/* IA */}
          {titulo &&
            descricao && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      IA de
                      Triagem
                    </h2>

                    <p className="text-slate-400 mt-2">
                      Análise
                      automática
                      do chamado
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-2xl">
                    🤖
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {/* CATEGORIA */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                    <p className="text-slate-400 text-sm">
                      Categoria
                    </p>

                    <h3 className="text-lg font-semibold mt-2">
                      {
                        analisarChamado(
                          titulo,
                          descricao
                        )
                          .categoria
                      }
                    </h3>
                  </div>

                  {/* PRIORIDADE */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                    <p className="text-slate-400 text-sm">
                      Prioridade
                    </p>

                    <h3 className="text-lg font-semibold mt-2">
                      {
                        analisarChamado(
                          titulo,
                          descricao
                        )
                          .prioridade
                      }
                    </h3>
                  </div>

                  {/* RESPONSÁVEL */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                    <p className="text-slate-400 text-sm">
                      Responsável
                    </p>

                    <h3 className="text-lg font-semibold mt-2">
                      {
                        analisarChamado(
                          titulo,
                          descricao
                        )
                          .responsavel
                      }
                    </h3>
                  </div>

                  {/* IA */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                    <p className="text-slate-400 text-sm">
                      Sugestão IA
                    </p>

                    <h3 className="text-lg font-semibold mt-2 leading-7">
                      {
                        analisarChamado(
                          titulo,
                          descricao
                        )
                          .sugestao
                      }
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div>
  <label className="block text-sm text-slate-400 mb-2">
    Anexo
  </label>

  <input
    type="file"
    accept=".png,.jpg,.jpeg,.pdf,.xlsx,.doc,.docx"
    onChange={(e) => {
      const file =
        e.target.files?.[0];

      if (!file) return;

      const reader =
        new FileReader();

      reader.onload = () => {
        setAnexo(
          reader.result as string
        );
      };

      reader.readAsDataURL(
        file
      );
    }}
    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4"
  />
</div>

          {/* BOTÃO */}
          <button
            onClick={criarTicket}
            className="w-full bg-blue-600 hover:bg-blue-500 transition-all rounded-2xl py-4 text-lg font-semibold"
          >
            Criar Chamado
          </button>
        </div>
      </div>
    </main>
  );
}