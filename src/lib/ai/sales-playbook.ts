/**
 * PLAYBOOK CIENTÍFICO E ÉTICO DE VENDAS & QUEBRA DE OBJEÇÕES DO ORDO CRM
 * Baseado em metodologias avançadas de Vendas Consultivas (NEPQ, SPIN Selling, Harvard Negotiation Project)
 * adaptadas para Psicologia Clínica, Psiquiatria, Terapias, Supervisões e Saúde Mental.
 */

export interface ObjectionFramework {
  objection: string;
  triggerKeywords: string[];
  diagnosis: string;
  strategy: string;
  scriptTherapist: string;
  scriptSecretary: string;
  clinicalRationale: string;
}

export const SALES_OBJECTIONS_PLAYBOOK: ObjectionFramework[] = [
  // ---------------------------------------------------------------------------
  // 1. OBJEÇÃO DE PREÇO / INVESTIMENTO
  // ---------------------------------------------------------------------------
  {
    objection: "Achei caro / Não tenho dinheiro agora / Está fora do meu orçamento",
    triggerKeywords: ["caro", "dinheiro", "orçamento", "valor alto", "não posso pagar", "sem grana", "pesado"],
    diagnosis: "O paciente não percebeu a relação custo x alívio da dor, ou sente insegurança sobre a continuidade financeira.",
    strategy: "Validar a preocupação sem desvalorizar o serviço. Reformular a percepção de custo, oferecer modalidade mensal pré-paga com benefício ou recibo para reembolso.",
    scriptSecretary: `"Olá, [Nome]! Compreendo perfeitamente que o planejamento financeiro é uma prioridade. 🌿

Nosso acompanhamento é estruturado de forma muito personalizada para que cada sessão traga ferramentas práticas de alívio e evolução.

Além disso:
1. Emitimos recibos completos com todos os dados para que você possa solicitar o **reembolso de 60% a 100%** pelo aplicativo do seu convênio de saúde.
2. Temos a opção do **pacote mensal**, que traz condições especiais e já garante seu horário fixo na semana.

Podemos verificar como fica a prévia de reembolso do seu plano ou prefere conhecer as opções de pacotes?"`,
    scriptTherapist: `"Compreendo sua colocação, [Nome]. Cuidar da saúde mental é um investimento significativo em você mesmo(a). Quando adiamos o cuidado com [queixa/dor], o custo emocional e na rotina costuma ser muito mais alto. Vamos avaliar juntos a periodicidade que melhor se adapta à sua realidade atual?"`,
    clinicalRationale: "Acolhimento da realidade financeira sem gerar culpa, apresentando caminhos viáveis (reembolso e pacotes).",
  },

  // ---------------------------------------------------------------------------
  // 2. OBJEÇÃO DE CONVÊNIO / PLANO DE SAÚDE
  // ---------------------------------------------------------------------------
  {
    objection: "Vocês atendem pelo meu plano / Só faço por convênio",
    triggerKeywords: ["convênio", "convenio", "plano", "unimed", "bradesco", "amil", "sulamerica", "sul américa", "notredame", "porto seguro"],
    diagnosis: "Hábito de utilização de rede credenciada e desconhecimento da sistemática de Reembolso Livre Escolha.",
    strategy: "Explicar o diferencial do atendimento particular (50 min dedicados, sem fila, sigilo absoluto) e instruir sobre a facilidade do reembolso pelo app do plano.",
    scriptSecretary: `"Olá, [Nome]! 

Nossos atendimentos são realizados na modalidade **particular**, o que nos permite dedicar 50 minutos exclusivos, sem pressa e com um plano terapêutico 100% individualizado para o seu caso.

Contudo, **você pode utilizar o seu plano através do Reembolso!** 📄
Nós fornecemos o recibo e relatório com todas as especificações que o [Nome do Convênio] exige, permitindo que você solicite a restituição do valor diretamente pelo aplicativo do plano, de forma simples e rápida.

Gostaria de agendar sua primeira consulta e emitirmos o recibo para você solicitar a restituição?"`,
    scriptTherapist: `"Optamos pelo atendimento particular para garantir o tempo e a profundidade necessários para o seu tratamento, mas forneço toda a documentação necessária para que você receba o reembolso pelo seu plano de saúde."`,
    clinicalRationale: "Valorização da qualidade e do tempo clínico, desmistificando o processo de reembolso.",
  },

  // ---------------------------------------------------------------------------
  // 3. OBJEÇÃO DE TERAPIA ONLINE VS PRESENCIAL
  // ---------------------------------------------------------------------------
  {
    objection: "Prefiro presencial / Não sei se online funciona bem",
    triggerKeywords: ["online", "presencial", "funciona", "pela internet", "vídeo", "video", "distância", "distancia"],
    diagnosis: "Insegurança quanto à conexão humana ou receio de que a tela comprometa a eficácia do tratamento.",
    strategy: "Citar a regulamentação do CFP, evidências científicas de eficácia equivalente, benefícios de conforto/tempo e propor uma primeira sessão experimental.",
    scriptSecretary: `"Olá, [Nome]! É super natural ter essa dúvida se você nunca fez atendimento online antes. ✨

O atendimento online é 100% regulamentado pelo Conselho Federal de Psicologia e estudos científicos comprovam que a **eficácia e o vínculo terapêutico são exatamente iguais aos do presencial**.

Além disso, você tem o conforto de ser atendido(a) no seu espaço seguro, sem perder tempo no trânsito ou estacionamento.

Que tal experimentarmos uma primeira sessão pelo Google Meet para você vivenciar a experiência na prática sem nenhum compromisso de longo prazo?"`,
    scriptTherapist: `"A psicoterapia online oferece a mesma profundidade e sigilo do consultório presencial. Muitos pacientes que tinham essa mesma dúvida hoje preferem o formato online pela comodidade e acolhimento no próprio lar."`,
    clinicalRationale: "Redução do atrito de início convidando a uma experiência prática sem compromisso definitivo.",
  },

  // ---------------------------------------------------------------------------
  // 4. OBJEÇÃO DE TEMPO / ROTINA CORRIDA
  // ---------------------------------------------------------------------------
  {
    objection: "Estou sem tempo agora / Minha rotina é muito corrida",
    triggerKeywords: ["sem tempo", "correria", "corrido", "trabalho muito", "sem horário", "sem horários", "não consigo"],
    diagnosis: "Sensação de sobrecarga e adiamento do autocuidado.",
    strategy: "Demonstrar que a terapia online devolve clareza e produtividade; oferecer flexibilidade de horários (início da manhã, almoço ou noturno).",
    scriptSecretary: `"Olá, [Nome]! Sei exatamente como a rotina pode ser desafiadora. 🌿

Justamente nos momentos em que estamos mais sobrecarregados é que uma pausa de 50 minutos por semana se torna essencial para recarregar as energias, organizar a mente e evitar o esgotamento.

Para facilitar sua rotina, temos opções de horários flexíveis no início da manhã, no horário de almoço ou no período da noite via Google Meet.

Qual período seria mais confortável para encaixarmos sua sessão esta semana?"`,
    scriptTherapist: `"Quando nossa rotina está pesada, tendemos a adiar o cuidado com nós mesmos. A sessão semanal de 50 minutos funciona como uma âncora para que você consiga lidar com as demandas sem se esgotar."`,
    clinicalRationale: "Reposicionamento da terapia como solução para a sobrecarga e não como mais uma tarefa cansativa.",
  },

  // ---------------------------------------------------------------------------
  // 5. OBJEÇÃO DE INDECISÃO / "VOU PENSAR E DEPOIS FALO"
  // ---------------------------------------------------------------------------
  {
    objection: "Vou pensar e te aviso / Deixa para depois",
    triggerKeywords: ["vou pensar", "depois te aviso", "depois vejo", "deixa para depois", "qualquer coisa chamo", "vou ver"],
    diagnosis: "Dúvida oculta não verbalizada ou medo de dar o primeiro passo.",
    strategy: "Acolher com respeito, abrir espaço seguro para dúvidas e oferecer pré-reserva temporária de horário para evitar que a vaga seja perdida.",
    scriptSecretary: `"Olá, [Nome]! Claro, pensar com calma é fundamental. 🌸

Para eu poder te ajudar e não te incomodar com mensagens desnecessárias, ficou alguma dúvida sobre o formato das sessões, horários ou valores que eu possa esclarecer agora?

Tenho uma vaga disponível para **[Dia, às Horário]**. Se quiser, posso deixar pré-reservada para você até o final da tarde para você não perder essa opção. O que acha?"`,
    scriptTherapist: `"Fique muito à vontade para refletir, [Nome]. Dar o primeiro passo em direção ao cuidado emocional é uma decisão importante. Se surgir qualquer dúvida sobre o processo, estou à total disposição."`,
    clinicalRationale: "Abertura para descobrir a real objeção oculta sem pressionar de forma agressiva.",
  },

  // ---------------------------------------------------------------------------
  // 6. OBJEÇÃO DE CONSULTAR TERCEIROS ("VOU VER COM MEU MARIDO/ESPOSA")
  // ---------------------------------------------------------------------------
  {
    objection: "Vou conversar com meu esposo(a) / família",
    triggerKeywords: ["marido", "esposo", "esposa", "mulher", "mãe", "pai", "família", "conversar com"],
    diagnosis: "Necessidade de validação familiar ou alinhamento financeiro conjunto.",
    strategy: "Validar a decisão compartilhada e munir a pessoa com os argumentos certos (recibo de reembolso, horários, benefícios).",
    scriptSecretary: `"Perfeito, [Nome]! Acho excelente conversar com ele(a) para vocês alinharem juntos. 🤝

Para te ajudar a levar as melhores informações, lembre-se de comentar sobre a possibilidade de **reembolso pelo plano de saúde** e a flexibilidade das sessões online.

Se quiser, posso te enviar um resumo em PDF com todas as informações para facilitar a conversa de vocês. Posso te enviar por aqui?"`,
    scriptTherapist: `"Excelente, [Nome]. O apoio de quem está próximo é muito valioso. Fico à disposição se ele(a) tiver qualquer dúvida sobre o acompanhamento."`,
    clinicalRationale: "Empoderamento do paciente com material e dados claros para a tomada de decisão conjunta.",
  },

  // ---------------------------------------------------------------------------
  // 7. OBJEÇÃO DE SUPERVISÃO CLÍNICA / MENTORIA B2B
  // ---------------------------------------------------------------------------
  {
    objection: "Supervisão Clínica: Não sei se é o momento de investir em supervisão",
    triggerKeywords: ["supervisão", "supervisao", "caso clínico", "insegurança clínica", "supervisionar"],
    diagnosis: "Insegurança financeira ou receio de julgamento do trabalho por outro profissional.",
    strategy: "Demonstrar o retorno prático da supervisão: segurança nos manejos, retenção de pacientes por mais tempo e aumento do valor da própria hora clínica.",
    scriptSecretary: `"Olá, [Nome]! A supervisão clínica é um dos pilares mais transformadores na carreira de um psicólogo.

Além de trazer segurança técnica imediata para os casos mais complexos, terapeutas que fazem supervisão regular aumentam em mais de **4x o tempo de retenção dos seus pacientes** e conseguem valorizar seus próprios honorários com muito mais confiança.

Podemos agendar uma supervisão inicial avulsa para você levar o seu caso mais desafiador e sentir o impacto na prática?"`,
    scriptTherapist: `"A supervisão é um espaço protegido e acolhedor de troca técnica. É onde refinamos hipóteses e encontramos caminhos seguros para os manejos difíceis, sem julgamento."`,
    clinicalRationale: "Posicionamento da supervisão como investimento de alto retorno na carreira profissional.",
  },
];

/**
 * Retorna as melhores estratégias e scripts de quebra de objeção para um determinado texto ou histórico.
 */
export function matchObjection(userText: string): ObjectionFramework | null {
  const lower = userText.toLowerCase();
  for (const item of SALES_OBJECTIONS_PLAYBOOK) {
    if (item.triggerKeywords.some((kw) => lower.includes(kw))) {
      return item;
    }
  }
  return null;
}
