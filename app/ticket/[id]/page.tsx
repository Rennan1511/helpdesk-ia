"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
  useParams,
} from "next/navigation";

import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  X,
} from "lucide-react";

import Link from "next/link";

import {
  getTickets,
  deleteTicket,
  isLocalTicket,
  updateTicket,
} from "@/app/utils/tickets";

import type {
  ITicket,
} from "@/app/data/chamados.ts";

export default function TicketDetalhePage() {
  const router =
    useRouter();

  const params =
    useParams();

  const [ticket, setTicket] =
  useState<ITicket | null>(null);

  const [status, setStatus] =
  useState("");

  const [
  showSuccessModal,
  setShowSuccessModal,
] = useState(false);

  const [
  analista,
  setAnalista,
] = useState("");

const [
  solucao,
  setSolucao,
] = useState("");

  const [role, setRole] =
useState("");

  const isAdmin = role === "admin";

  const [
    showDeleteModal,
    setShowDeleteModal,
  ] = useState(false);

  const [
  podeExcluir,
  setPodeExcluir,
] = useState(false);

  useEffect(() => {
  const userRole =
    localStorage.getItem(
      "role"
    ) || "";

  setRole(userRole);

  const tickets =
    getTickets();

  const found =
    tickets.find(
      (t) =>
        String(t.id) ===
        String(params.id)
    );

  setTicket(found ?? null);

if (found) {
  setStatus(found.status);

  setAnalista(
    found.analista_responsavel || ""
  );

  setSolucao(
    found.solucao || ""
  );
}

  if (found) {
  setPodeExcluir(
    isLocalTicket(
      String(found.id)
    )
  );
}
}, [params.id]);


  function handleDelete() {
  if (!ticket) return;

  deleteTicket(
    String(ticket.id)
  );

  router.push(
    "/chamados"
  );
}

function salvar() {
  if (!ticket || !isAdmin) return;

  updateTicket(
  String(ticket.id),
  {
    status,
    analista_responsavel:
      analista,
    solucao,
  }
);

  setTicket({
  ...ticket,
  status,
  analista_responsavel:
    analista,
  solucao,
});

 setShowSuccessModal(true);
}

  if (!ticket) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">
          Carregando chamado...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8\">
      {/* TOPO */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-slate-500">
            #
            {ticket.id}
          </p>

          <h1 className="text-5xl font-bold mt-2">
            {
              ticket.titulo
            }
          </h1>

          <p className="text-slate-400 mt-3 text-lg">
            Detalhamento completo do chamado
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={
             role === "admin"
                    ? "/chamados"
                    : "/meus-chamados"
                 }
            className="bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all px-5 py-3 rounded-2xl flex items-center gap-2"
          >
            <ArrowLeft
              size={18}
            />

            Voltar
          </Link>

          {isAdmin ? (
            <button
              onClick={salvar}
              className="bg-green-600 hover:bg-green-500 px-5 py-3 rounded-2xl transition-all"
            >
              Salvar Alterações
            </button>
          ) : (
            <div className="px-5 py-3 rounded-2xl border border-slate-800 bg-slate-900/70 text-slate-400">
              Somente leitura
            </div>
          )}

              {podeExcluir && (
          <button
               onClick={() =>
               setShowDeleteModal(
               true
             )
            }
    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-5 py-3 rounded-2xl transition-all"
  >
    Excluir chamado
  </button>
)}
        </div>
      </div>

      {/* CONTEÚDO */}
<div className="space-y-6">

  {/* DADOS GERAIS */}
  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
    <h2 className="text-3xl font-bold mb-8">
      Informações do Chamado
    </h2>

     <div className="border-b border-slate-800 mb-8"></div>

{/* LINHA SUPERIOR */}
<div className="grid md:grid-cols-3 gap-12">

  {/* SOLICITANTE */}
  <div>
    <p className="text-slate-400 text-sm">
      Solicitante
    </p>

    <p className="mt-2 text-xl font-medium">
      {ticket.solicitante
        ?.split(" ")
        .slice(0, -1)
        .join(" ")}
    </p>

    <p className="text-slate-400 mt-1">
      {
        ticket.solicitante
          ?.split(" ")
          .slice(-1)[0]
      }
    </p>
  </div>

  {/* DATA */}
  <div>
    <p className="text-slate-400 text-sm">
      Data e Hora
    </p>

    <p className="mt-2 text-xl">
  {ticket.data_hora
    ? ticket.data_hora
        .split(" ")[0]
        .replace(/-/g, "/")
    : "-"}
</p>

<p className="text-xl">
  {ticket.data_hora
    ? ticket.data_hora
        .split(" ")[1]
        .substring(0, 5)
    : "-"}
</p>
  </div>

  {/* ANALISTA */}
 <div>
  <p className="text-slate-400 text-sm">
    Analista Responsável
  </p>

  {isAdmin ? (
    <select
      value={analista}
      onChange={(e) =>
        setAnalista(
          e.target.value
        )
      }
      className="mt-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white"
    >
      <option value="RENNAN">
        RENNAN
      </option>

      <option value="OMAR">
        OMAR
      </option>

      <option value="HELBERT">
        HELBERT
      </option>

            <option value="REINALDO">
        REINALDO
      </option>

      <option value="CAMILA">
        CAMILA
      </option>

      <option value="MAIK">
        MAIK
      </option>

      <option value="CESAR">
        CESAR
      </option>
    </select>
  ) : (
    <p className="mt-2 text-xl font-semibold text-blue-400">
      {analista}
    </p>
  )}
</div>

</div>

{/* LINHA INFERIOR */}
<div className="grid md:grid-cols-3 gap-12 mt-8">

  <div>
    <p className="text-slate-400 text-sm">
      Status
    </p>

    {isAdmin ? (
      <select
        value={status}
        onChange={(e) =>
          setStatus(e.target.value)
        }
        className="mt-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white"
      >
        <option value="Aberto">
          Aberto
        </option>

        <option value="Em andamento">
          Em andamento
        </option>

        <option value="Resolvido">
          Resolvido
        </option>

        <option value="Cancelado">
          Cancelado
        </option>
      </select>
    ) : (
      <div className="mt-2 inline-flex px-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white">
        {status}
      </div>
    )}
  </div>

  <div>
    <p className="text-slate-400 text-sm">
      Prioridade
    </p>
    <span
      className={`inline-flex mt-2 px-4 py-2 rounded-xl text-sm font-medium ${
        ticket.prioridade === "Alta"
          ? "bg-red-500/20 text-red-400"
          : ticket.prioridade === "Média"
          ? "bg-yellow-500/20 text-yellow-300"
          : "bg-blue-500/20 text-blue-400"
      }`}
    >
      {ticket.prioridade}
    </span>
  </div>

</div>
  </div>
</div>

  {/* DESCRIÇÃO */}
  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10">
    <h2 className="text-2xl font-bold mb-6 px-2">
       Descrição do Problema
    </h2>

    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3">
      <p className="whitespace-pre-wrap leading-relaxed">
        {ticket.descricao}
      </p>
    </div>
  </div>

   {/* ANEXO */} 
  {ticket.anexo && (
  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10">
    <h2 className="text-2xl font-bold mb-6">
      Anexo
    </h2>

    {ticket.anexo.startsWith(
      "data:image"
    ) ? (
      <img
        src={ticket.anexo}
        alt="Anexo"
        className="rounded-2xl border border-slate-800 max-h-[500px]"
      />
    ) : (
      <a
        href={ticket.anexo}
        target="_blank"
        className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-2xl inline-block"
      >
        Abrir Anexo
      </a>
    )}
  </div>
)}

 {/* SOLUÇÃO */}
<div className="bg-slate-900 border border-slate-800 rounded-3xl p-10">
  <h2 className="text-2xl font-bold mb-6 px-2">
    Solução Aplicada
  </h2>

  {isAdmin ? (
    <textarea
      value={solucao}
      onChange={(e) =>
        setSolucao(e.target.value)
      }
      placeholder="Descreva a solução aplicada..."
      className="w-full min-h-[180px] bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white resize-none outline-none focus:border-blue-500"
    />
  ) : (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
      <p className="whitespace-pre-wrap leading-relaxed">
        {solucao ||
          "Chamado ainda sem solução."}
      </p>
    </div>
  )}
</div>

      {/* MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-5">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-200">
            {/* TOPO */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-red-500/20 text-red-400 p-4 rounded-2xl">
                  <AlertTriangle
                    size={28}
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Confirmar exclusão
                  </h2>

                  <p className="text-slate-400 mt-1">
                    Essa ação não poderá ser desfeita.
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  setShowDeleteModal(
                    false
                  )
                }
                className="text-slate-500 hover:text-white transition-all"
              >
                <X size={22} />
              </button>
            </div>

            {/* TEXTO */}
            <div className="mt-8 bg-slate-950 border border-slate-800 rounded-2xl p-5">
              <p className="text-slate-300 leading-relaxed">
                Deseja realmente excluir este chamado?
              </p>

              <p className="text-red-400 text-sm mt-3">
                O chamado será removido permanentemente.
              </p>
            </div>

            {/* BOTÕES */}
            <div className="flex items-center justify-end gap-4 mt-8">
              <button
                onClick={() =>
                  setShowDeleteModal(
                    false
                  )
                }
                className="bg-slate-800 hover:bg-slate-700 px-5 py-3 rounded-2xl transition-all"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  handleDelete();

                  setShowDeleteModal(
                    false
                  );
                }}
                className="bg-red-500 hover:bg-red-400 text-white px-5 py-3 rounded-2xl transition-all"
              >
                Excluir chamado
              </button>
            </div>
          </div>
        </div>
      )}
     {/* MODAL SUCESSO */}
{showSuccessModal && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-5">
    <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-8">

      <div className="flex justify-center">
        <div className="bg-green-500/20 text-green-400 p-5 rounded-full">
          <CheckCircle2 size={36} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center mt-6">
        Chamado atualizado
      </h2>

      <p className="text-slate-400 text-center mt-3">
        As alterações foram salvas com sucesso.
      </p>

      <button
        onClick={() =>
          setShowSuccessModal(false)
        }
        className="w-full mt-8 bg-green-600 hover:bg-green-500 py-3 rounded-2xl transition-all"
      >
        OK
      </button>

    </div>
  </div>
)}
      
    </main>
  );
}