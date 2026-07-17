"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import StatusBadge from "../components/StatusBadge";

import {
  getTickets,
} from "../utils/tickets";

export default function ChamadosPage() {
  const router = useRouter();

  const [chamados, setChamados] =
    useState<any[]>([]);

 const [busca, setBusca] =
  useState("");

const [
  statusFiltro,
  setStatusFiltro,
] = useState("Todos");

const [
  paginaAtual,
  setPaginaAtual,
] = useState(1);

const itensPorPagina = 20;

useEffect(() => {
  const data = getTickets().map(
  (ticket: any) => ({
    ...ticket,
    status:
      ticket.solucao &&
      ticket.solucao.trim() !== ""
        ? "Resolvido"
        : ticket.status,
  })
);

setChamados(data);
}, []);

const chamadosFiltrados =
  chamados.filter((item) => {
    const matchBusca =
  item.titulo
    ?.toLowerCase()
    .includes(
      busca.toLowerCase()
    ) ||
  item.id
    ?.toString()
    .includes(busca);

    const matchStatus =
      statusFiltro ===
        "Todos" ||
      item.status ===
        statusFiltro;

    return (
      matchBusca &&
      matchStatus
    );
  });

const totalPaginas =
  Math.ceil(
    chamadosFiltrados.length /
      itensPorPagina
  );

const chamadosPaginados =
  chamadosFiltrados.slice(
    (paginaAtual - 1) *
      itensPorPagina,
    paginaAtual *
      itensPorPagina
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Topo */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-5xl font-bold">
              Chamados
            </h1>

            <p className="text-slate-400 mt-3 text-lg">
              Gestão operacional de tickets
            </p>
          </div>

          <button
            onClick={() =>
              router.push(
                "/novo-ticket"
              )
            }
            className="bg-blue-600 hover:bg-blue-500 transition-all px-5 py-3 rounded-2xl font-medium"
          >
            Novo Chamado
          </button>
        </div>

        {/* Filtros */}
        <div className="mt-10 flex flex-col lg:flex-row gap-4">
          <input
            value={busca}
            onChange={(e) => {
               setBusca(
               e.target.value
               );

              setPaginaAtual(1);
             }}
            placeholder="Buscar chamado..."
            className="flex-1 surface-input rounded-2xl px-5 py-4 outline-none focus:border-blue-500"
          />

          <select
            value={
              statusFiltro
            }
            onChange={(e) => {
              setStatusFiltro(
               e.target.value
              );

               setPaginaAtual(1);
             }}
            className="surface-input rounded-2xl px-5 py-4 outline-none focus:border-blue-500"
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
        </div>

        {/* Tabela */}
        <div className="mt-10 surface-card overflow-hidden">
          <table className="w-full">
            <thead className="surface-panel">
              <tr>
                <th className="text-left p-5">
                  ID
               </th>

                <th className="text-left p-5">
                  Título
               </th>

                <th className="text-left p-5">
                  Data
               </th>

                <th className="text-left p-5">
                  Analista
               </th>

                <th className="text-left p-5">
                  Prioridade
               </th>

                <th className="text-left p-5">
                  Status
                </th>

                <th className="text-left p-5">
                  Descrição
                  
                </th>
              </tr>
            </thead>

            <tbody>
              {chamadosPaginados.map(
                  (item) => (
                  <tr
                    key={item.id}
                    onClick={() =>
                      router.push(
                        `/ticket/${item.id}`
                      )
                    }
                    className="border-t border-slate-800 hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <td className="p-5 whitespace-nowrap font-semibold">
  #{item.id}
</td>

<td className="p-5 font-medium">
  {item.titulo}
</td>

<td className="p-5 whitespace-nowrap text-slate-300">
  {item.data_hora
    ? item.data_hora
        .split(" ")[0]   // pega apenas a data
        .replace(/-/g, "/") // troca - por /
    : "-"}
</td>

<td className="p-5 text-slate-300">
  {item.analista_responsavel ||
    "-"}
</td>

<td className="p-5">
  <span className="bg-blue-600 px-3 py-1 rounded-lg text-sm">
    {item.prioridade}
  </span>
</td>

<td className="p-5">
  <StatusBadge
    status={item.status}
  />
</td>

<td className="p-5 text-slate-400 max-w-xl">
  <p className="line-clamp-2">
    {item.descricao}
  </p>
</td>
                  </tr>
                )
              )}

              {chamadosFiltrados.length ===
                0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center text-slate-500"
                  >
                    Nenhum chamado encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
                  {totalPaginas > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              disabled={paginaAtual === 1}
              onClick={() =>
                setPaginaAtual(
                  paginaAtual - 1
                )
              }
              className="surface-panel px-4 py-2 rounded-xl disabled:opacity-40"
            >
              Anterior
            </button>

            <span className="text-slate-400">
              Página {paginaAtual} de{" "}
              {totalPaginas}
            </span>

            <button
              disabled={
                paginaAtual ===
                totalPaginas
              }
              onClick={() =>
                setPaginaAtual(
                  paginaAtual + 1
                )
              }
              className="surface-panel px-4 py-2 rounded-xl disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        )}
        </div>
      </div>
    </main>
  );
}