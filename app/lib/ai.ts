type Ticket = {
  titulo?: string;
  descricao?: string;
  status?: string;
  analista_responsavel?: string;
  data_hora?: string;
};

type Relatorio = {
  total: number;
  resolvidos: number;
  emAndamento: number;
  abertos: number;
  topAnalista: string;
  topAnalistaQuantidade: number;
  problemaPrincipal: string;
  topProblemas: [string, number][];
  rankingAnalistas: [string, number][];
  porMes: Array<{ mes: string; quantidade: number }>;
  resumo: string;
};

function containsAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

export function analisarChamado(
  titulo: string,
  descricao: string
) {
  const texto = `${titulo} ${descricao}`.toLowerCase();

  let prioridade = "Média";
  let categoria = "Suporte Geral";
  let responsavel = "Equipe N1";
  let sugestao = "Análise inicial realizada pela IA.";

  if (
    containsAny(texto, [
      "senha",
      "acesso",
      "login",
      "autentica",
      "credencial",
      "cadastro",
      "permiss",
    ])
  ) {
    categoria = "Acesso e permissões";
    responsavel = "Equipe de Acesso";
    sugestao = "Validar credenciais, permissões e autenticação.";
    prioridade = "Alta";
  } else if (
    containsAny(texto, ["internet", "wifi", "vpn", "rede", "conexão", "conexao", "dns", "firewall"])
  ) {
    categoria = "Infraestrutura";
    responsavel = "Equipe Redes";
    sugestao = "Verificar conectividade, DNS e firewall.";
    prioridade = "Alta";
  } else if (containsAny(texto, ["email", "outlook", "gmail", "correio", "correio eletrônico", "correio eletronico"])) {
    categoria = "Correio Eletrônico";
    responsavel = "Equipe Microsoft";
    sugestao = "Validar autenticação e caixa postal.";
  } else if (containsAny(texto, ["impressora", "imprimir", "scanner", "cópia", "copiar"])) {
    categoria = "Impressoras";
    responsavel = "Field Service";
    sugestao = "Validar spooler e conectividade USB/rede.";
    prioridade = "Baixa";
  } else if (containsAny(texto, ["erp", "totvs", "rm"])) {
    categoria = "ERP";
    responsavel = "Equipe ERP";
    sugestao = "Validar serviços do ERP e integrações.";
    prioridade = "Alta";
  }

  if (
    containsAny(texto, ["urgente", "parado", "critico", "crítico"])
  ) {
    prioridade = "Crítica";
  }

  return {
    prioridade,
    categoria,
    responsavel,
    sugestao,
  };
}

function classificarTema(ticket: Ticket) {
  const texto = `${ticket.titulo || ""} ${ticket.descricao || ""}`.toLowerCase();

  if (
    containsAny(texto, ["senha", "acesso", "login", "permiss", "cadastro", "autentica", "credencial"])
  ) {
    return "Acesso e permissões";
  }

  if (
    containsAny(texto, ["enturma", "turma", "mudar", "mudança", "transfer", "alocar", "salas cheias", "lotação", "lotacao"]) &&
    containsAny(texto, ["totvs", "mv", "diário", "diario"])
  ) {
    return "Enturmação / TOTVS";
  }

  if (
    containsAny(texto, ["relatório", "relatorio", "listagem", "exportar"]) &&
    containsAny(texto, ["totvs", "erp", "rm"])
  ) {
    return "Relatórios TOTVS";
  }

  if (
    containsAny(texto, ["internet", "wifi", "vpn", "rede", "conexão", "conexao", "dns", "firewall"])
  ) {
    return "Infraestrutura";
  }

  if (
    containsAny(texto, ["email", "outlook", "gmail", "correio", "correio eletrônico", "correio eletronico"])
  ) {
    return "Email";
  }

  if (
    containsAny(texto, ["impressora", "imprimir", "scanner", "cópia", "copiar"])
  ) {
    return "Impressoras";
  }

  if (
    containsAny(texto, ["mv", "diario", "diário", "editema", "edu", "plataforma", "plataformas"])
  ) {
    return "Plataformas MV/Diário";
  }

  if (
    containsAny(texto, ["erp", "totvs", "rm"])
  ) {
    return "ERP/TOTVS";
  }

  return "Outros";
}

export function gerarRelatorioChamados(chamados: Ticket[]) {
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
  if (!ticket.data_hora) return false;

  const mes = Number(
    ticket.data_hora.split(" ")[0].split("-")[1]
  );

  return mes === index + 1;
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

export function gerarResumoComIA(relatorio: Relatorio) {
  const analistasTexto = (relatorio.rankingAnalistas || []).slice(0, 3).map((item: [string, number]) => `${item[0]} (${item[1]})`).join(", ") || "Nenhum";
  const problemasTexto = (relatorio.topProblemas || []).map((item: [string, number]) => `${item[0]} (${item[1]})`).join(", ") || "Nenhum";

  return `Relatório executivo do HelpDesk IA\n\nResumo: ${relatorio.resumo}\n\nMétricas principais: ${relatorio.total} chamados no total, ${relatorio.resolvidos} resolvidos, ${relatorio.emAndamento} em andamento e ${relatorio.abertos} abertos.\n\nAnalistas com maior carga: ${analistasTexto}.\n\nProblemas mais recorrentes: ${problemasTexto}.\n\nRecomendação: priorizar ações de prevenção e automação para os temas com maior recorrência, especialmente em acesso, infraestrutura e plataformas.`;
}
