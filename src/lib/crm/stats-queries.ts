import { createClient } from "@/lib/supabase/server";

export interface AnalyticsData {
  // 1. Análise de Vendas & Relatório Consolidado
  vendas: {
    receitaTotal: number;
    receitaMesAtual: number;
    ticketMedio: number;
    totalOportunidades: number;
    oportunidadesGanhas: number;
    oportunidadesPerdidas: number;
    taxaConversao: number;
    faturamentoProjetado: number;
  };
  // 2. ROI por Origem/Canal
  roiPorCanal: {
    canal: string;
    leads: number;
    ganhos: number;
    receita: number;
    ticketMedio: number;
    taxaConversao: number;
  }[];
  // 3. Relatório por Atividades
  atividades: {
    mensagensRecebidas: number;
    mensagensEnviadas: number;
    tarefasConcluidas: number;
    tarefasPendentes: number;
    sessoesAgendadas: number;
    sessoesRealizadas: number;
  };
  // 4. Vendas por Produtos
  vendasPorProduto: {
    produtoId: string;
    produtoNome: string;
    vendasQtd: number;
    faturamento: number;
    percentualTotal: number;
  }[];
  // 5. Metas
  metas: {
    metaFaturamentoMensal: number;
    faturamentoAtual: number;
    percentualAtingido: number;
    metaNovosPacientes: number;
    novosPacientesAtual: number;
    percentualPacientes: number;
  };
  // 6. Origens do Lead
  origensLead: {
    origem: string;
    quantidade: number;
    percentual: number;
  }[];
}

export async function getAnalyticsData(workspaceId: string): Promise<AnalyticsData> {
  const supabase = await createClient();

  const [
    { data: opportunities },
    { data: leads },
    { data: products },
    { data: tasks },
    { data: appointments },
    { data: messages },
  ] = await Promise.all([
    supabase
      .from("opportunities")
      .select("id, lead_id, product_id, status, potential_value, sold_value, closed_at, products (id, name)")
      .eq("workspace_id", workspaceId)
      .is("deleted_at", null),
    supabase
      .from("leads")
      .select("id, channel, potential_value, created_at, stage_id")
      .eq("workspace_id", workspaceId)
      .is("deleted_at", null),
    supabase
      .from("products")
      .select("id, name, default_price")
      .eq("workspace_id", workspaceId),
    supabase
      .from("tasks")
      .select("id, completed_at, due_at")
      .eq("workspace_id", workspaceId)
      .is("deleted_at", null),
    supabase
      .from("appointments")
      .select("id, status, starts_at")
      .eq("workspace_id", workspaceId),
    supabase
      .from("messages")
      .select("id, direction, status")
      .eq("workspace_id", workspaceId),
  ]);

  const opps = opportunities ?? [];
  const leadsList = leads ?? [];
  const prods = (products ?? []).filter((p) => !p.name.startsWith("[Placeholder]"));
  const tasksList = tasks ?? [];
  const appts = appointments ?? [];
  const msgs = messages ?? [];

  // Cálculos de Vendas
  const ganhas = opps.filter((o) => o.status === "won");
  const perdidas = opps.filter((o) => o.status === "lost");
  const receitaTotal = ganhas.reduce((sum, o) => sum + (Number(o.sold_value) || Number(o.potential_value) || 0), 0);
  const ticketMedio = ganhas.length > 0 ? Math.round(receitaTotal / ganhas.length) : 0;
  const taxaConversao = opps.length > 0 ? Math.round((ganhas.length / opps.length) * 100) : 0;

  // Faturamento projetado no pipeline (leads em aberto)
  const faturamentoProjetado = leadsList.reduce((sum, l) => sum + (Number(l.potential_value) || 0), 0);

  // Vendas por Produto
  const produtoMap = new Map<string, { nome: string; qtd: number; fat: number }>();
  for (const p of prods) {
    produtoMap.set(p.id, { nome: p.name, qtd: 0, fat: 0 });
  }

  for (const g of ganhas) {
    const pId = g.product_id ?? "outros";
    const valor = Number(g.sold_value) || Number(g.potential_value) || 0;
    const nome = (g.products as { name?: string } | null)?.name?.replace("[Placeholder] ", "") ?? "Consulta Avulsa";

    if (!produtoMap.has(pId)) {
      produtoMap.set(pId, { nome, qtd: 0, fat: 0 });
    }
    const cur = produtoMap.get(pId)!;
    cur.qtd += 1;
    cur.fat += valor;
  }

  const vendasPorProduto = Array.from(produtoMap.entries()).map(([id, info]) => ({
    produtoId: id,
    produtoNome: info.nome,
    vendasQtd: info.qtd,
    faturamento: info.fat,
    percentualTotal: receitaTotal > 0 ? Math.round((info.fat / receitaTotal) * 100) : (info.fat > 0 ? 100 : 0),
  })).sort((a, b) => b.faturamento - a.faturamento);

  // Origens do Lead
  const canalCount: Record<string, number> = {};
  for (const l of leadsList) {
    const c = l.channel ?? "whatsapp";
    canalCount[c] = (canalCount[c] ?? 0) + 1;
  }

  const origensLead = Object.entries(canalCount).map(([origem, qtd]) => ({
    origem,
    quantidade: qtd,
    percentual: leadsList.length > 0 ? Math.round((qtd / leadsList.length) * 100) : 0,
  })).sort((a, b) => b.quantidade - a.quantidade);

  // ROI / Desempenho por Canal
  const canalRoiMap: Record<string, { leads: number; ganhos: number; receita: number }> = {};
  for (const l of leadsList) {
    const c = l.channel ?? "whatsapp";
    if (!canalRoiMap[c]) canalRoiMap[c] = { leads: 0, ganhos: 0, receita: 0 };
    canalRoiMap[c].leads += 1;
  }

  // Associa receita por canal
  const leadChannelMap = new Map(leadsList.map((l) => [l.id, l.channel ?? "whatsapp"]));
  for (const g of ganhas) {
    const c = leadChannelMap.get(g.lead_id) ?? "whatsapp";
    if (!canalRoiMap[c]) canalRoiMap[c] = { leads: 0, ganhos: 0, receita: 0 };
    canalRoiMap[c].ganhos += 1;
    canalRoiMap[c].receita += (Number(g.sold_value) || Number(g.potential_value) || 0);
  }

  const roiPorCanal = Object.entries(canalRoiMap).map(([canal, data]) => ({
    canal,
    leads: data.leads,
    ganhos: data.ganhos,
    receita: data.receita,
    ticketMedio: data.ganhos > 0 ? Math.round(data.receita / data.ganhos) : 0,
    taxaConversao: data.leads > 0 ? Math.round((data.ganhos / data.leads) * 100) : 0,
  }));

  // Atividades
  const mensagensRecebidas = msgs.filter((m) => m.direction === "inbound").length;
  const mensagensEnviadas = msgs.filter((m) => m.direction === "outbound").length;
  const tarefasConcluidas = tasksList.filter((t) => Boolean(t.completed_at)).length;
  const tarefasPendentes = tasksList.filter((t) => !t.completed_at).length;
  // Só o que não foi cancelado conta como agendado.
  const sessoesAgendadas = appts.filter(
    (a) => a.status !== "cancelled",
  ).length;
  // Realizada é a que foi marcada como realizada. Data no passado não basta:
  // no-show e cancelamento também ficam para trás no calendário, e contá-los
  // aqui inflava o número de atendimentos.
  const sessoesRealizadas = appts.filter((a) => a.status === "completed").length;

  // Recorte do mês corrente. A meta é mensal: comparada com o histórico
  // inteiro, ela bateria 100% em algum momento e nunca mais sairia de lá.
  const inicioDoMes = new Date();
  inicioDoMes.setDate(1);
  inicioDoMes.setHours(0, 0, 0, 0);

  const ganhasNoMes = ganhas.filter(
    (o) => o.closed_at && new Date(o.closed_at) >= inicioDoMes,
  );
  const receitaMesAtual = ganhasNoMes.reduce(
    (sum, o) => sum + (Number(o.sold_value) || Number(o.potential_value) || 0),
    0,
  );

  // Metas (Padrão: Meta de R$ 30.000 / mês e 15 novos pacientes)
  const metaFaturamentoMensal = 30000;
  const metaNovosPacientes = 15;
  const percentualAtingido = Math.min(100, Math.round((receitaMesAtual / metaFaturamentoMensal) * 100));
  const percentualPacientes = Math.min(100, Math.round((ganhasNoMes.length / metaNovosPacientes) * 100));

  return {
    vendas: {
      receitaTotal,
      receitaMesAtual,
      ticketMedio,
      totalOportunidades: opps.length,
      oportunidadesGanhas: ganhas.length,
      oportunidadesPerdidas: perdidas.length,
      taxaConversao,
      faturamentoProjetado,
    },
    roiPorCanal,
    atividades: {
      mensagensRecebidas,
      mensagensEnviadas,
      tarefasConcluidas,
      tarefasPendentes,
      sessoesAgendadas,
      sessoesRealizadas,
    },
    vendasPorProduto,
    metas: {
      metaFaturamentoMensal,
      faturamentoAtual: receitaMesAtual,
      percentualAtingido,
      metaNovosPacientes,
      novosPacientesAtual: ganhasNoMes.length,
      percentualPacientes,
    },
    origensLead,
  };
}
