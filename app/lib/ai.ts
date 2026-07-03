export function analisarChamado(
  titulo: string,
  descricao: string
) {
  const texto =
    `${titulo} ${descricao}`.toLowerCase();

  let prioridade =
    "Média";

  let categoria =
    "Suporte Geral";

  let responsavel =
    "Equipe N1";

  let sugestao =
    "Análise inicial realizada pela IA.";

  /* ERP */
  if (
    texto.includes("erp") ||
    texto.includes("totvs") ||
    texto.includes("rm")
  ) {
    categoria = "ERP";

    responsavel =
      "Equipe ERP";

    sugestao =
      "Validar serviços do ERP e integrações.";

    prioridade = "Alta";
  }

  /* INTERNET */
  if (
    texto.includes("internet") ||
    texto.includes("wifi") ||
    texto.includes("vpn") ||
    texto.includes("rede")
  ) {
    categoria =
      "Infraestrutura";

    responsavel =
      "Equipe Redes";

    sugestao =
      "Verificar conectividade, DNS e firewall.";

    prioridade = "Alta";
  }

  /* EMAIL */
  if (
    texto.includes("email") ||
    texto.includes("outlook")
  ) {
    categoria =
      "Correio Eletrônico";

    responsavel =
      "Equipe Microsoft";

    sugestao =
      "Validar autenticação e caixa postal.";
  }

  /* IMPRESSORA */
  if (
    texto.includes("impressora") ||
    texto.includes("imprimir")
  ) {
    categoria =
      "Impressoras";

    responsavel =
      "Field Service";

    sugestao =
      "Validar spooler e conectividade USB/rede.";

    prioridade = "Baixa";
  }

  /* URGENTE */
  if (
    texto.includes("urgente") ||
    texto.includes("parado") ||
    texto.includes("critico") ||
    texto.includes("crítico")
  ) {
    prioridade =
      "Crítica";
  }

  return {
    prioridade,
    categoria,
    responsavel,
    sugestao,
  };
}

function classificarTema(ticket: Record<string, any>) {
  const texto = `${ticket.titulo || ""} ${ticket.descricao || ""}`.toLowerCase();

  if (
    texto.includes("erp") ||
    texto.includes("totvs") ||
    texto.includes("rm")
  ) {
    return "ERP/TOTVS";
  }

  if (
    texto.includes("senha") ||
    texto.includes("acesso") ||
    texto.includes("cadastro") ||
    texto.includes("permiss")
  ) {
    return "Acesso e permissões";
  }

  if (
    texto.includes("rede") ||
    texto.includes("wifi") ||
    texto.includes("vpn") ||
    texto.includes("internet")
  ) {
    return "Infraestrutura";
  }

  if (
    texto.includes("email") ||
    texto.includes("outlook")
  ) {
    return "Email";
  }

  if (
    texto.includes("impressora") ||
    texto.includes("imprimir")
  ) {
    return "Impressora";
  }

  if (
    texto.includes("mv") ||
    texto.includes("diario") ||
    texto.includes("diário") ||
    texto.includes("editema")
  ) {
    return "Plataformas MV/Diário";
  }

  return "Outros";
}

export function gerarRelatorioChamados(chamados: Array<Record<string, any>>) {
  const total = chamados.length;
  const resolvidos = chamados.filter((ticket) => ticket.status === "Resolvido").length;
  const emAndamento = chamados.filter((ticket) => ticket.status === "Em andamento" || ticket.status === "Em Andamento").length;
  const abertos = chamados.filter((ticket) => ticket.status === "Aberto").length;

  const analistas = chamados.reduce<Record<string, number>>((acc, ticket) => {
    const nome = ticket.analista_responsavel || "Sem analista";
    acc[nome] = (acc[nome] || 0) + 1;
    return acc;
  }, {});

  const rankingAnalistas = Object.entries(analistas).sort((a, b) => b[1] - a[1]);
  const topAnalista = rankingAnalistas[0]?.[0] || "Nenhum";
  const topAnalistaQuantidade = rankingAnalistas[0]?.[1] || 0;

  const problemas = chamados.reduce<Record<string, number>>((acc, ticket) => {
    const tema = classificarTema(ticket);
    acc[tema] = (acc[tema] || 0) + 1;
    return acc;
  }, {});

  const rankingProblemas = Object.entries(problemas).sort((a, b) => b[1] - a[1]);
  const problemaPrincipal = rankingProblemas[0]?.[0] || "Sem padrão";
  const topProblemas = rankingProblemas.slice(0, 3);

  const porMes = Array.from({ length: 12 }, (_, index) => {
    const mes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][index];
    const quantidade = chamados.filter((ticket) => {
      const data = new Date(ticket.data_hora || "");
      return Number.isNaN(data.getTime()) ? false : data.getMonth() === index;
    }).length;

    return { mes, quantidade };
  }).filter((item) => item.quantidade > 0);

  const resumo = `No período analisado, foram registrados ${total} chamados, ${resolvidos} resolvidos e ${emAndamento + abertos} ainda em acompanhamento. O analista com maior volume foi ${topAnalista} com ${topAnalistaQuantidade} tickets. O principal problema identificado foi ${problemaPrincipal}.`;

  return {
    total,
    resolvidos,
    emAndamento,
    abertos,
    topAnalista,
    topAnalistaQuantidade,
    problemaPrincipal,
    topProblemas,
    rankingAnalistas,
    porMes,
    resumo,
  };
}

export function gerarResumoComIA(relatorio: Record<string, any>) {
  const analistasTexto = (relatorio.rankingAnalistas || []).slice(0, 3).map((item: [string, number]) => `${item[0]} (${item[1]})`).join(", ") || "Nenhum";
  const problemasTexto = (relatorio.topProblemas || []).map((item: [string, number]) => `${item[0]} (${item[1]})`).join(", ") || "Nenhum";

  return `Relatório executivo do HelpDesk IA\n\nResumo: ${relatorio.resumo}\n\nMétricas principais: ${relatorio.total} chamados no total, ${relatorio.resolvidos} resolvidos, ${relatorio.emAndamento} em andamento e ${relatorio.abertos} abertos.\n\nAnalistas com maior carga: ${analistasTexto}.\n\nProblemas mais recorrentes: ${problemasTexto}.\n\nRecomendação: priorizar ações de prevenção e automação para os temas com maior recorrência, especialmente em acesso, infraestrutura e plataformas.`;
}
