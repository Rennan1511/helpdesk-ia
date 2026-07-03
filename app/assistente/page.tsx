"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bot,
  Send,
 User,
} from "lucide-react";

export default function AssistentePage() {
  const [mensagem, setMensagem] =
    useState("");

  const [chat, setChat] =
    useState<any[]>([]);

  const [fase, setFase] =
  useState<
    | "problema"
    | "descricao"
    | "dados"
    | "anexo"
    | "finalizado"
  >("problema");

  const [problema, setProblema] =
    useState("");

  const [
    descricaoDetalhada,
    setDescricaoDetalhada,
  ] = useState("");

  const [anexo, setAnexo] =
  useState("");

  const messagesEndRef =
    useRef<any>(null);

  /* MENSAGEM INICIAL */
  useEffect(() => {
    ia(
      "Olá 👋\n\nSou o Assistente IA do HelpDesk.\n\nMe explique resumidamente o problema que está acontecendo."
    );
  }, []);

  /* AUTO SCROLL */
  useEffect(() => {
    scrollBottom();
  }, [chat]);

  function scrollBottom() {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView(
        {
          behavior:
            "smooth",
        }
      );
    }, 100);
  }

  /* IA ESCREVENDO */
  async function ia(
    texto: string
  ) {
    const novaMensagem = {
      tipo: "ia",
      texto: "",
    };

    setChat(
      (prev: any) => [
        ...prev,
        novaMensagem,
      ]
    );

    for (
      let i = 0;
      i <= texto.length;
      i++
    ) {
      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            15
          )
      );

      setChat(
        (
          prev: any[]
        ) => {
          const novo =
            [...prev];

          novo[
            novo.length -
              1
          ] = {
            tipo: "ia",
            texto:
              texto.slice(
                0,
                i
              ),
          };

          return novo;
        }
      );
    }
  }

  /* USER */
  function usuario(
    texto: string
  ) {
    setChat(
      (prev: any) => [
        ...prev,
        {
          tipo: "user",
          texto,
        },
      ]
    );
  }

  /* PROTOCOLO */
  function gerarProtocolo() {
    const numero =
      Math.floor(
        Math.random() *
          9000
      ) + 1000;

    return `2026-${numero}`;
  }

  /* PRIORIDADE */
  function detectarPrioridade(
    texto: string
  ) {
    const lower =
      texto.toLowerCase();

    if (
      lower.includes(
        "internet caiu"
      ) ||
      lower.includes(
        "servidor"
      ) ||
      lower.includes(
        "urgente"
      ) ||
      lower.includes(
        "não funciona"
      ) ||
      lower.includes(
        "escola inteira"
      )
    ) {
      return "Alta";
    }

    if (
      lower.includes(
        "erro"
      ) ||
      lower.includes(
        "acesso"
      ) ||
      lower.includes(
        "lento"
      )
    ) {
      return "Média";
    }

    return "Baixa";
  }

  /* CATEGORIA */
  function detectarCategoria(
    texto: string
  ) {
    const lower =
      texto.toLowerCase();

    if (
      lower.includes(
        "internet"
      ) ||
      lower.includes(
        "wifi"
      ) ||
      lower.includes(
        "rede"
      )
    ) {
      return "Infraestrutura";
    }

    if (
      lower.includes(
        "diário"
      ) ||
      lower.includes(
        "acesso"
      ) ||
      lower.includes(
        "sistema"
      ) ||
      lower.includes(
        "mv"
      )
    ) {
      return "Sistema";
    }

    if (
      lower.includes(
        "impressora"
      )
    ) {
      return "Hardware";
    }

    return "Geral";
  }

  /* TITULO RESUMIDO */
  function gerarTitulo() {
    if (
      problema
        .toLowerCase()
        .includes(
          "acesso ao mv"
        ) ||
      problema
        .toLowerCase()
        .includes(
          "sem acesso ao mv"
        )
    ) {
      return "Sem acesso ao MV";
    }

    if (
      problema
        .toLowerCase()
        .includes(
          "internet"
        )
    ) {
      return "Problema de internet";
    }

    if (
      problema
        .toLowerCase()
        .includes(
          "diário"
        )
    ) {
      return "Acesso ao Diário";
    }

    if (
      problema.length > 40
    ) {
      return (
        problema.slice(
          0,
          40
        ) + "..."
      );
    }

    return problema;
  }

  /* CRIAR CHAMADO */
  async function criarChamado(
    dadosTexto: string
  ) {
    const chamados =
      JSON.parse(
        localStorage.getItem(
          "chamados"
        ) || "[]"
      );

    const novoChamado = {
  id: gerarProtocolo(),

  data_hora:
    new Date().toISOString(),

  titulo:
    gerarTitulo(),

  solicitante:
    localStorage.getItem(
      "userEmail"
    ) || "Usuário",

  descricao:
    descricaoDetalhada,

  status: "Aberto",

  solucao: "",

  analista_responsavel:
    "HelpDesk IA",

  prioridade:
    detectarPrioridade(
      problema
    ),

  categoria:
  detectarCategoria(
    problema
  ),

anexo,
};

    chamados.push(
      novoChamado
    );

    localStorage.setItem(
      "chamados",
      JSON.stringify(
        chamados
      )
    );

    await ia(
      `Perfeito 🚀\n\nSeu chamado foi aberto com sucesso.\n\n🎫 Protocolo: ${novoChamado.id}\n📌 Prioridade: ${novoChamado.prioridade}\n🧠 Categoria: ${novoChamado.categoria}\n\nSeu atendimento foi encaminhado para análise técnica.`
    );

    setFase(
      "finalizado"
    );
  }

  /* ENVIAR */
  async function enviarMensagem() {
    if (!mensagem.trim())
      return;

    const textoUsuario =
      mensagem;

    usuario(
      textoUsuario
    );

    setMensagem("");

    /* PROBLEMA */
    if (
      fase ===
      "problema"
    ) {
      setProblema(
        textoUsuario
      );

      await ia(
        "Entendi 😊\n\nPara ajudar nossa equipe técnica, descreva melhor o problema:\n\n• O que acontece?\n• Qual erro aparece?\n• Desde quando começou?\n• Outras pessoas também possuem o problema?"
      );

      setFase(
        "descricao"
      );
    }

    /* DESCRIÇÃO */
    else if (
      fase ===
      "descricao"
    ) {
      setDescricaoDetalhada(
        textoUsuario
      );

      await ia(
        "Perfeito 👍\n\nAgora envie:\n\nNome:\nFunção:\nSérie/Turma:\nDisciplina:"
      );

      setFase(
        "dados"
      );
    }

    /* DADOS */
    else if (
      fase === "dados"
    ) {
      const texto =
        textoUsuario.toLowerCase();

      const possuiNome =
        texto.includes(
          "nome:"
        );

      const possuiFuncao =
        texto.includes(
          "função:"
        ) ||
        texto.includes(
          "funcao:"
        );

      const possuiSerie =
        texto.includes(
          "série:"
        ) ||
        texto.includes(
          "serie:"
        ) ||
        texto.includes(
          "série/turma:"
        ) ||
        texto.includes(
          "serie/turma:"
        );

      const possuiDisciplina =
        texto.includes(
          "disciplina:"
        );

      if (
        !possuiNome ||
        !possuiFuncao ||
        !possuiSerie ||
        !possuiDisciplina
      ) {
        await ia(
          "⚠️ Para abrir o chamado preciso das informações completas.\n\nEnvie exatamente neste formato:\n\nNome:\nFunção:\nSérie/Turma:\nDisciplina:"
        );

        return;
      }

     await ia(
  "Se desejar, envie agora uma imagem ou PDF do problema.\n\nDepois clique em Enviar."
);

setFase("anexo");
    }
else if (
  fase === "anexo"
) {
  await criarChamado(
    textoUsuario
  );
}

  }
  

  return (
    <main className="h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col">
      {/* HEADER */}
      <div className="border-b border-slate-800 p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
          <Bot className="w-7 h-7" />
        </div>

        <div>
          <h1 className="text-3xl font-bold">
            Assistente IA
          </h1>

          <p className="text-green-400 mt-1">
            Online
          </p>
        </div>
      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {chat.map(
          (
            item,
            index
          ) => (
            <div
              key={index}
              className={`flex ${
                item.tipo ===
                "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-3xl px-6 py-5 ${
                  item.tipo ===
                  "user"
                    ? "bg-blue-600"
                    : "surface-panel"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {item.tipo ===
                  "user" ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5 text-blue-400" />
                  )}

                  <p className="font-semibold">
                    {item.tipo ===
                    "user"
                      ? "Você"
                      : "IA"}
                  </p>
                </div>

                <p className="whitespace-pre-line leading-8 text-slate-200">
                  {item.texto}

                  {item.tipo ===
                    "ia" &&
                    item.texto
                      .length >
                      0 && (
                      <span className="animate-pulse">
                        ▋
                      </span>
                    )}
                </p>
              </div>
            </div>
          )
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="border-t border-slate-800 p-5">

        <input
  type="file"
  accept="image/*,.pdf"
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
  className="mb-4 text-sm text-slate-400"
/>
        <div className="flex items-end gap-4 bg-slate-900 border border-slate-800 rounded-3xl px-5 py-4">
          <textarea
            value={mensagem}
            onChange={(e) =>
              setMensagem(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key ===
                  "Enter" &&
                !e.shiftKey
              ) {
                e.preventDefault();

                enviarMensagem();
              }
            }}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-transparent outline-none resize-none min-h-[40px] max-h-[180px]"
          />
          
          {anexo && (
  <p className="text-green-400 text-sm mb-3">
    ✅ Arquivo anexado
  </p>
)}
          <button
            onClick={
              enviarMensagem
            }
            className="bg-blue-600 hover:bg-blue-500 transition-all w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>

        <p className="text-slate-500 text-sm mt-3 px-2">
          Enter para enviar • Shift + Enter para quebrar linha
        </p>
      </div>
    </main>
  );
}