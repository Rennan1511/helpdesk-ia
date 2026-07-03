"use client";

import { useEffect, useMemo, useState } from "react";
import { FileBarChart2, Sparkles, Users, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getTickets } from "../utils/tickets";
import { gerarRelatorioChamados, gerarResumoComIA } from "../lib/ai";

export default function RelatoriosPage() {
  const [chamados, setChamados] = useState<any[]>([]);
  const [gerando, setGerando] = useState(false);
  const [resumoIa, setResumoIa] = useState("");

  useEffect(() => {
    setChamados(getTickets());
  }, []);

  const relatorio = useMemo(() => gerarRelatorioChamados(chamados), [chamados]);

  function gerarResumo() {
    setGerando(true);
    setTimeout(() => {
      setResumoIa(gerarResumoComIA(relatorio));
      setGerando(false);
    }, 900);
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-cyan-500/20 text-cyan-400 p-3 rounded-2xl">
                <FileBarChart2 size={24} />
              </div>
              <h1 className="text-5xl font-bold">Relatórios</h1>
            </div>
            <p className="text-[var(--muted)] mt-3 text-lg">
              Visão consolidada dos chamados, responsáveis e principais problemas.
            </p>
          </div>

          <button
            onClick={gerarResumo}
            disabled={gerando}
            className={`relative overflow-hidden px-6 py-4 rounded-2xl flex items-center justify-center gap-3 font-medium transition-all ${
              gerando
                ? "bg-cyan-600/90 text-white shadow-[0_0_30px_rgba(34,211,238,0.35)]"
                : "btn-primary"
            }`}
          >
            <span className={`absolute inset-0 rounded-2xl ${gerando ? "animate-pulse bg-cyan-400/20" : ""}`} />
            <span className={`relative flex items-center gap-3 ${gerando ? "animate-[spin_1.2s_linear_infinite]" : ""}`}>
              <Sparkles size={18} className={gerando ? "text-cyan-100" : ""} />
              {gerando ? "IA analisando chamados..." : "Gerar relatório com IA"}
            </span>
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="surface-card p-6">
            <p className="text-[var(--muted)]">Total de chamados</p>
            <h2 className="text-4xl font-bold mt-3 text-cyan-400">{relatorio.total}</h2>
          </div>

          <div className="surface-card p-6">
            <p className="text-[var(--muted)]">Resolvidos</p>
            <h2 className="text-4xl font-bold mt-3 text-emerald-400">{relatorio.resolvidos}</h2>
          </div>

          <div className="surface-card p-6">
            <p className="text-[var(--muted)]">Em andamento</p>
            <h2 className="text-4xl font-bold mt-3 text-amber-400">{relatorio.emAndamento}</h2>
          </div>

          <div className="surface-card p-6">
            <p className="text-[var(--muted)]">Abertos</p>
            <h2 className="text-4xl font-bold mt-3 text-rose-400">{relatorio.abertos}</h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="surface-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-cyan-400" size={20} />
              <h2 className="text-2xl font-semibold">Resumo gerado pela IA</h2>
            </div>

            <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)]/80 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">IA</p>
                  <p className="text-sm text-[var(--muted)]">Resumo executivo</p>
                </div>
              </div>

              <div className="whitespace-pre-line leading-8 text-[var(--foreground)]">
                {resumoIa || "Clique em “Gerar relatório com IA” para gerar um resumo executivo com base nos chamados."}
                {gerando && <span className="animate-pulse">▋</span>}
              </div>
            </div>
          </div>

          <div className="surface-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="text-amber-400" size={20} />
              <h2 className="text-2xl font-semibold">Maior problema</h2>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/80 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)] mb-3">
                Top 3 recorrências
              </p>

              <div className="space-y-3">
                {(relatorio.topProblemas || []).map(([tema, qtd]) => (
                  <div key={tema} className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 px-4 py-3">
                    <span className="font-medium text-[var(--foreground)]">{tema}</span>
                    <span className="text-cyan-400 font-semibold">{qtd} chamados</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="surface-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="text-emerald-400" size={20} />
              <h2 className="text-2xl font-semibold">Analistas com maior volume</h2>
            </div>

            <div className="space-y-3">
              {relatorio.rankingAnalistas.slice(0, 5).map(([nome, qtd]) => (
                <div key={nome} className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--background)]/80 px-4 py-3">
                  <span className="font-medium text-[var(--foreground)]">{nome}</span>
                  <span className="text-cyan-400 font-semibold">{qtd} chamados</span>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="text-cyan-400" size={20} />
              <h2 className="text-2xl font-semibold">Resumo mensal</h2>
            </div>

            <div className="space-y-3">
              {relatorio.porMes.map((item) => (
                <div key={item.mes} className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--background)]/80 px-4 py-3">
                  <span className="text-[var(--foreground)]">{item.mes}</span>
                  <span className="text-cyan-400 font-semibold">{item.quantidade} chamados</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
