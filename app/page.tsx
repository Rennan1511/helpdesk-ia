"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { getTickets } from "./utils/tickets";

import {
  Search,
  Bell,
  Ticket,
  Clock,
  LayoutGrid,
  List,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";





const COLORS = [
  "#2563eb",
  "#0ea5e9",
  "#38bdf8",
];

export default function DashboardPage() {
  const [chamados, setChamados] =
    useState<any[]>([]);

  const [
    visualizacao,
    setVisualizacao,
  ] = useState<
    "lista" | "cards"
  >("lista");

  const [busca, setBusca] =
  useState("");

  const [filtroStatus, setFiltroStatus] =
  useState("Todos");

const [
  filtroPrioridade,
  setFiltroPrioridade,
] = useState("Todas");

const [
  mostrarNotificacoes,
  setMostrarNotificacoes,
] = useState(false);

const [
  notificacoes,
  setNotificacoes,
] = useState([
  {
    id: 1,
    texto:
      "Novo chamado criado",
    lida: false,
  },
  {
    id: 2,
    texto:
      "Ticket resolvido",
    lida: false,
  },
  {
    id: 3,
    texto:
      "IA abriu um novo chamado",
    lida: false,
  },
]);

  useEffect(() => {
    const data =
      getTickets();

    setChamados(data);
  }, []);

  const totalChamados =
  chamados.length;

  const totalAbertos =
  chamados.filter(
    (c) =>
      c.status ===
      "Aberto"
  ).length;

const totalEmAndamento =
  chamados.filter(
    (c) =>
      c.status ===
      "Em andamento"
  ).length;

const totalResolvidos =
  chamados.filter(
    (c) =>
      c.status ===
      "Resolvido"
  ).length;

const totalAndamento =
  chamados.filter(
    (c) =>
      c.status ===
      "Em andamento"
  ).length;

const totalAnalistas =
  new Set(
    chamados.map(
      (c) =>
        c.analista_responsavel
    )
  ).size;

const prioridadeData = [
  {
    name: "Alta",
    value: chamados.filter(
      (c) =>
        c.prioridade?.trim() === "Alta"
    ).length,
  },
  {
    name: "Média",
    value: chamados.filter(
      (c) =>
        c.prioridade?.trim() === "Média"
    ).length,
  },
  {
    name: "Baixa",
    value: chamados.filter(
      (c) =>
        c.prioridade?.trim() === "Baixa"
    ).length,
  },
];

const meses = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const chamadosPorMes =
  meses.map(
    (mes, index) => ({
      mes,
      chamados:
        chamados.filter(
          (c) => {
            const data =
              new Date(
                c.data_hora
              );

            return (
              data.getMonth() ===
              index
            );
          }
        ).length,
    })
  );
    const chamadosFiltrados =
  chamados.filter((item) => {
    const buscaOk =
      item.titulo
        ?.toLowerCase()
        .includes(
          busca.toLowerCase()
        ) ||
      item.id
        ?.toString()
        .includes(busca);

    const statusOk =
      filtroStatus === "Todos"
        ? true
        : item.status ===
          filtroStatus;

    const prioridadeOk =
      filtroPrioridade ===
      "Todas"
        ? true
        : item.prioridade ===
          filtroPrioridade;

    return (
      buscaOk &&
      statusOk &&
      prioridadeOk
    );
  });
const notificacoesNaoLidas =
  notificacoes.filter(
    (n) => !n.lida
  ).length;


  
  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bold">
            Dashboard
          </h1>

          <p className="text-[var(--muted)] mt-3 text-lg">
            Visão operacional do HelpDesk IA
          </p>
        </div>

        <div className="flex items-center gap-4 relative">
          <div className="surface-panel rounded-2xl p-5 flex items-center gap-3">
            <Search
              size={18}
              className="text-[var(--muted)]"
            />

            <input
            value={busca}
            onChange={(e) =>
            setBusca(e.target.value)
          }
            placeholder="Buscar chamado..."
            className="bg-transparent outline-none text-sm w-56"
             />
             <select
  value={filtroStatus}
  onChange={(e) =>
    setFiltroStatus(
      e.target.value
    )
  }
  className="surface-input rounded-2xl px-4 py-4"
>
  <option>
    Todos
  </option>

  <option>
    Aberto
  </option>

  <option>
    Em andamento
  </option>

  <option>
    Resolvido
  </option>

  <option>
    Cancelado
  </option>
</select>

<select
  value={filtroPrioridade}
  onChange={(e) =>
    setFiltroPrioridade(
      e.target.value
    )
  }
  className="surface-input rounded-2xl px-4 py-4"
>
  <option>
    Todas
  </option>

  <option>
    Alta
  </option>

  <option>
    Média
  </option>

  <option>
    Baixa
  </option>
</select>
          </div>

          <button
  onClick={() =>
    setMostrarNotificacoes(
      !mostrarNotificacoes
    )
  }
  className="surface-panel p-4 rounded-2xl hover:shadow-xl transition-all relative">
            <Bell size={20} />
            {notificacoesNaoLidas > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notificacoesNaoLidas}
              </span>
            )}
          </button>

          {mostrarNotificacoes && (
  <div className="absolute right-0 top-16 w-80 surface-card z-50">
    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
      <h3 className="font-semibold">
        Notificações
      </h3>

      <button
        onClick={() =>
          setNotificacoes(
            notificacoes.map(
              (n) => ({
                ...n,
                lida: true,
              })
            )
          )
        }
        className="text-xs text-blue-400"
      >
        Marcar lidas
      </button>
    </div>

    <div>
      {notificacoes.map(
        (item) => (
          <div
            key={item.id}
            className={`p-4 border-b border-slate-800 ${
              !item.lida
                ? "bg-blue-500/10"
                : ""
            }`}
          >
            {item.texto}
          </div>
        )
      )}
    </div>
  </div>
)}
        </div>
      </div>

      {/* CARDS */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-10">

  <DashboardCard
  titulo="Total de Chamados"
  valor={String(totalChamados)}
  icon={<Ticket size={22} />}
  color={{
    bg: "bg-orange-500/20",
    text: "text-orange-400",
  }}
/>

<DashboardCard
  titulo="Abertos"
  valor={String(totalAbertos)}
  icon={<AlertTriangle size={22} />}
  color={{
    bg: "bg-blue-500/20",
    text: "text-blue-400",
  }}
/>

<DashboardCard
  titulo="Em Andamento"
  valor={String(totalEmAndamento)}
  icon={<Clock size={22} />}
  color={{
    bg: "bg-yellow-500/20",
    text: "text-yellow-300",
  }}
/>

<DashboardCard
  titulo="Resolvidos"
  valor={String(totalResolvidos)}
  icon={<CheckCircle2 size={22} />}
  color={{
    bg: "bg-green-500/20",
    text: "text-green-400",
  }}
/>

</div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* BAR CHART */}
        <div className="lg:col-span-2 surface-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              Chamados por Mês
            </h2>
          </div>

          <div className="w-full h-64 md:h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={
                  chamadosPorMes
               }
            >
                <XAxis dataKey="mes" />

                <Tooltip />

                <Bar
                  dataKey="chamados"
                  fill="#2563eb"
                  radius={[
                    10,
                    10,
                    0,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="surface-card p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Prioridades
          </h2>

          <div className="w-full h-64 md:h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
             data={prioridadeData}
             dataKey="value"
             nameKey="name"
             outerRadius={110}
             label
>
                  {prioridadeData.map(
                    (
                      entry,
                      index
                    ) => (
                      <Cell
                        key={
                          index
                        }
                        fill={
                          COLORS[
                            index
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CHAMADOS */}
      <div className="surface-card p-6 mt-8">
        {/* TOPO */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-semibold">
            Chamados Recentes
          </h2>

          <div className="flex items-center gap-3">
            {/* LISTA */}
            <button
              onClick={() =>
                setVisualizacao(
                  "lista"
                )
              }
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all ${
                visualizacao ===
                "lista"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              <List size={18} />
              Lista
            </button>

            {/* CARDS */}
            <button
              onClick={() =>
                setVisualizacao(
                  "cards"
                )
              }
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all ${
                visualizacao ===
                "cards"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              <LayoutGrid
                size={18}
              />
              Cards
            </button>

            <Link
              href="/chamados"
              className="bg-blue-600 hover:bg-blue-500 transition-all px-5 py-3 rounded-2xl font-medium"
            >
              Ver Todos
            </Link>
          </div>
        </div>

        {/* LISTA / CARDS */}
        <div
          className={
            visualizacao ===
            "lista"
              ? "space-y-4"
              : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          }
        >
          {chamadosFiltrados
            .slice(0, 10)
            .map(
            (
              item,
              index
            ) => (
              <Link
                key={index}
                href={`/ticket/${item.id}`}
                className={`w-full block surface-panel hover:border-blue-500 transition-all duration-300 ${
                  visualizacao ===
                  "lista"
                    ? "p-6"
                    : "p-6 hover:-translate-y-1"
                }`}
              >
                {/* LISTA */}
                {visualizacao === "lista" ? (
  <div className="flex items-center justify-between gap-6">
    <div className="flex-1">
      <p className="text-slate-500 text-sm">
        #{item.id}
      </p>

      <h3 className="text-xl font-semibold mt-2 break-words">
        {item.titulo}
      </h3>
    </div>

    <div className="flex items-center gap-3">

      {/* PRIORIDADE */}
      <span
        className={`px-4 py-2 rounded-xl text-sm ${
          item.prioridade === "Alta"
            ? "bg-red-500/20 text-red-400"
            : item.prioridade === "Média"
            ? "bg-yellow-500/20 text-yellow-300"
            : "bg-blue-500/20 text-blue-400"
        }`}
      >
        {item.prioridade}
      </span>

      {/* STATUS */}
      <span
        className={`px-4 py-2 rounded-xl text-sm font-medium ${
          item.status === "Resolvido"
            ? "bg-green-500/20 text-green-400"
            : item.status === "Cancelado"
            ? "bg-red-500/20 text-red-400"
            : item.status === "Em andamento"
            ? "bg-yellow-500/20 text-yellow-300"
            : "bg-blue-500/20 text-blue-400"
        }`}
      >
        {item.status || "Aberto"}
      </span>

    </div>
  </div>
) : (
                  /* CARDS */
                  <>
                    <div className="flex items-center justify-between">
                      <p className="text-slate-500 text-sm">
                        #
                        {
                          item.id
                        }
                      </p>

                      <span
                        className={`px-3 py-1 rounded-xl text-sm ${
                          item.prioridade ===
                          "Alta"
                            ? "bg-red-500/20 text-red-400"
                            : item.prioridade ===
                              "Média"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {
                          item.prioridade
                        }
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold mt-5 line-clamp-2">
                      {
                        item.titulo
                      }
                    </h3>

                    <div className="mt-6 space-y-3">
                      {/* CATEGORIA */}
                      <div className="flex items-center justify-between">
                        <p className="text-slate-500">
                          Categoria
                        </p>

                        <p className="px-3 py-1 rounded-xl text-sm font-medium">
                          {item.categoria ||
                            "Sistema"}
                        </p>
                      </div>

                      {/* STATUS */}
                      <div className="flex items-center justify-between">
                        <p className="text-slate-500">
                          Status
                        </p>

                        <span
                          className={`px-3 py-1 rounded-xl text-sm font-medium ${
                            item.status ===
                            "Resolvido"
                              ? "bg-green-500/20 text-green-400"
                              : item.status ===
                                "Cancelado"
                              ? "bg-red-500/20 text-red-400"
                              : item.status ===
                                "Em andamento"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {item.status ||
                            "Aberto"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="bg-blue-600 hover:bg-blue-500 transition-all text-center py-3 rounded-2xl font-medium">
                        Abrir chamado
                      </div>
                    </div>
                  </>
                )}
              </Link>
            )
          )}

          {chamadosFiltrados.length ===
            0 && (
            <div className="surface-panel p-10 text-center">
              <p className="text-[var(--muted)]">
                Nenhum chamado encontrado.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/* CARD DASHBOARD */
function DashboardCard({
  titulo,
  valor,
  icon,
  color,
}: any) {
  return (
    <div className="surface-card p-8">
      <div className="flex items-center justify-between">
        <p className="text-[var(--muted)]">
          {titulo}
        </p>

        <div
          className={`p-3 rounded-2xl ${color.bg} ${color.text}`}
        >
          {icon}
        </div>
      </div>

      <h2
        className={`text-5xl font-bold mt-4 ${color.text}`}
      >
        {valor}
      </h2>
    </div>
  );
}