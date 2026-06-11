const STORAGE_KEYS = {
  wakeWord: "c152-wake-word",
  patternAltitude: "c152-pattern-altitude",
};

const defaultState = {
  phaseId: "preflight",
  variantId: null,
  wakeWord: "Aurora",
  patternAltitude: "1.000 ft AGL",
  transcript: "",
  voiceListening: false,
  voiceAvailable: false,
  recognizedLabel: "Voz pronta",
};

const flightOrder = [
  { id: "preflight", label: "Pré-voo" },
  { id: "start", label: "Partida" },
  { id: "taxi", label: "Táxi" },
  { id: "runup", label: "Cheque de motor" },
  { id: "takeoff", label: "Decolagem" },
  { id: "climb", label: "Subida" },
  { id: "cruise", label: "Cruzeiro" },
  { id: "descent", label: "Descida" },
  { id: "circuit", label: "Circuito" },
  { id: "goaround", label: "Arremetida" },
  { id: "afterlanding", label: "Pós-pouso" },
];

const profile = {
  name: "Cessna 152 / SOP REV 1.3",
  note: "Os valores abaixo vieram do SOP anexado. Itens não explicitados no SOP ficam marcados como referência local.",
  baseline: [
    { label: "Mínimo operacional", value: "2280 RPM" },
    { label: "Velocidade mínima", value: "60 kt" },
    { label: "Temperatura de óleo", value: "100°F" },
  ],
  phases: {
    preflight: {
      label: "Pré-voo",
      summary: "Inspeção externa, segurança, combustível e briefing antes da missão.",
      cue: "Executar a inspeção externa e confirmar combustível, peso e documentação.",
      radio: "Briefing pré-voo, meteorologia, rota e peso/balanceamento.",
      metrics: [
        { label: "Combustível local", value: "13 US gal", meta: "Mínimo para voo local" },
        { label: "Combustível navegação", value: "Tanque cheio", meta: "Antes de sair em rota" },
        { label: "Peso e balanceamento", value: "Conferir", meta: "Antes do embarque" },
        { label: "Checklist", value: "Before Start", meta: "Cabine e documentação" },
      ],
      steps: [
        "Fazer inspeção externa e interna pela ordem do checklist.",
        "Checar livros de bordo, documentação e itens de segurança da aeronave.",
        "Voo local: mínimo de 13 US gal; navegação: tanque cheio.",
        "Fechar o briefing com peso, balanceamento, meteorologia e planejamento do voo.",
      ],
      chips: [],
      isDanger: false,
    },
    start: {
      label: "Partida",
      summary: "Sequência de acionamento com variação por condição do motor.",
      cue: "Executar Cleared for Start e estabilizar 1000 RPM após o acionamento.",
      radio: "Mixture, throttle, starter e After Start Checklist.",
      metricsByVariant: {
        cold: [
          { label: "Estado", value: "Partida fria", meta: "Mixture rica" },
          { label: "Throttle", value: "3 injeções", meta: "Abrir 1/2 polegada" },
          { label: "RPM pós-start", value: "1000 RPM", meta: "Estabilizar antes de taxiar" },
          { label: "Checklist", value: "After Start", meta: "Após a partida" },
        ],
        warm: [
          { label: "Estado", value: "Partida quente", meta: "Mixture rica" },
          { label: "Throttle", value: "1 injeção", meta: "Abrir 1/2 polegada" },
          { label: "RPM pós-start", value: "1000 RPM", meta: "Estabilizar antes de taxiar" },
          { label: "Checklist", value: "After Start", meta: "Após a partida" },
        ],
        flooded: [
          { label: "Estado", value: "Partida afogada", meta: "SOP de recuperação" },
          { label: "Throttle", value: "Full open", meta: "Mixture cut off no início" },
          { label: "RPM pós-start", value: "1000 RPM", meta: "Mixture full rich depois" },
          { label: "Checklist", value: "After Start", meta: "Após recuperar a partida" },
        ],
      },
      variantCopy: {
        cold: [
          "Executar Cleared for Start Checklist.",
          "Mixture rica, throttle com 3 injeções e abrir 1/2 polegada.",
          "Acionar sem injetar combustível.",
          "Após ligar: estabilizar em 1000 RPM e seguir o After Start Checklist.",
        ],
        warm: [
          "Executar Cleared for Start Checklist.",
          "Mixture rica, throttle com 1 injeção e abrir 1/2 polegada.",
          "Acionar sem injetar combustível.",
          "Após ligar: estabilizar em 1000 RPM e seguir o After Start Checklist.",
        ],
        flooded: [
          "Executar Cleared for Start Checklist.",
          "Mixture cut off e throttle full open para limpar a linha.",
          "Acionar sem injetar combustível.",
          "Depois: mixture full rich, estabilizar em 1000 RPM e seguir o After Start Checklist.",
        ],
      },
      chips: [
        { id: "cold", label: "Fria" },
        { id: "warm", label: "Quente" },
        { id: "flooded", label: "Afogada" },
      ],
      isDanger: false,
    },
    taxi: {
      label: "Táxi",
      summary: "Cheques antes de iniciar o movimento e execução do checklist down to the line.",
      cue: "Definir a pista em uso, manter a área livre e executar o checklist do táxi.",
      radio: "Táxi autorizado, cabeceira definida e checklist down to the line.",
      metrics: [
        { label: "Calços", value: "Removidos", meta: "Antes do táxi" },
        { label: "Área livre", value: "Asas / hélice", meta: "Livre ou em observação" },
        { label: "Luzes", value: "Landing lights", meta: "Só fora de Eldorado do Sul" },
        { label: "Checklist", value: "Before Takeoff", meta: "Down to the line durante o táxi" },
      ],
      steps: [
        "Remover calços e confirmar a área das asas e da hélice livre.",
        "Definir a cabeceira em uso.",
        "Ligar landing lights apenas fora de Eldorado do Sul.",
        "Executar o Before Takeoff Checklist down to the line.",
      ],
      chips: [],
      isDanger: false,
    },
    runup: {
      label: "Cheque de motor",
      summary: "Potência de cheque, limites e tolerâncias do motor antes da decolagem.",
      cue: "Ajustar para 1800 RPM e comparar os valores com os mínimos do SOP.",
      radio: "Checar potência máxima, magnetos, carb heat e lenta.",
      metrics: [
        { label: "RPM de cheque", value: "1800 RPM", meta: "Ajuste base do run-up" },
        { label: "Potência mínima", value: "2280 RPM", meta: "Mínimo operacional" },
        { label: "Magnetos", value: "175 RPM / 50 RPM", meta: "Queda e diferença máximas" },
        { label: "Carb heat", value: "200 RPM", meta: "Queda máxima" },
      ],
      steps: [
        "Ajustar o motor para 1800 RPM após checar potência máxima.",
        "Verificar potência máxima mínima de 2280 RPM.",
        "Checar magnetos: queda máxima de 175 RPM e diferença máxima de 50 RPM.",
        "Não manter operação com apenas 1 magneto por mais de 3 segundos.",
        "Checar carburetor heat com queda máxima de 200 RPM.",
        "Confirmar lenta entre 650 e 850 RPM.",
      ],
      chips: [],
      isDanger: false,
    },
    takeoff: {
      label: "Decolagem",
      summary: "Briefing operacional, rotação, subida inicial e ponto de decisão.",
      cue: "Aplicar potência máxima, respeitar a rotação e proteger a subida inicial.",
      radio: "Briefing operacional antes do ponto de espera e linha de pista livre.",
      metricsByVariant: {
        normal: [
          { label: "Flape", value: "10°", meta: "Decolagem normal" },
          { label: "Rotação", value: "60 kt", meta: "Na VR" },
          { label: "Subida inicial", value: "65 kt", meta: "Depois da rotação" },
          { label: "Após 400 ft", value: "70 kt", meta: "After Take-Off Checklist" },
        ],
        short: [
          { label: "Flape", value: "10°", meta: "Pista curta" },
          { label: "Rotação", value: "55 kt", meta: "Na VR" },
          { label: "Obstáculos", value: "60 kt", meta: "Flape UP ao livrar" },
          { label: "Após 400 ft", value: "70 kt", meta: "After Take-Off Checklist" },
        ],
      },
      variantCopy: {
        normal: [
          "Completar potência máxima e estabilizar o RPM.",
          "Checar 2280 RPM, 60 PSI e 100°F como mínimos operacionais.",
          "Na VR de 60 kt, anunciar ROTATION e iniciar subida com 65 kt.",
          "A 400 ft AGL: After Take-Off Checklist e acelerar para 70 kt.",
          "A 500 ft AGL e no fim da pista: curva para a perna do vento ou conforme ATC.",
        ],
        short: [
          "Freios aplicados, potência máxima e soltar os freios.",
          "Checar 2280 RPM, 60 PSI e 100°F como mínimos operacionais.",
          "Na VR de 55 kt, ROTATION e acelerar para 60 kt até livrar obstáculos.",
          "Quando livre, setar flape UP e prosseguir como decolagem normal.",
          "A 400 ft AGL: After Take-Off Checklist e acelerar para 70 kt.",
        ],
      },
      chips: [
        { id: "normal", label: "Normal" },
        { id: "short", label: "Curta" },
      ],
      isDanger: true,
      dangerCopy: [
        "Se houver perda de reta, obstáculo na pista ou mínimo operacional não atingido: ABORTAR A DECOLAGEM.",
        "Abaixo de 500 ft: pousar em frente ou aos lados.",
        "Acima de 500 ft: pousar em frente ou aos lados e, se possível, retornar à pista com curva para o vento.",
      ],
    },
    climb: {
      label: "Subida",
      summary: "Subida em cruzeiro com ajuste de mistura e mudança de referência de altitude.",
      cue: "Subir com potência máxima e manter 70 kt.",
      radio: "QNH, QNE e mistura conforme altitude.",
      metrics: [
        { label: "Potência", value: "Máxima", meta: "Subida em cruzeiro" },
        { label: "Velocidade", value: "70 kt", meta: "Manter na subida" },
        { label: "QNH → QNE", value: "2000 ft", meta: "Acima do terreno ou altitude de transição" },
        { label: "Mistura", value: ">3000 ft", meta: "Ajustar acima dessa altitude" },
      ],
      steps: [
        "Subir com potência máxima.",
        "Manter 70 kt na subida.",
        "Trocar de QNH para QNE quando 2000 ft acima do terreno ou na altitude de transição.",
        "Ajustar a mistura acima de 3000 ft.",
      ],
      chips: [],
      isDanger: false,
    },
    cruise: {
      label: "Cruzeiro",
      summary: "Perfil de navegação ou voo local com potência estabilizada e correção de mistura.",
      cue: "Escolher navegação ou voo local e estabilizar potência, mistura e velocidade.",
      radio: "Cruzeiro local ou navegação conforme missão.",
      metricsByVariant: {
        navigation: [
          { label: "Potência", value: "2200 RPM", meta: "Cruzeiro de navegação" },
          { label: "Mistura", value: "Correção", meta: "Até a queda e avançar 1 polegada" },
          { label: "Ajuste fino", value: "Trava central", meta: "Parte vermelha para enriquecer/empobrecer" },
          { label: "Velocidade", value: "Conforme POH", meta: "Perfil de navegação" },
        ],
        local: [
          { label: "Potência", value: "2100 RPM", meta: "Voo local" },
          { label: "Velocidade", value: "80 kt", meta: "Aproximadamente" },
          { label: "Mistura", value: "Ajuste fino", meta: "Conforme altitude" },
          { label: "Perfil", value: "Estável", meta: "Sem carga desnecessária" },
        ],
      },
      variantCopy: {
        navigation: [
          "Reduzir para 2200 RPM.",
          "Fazer a correção de mistura até ocorrer queda de potência e avançar uma polegada.",
          "No ajuste fino, destravar e girar a parte vermelha para enriquecer ou empobrecer.",
          "Manter o perfil de navegação conforme o planejamento do voo.",
        ],
        local: [
          "Manter 2100 RPM.",
          "Manter aproximadamente 80 kt.",
          "Ajustar a mistura conforme a necessidade de altitude e missão.",
          "Conferir situação de combustível e navegação.",
        ],
      },
      chips: [
        { id: "navigation", label: "Navegação" },
        { id: "local", label: "Voo local" },
      ],
      isDanger: false,
    },
    descent: {
      label: "Descida",
      summary: "Descida estabilizada com 80 kt, 500 ft/min e ajuste do altímetro.",
      cue: "Reduzir potência, estabilizar a razão de descida e preparar a aproximação.",
      radio: "QNH, nível de transição e checklist de descida/aproximação.",
      metrics: [
        { label: "Potência", value: "1500 RPM", meta: "Ajuste de descida" },
        { label: "Velocidade", value: "80 kt", meta: "Abaixando o nariz" },
        { label: "Razão", value: "500 ft/min", meta: "Manter a descida" },
        { label: "Mistura", value: "Enriquecer", meta: "2-3 voltas por 1000 ft" },
      ],
      steps: [
        "Reduzir para 1500 RPM.",
        "Abaixar o nariz para atingir 80 kt e manter 500 ft/min.",
        "Executar o Descent / Approach Checklist quando for ajustar o altímetro.",
        "Enriquecer a mistura ao iniciar a descida e gradativamente depois.",
      ],
      chips: [],
      isDanger: false,
    },
    circuit: {
      label: "Circuito",
      summary: "Circuito em 7 telas do SOP: entrada, perna do vento, través da metade da pista, través da cabeceira, base, final e pouso.",
      cue: "Selecione a etapa atual do circuito para ver exatamente o que fazer agora.",
      radio: "Comunicar posição no circuito e seguir o tráfego/ATC etapa por etapa.",
      circuitNote: "Altitude do circuito configurável",
      stageLabels: {
        entry: "Entrada no circuito",
        downwind: "Perna do vento",
        half: "Través da metade da pista",
        threshold: "Través da cabeceira",
        base: "Base",
        final: "Final",
        landing: "Pouso",
      },
      summaryByVariant: {
        entry: "Entrada no circuito na altitude configurada, com aviso de posição e preparação para a perna do vento.",
        downwind: "Perna do vento com 2100 RPM e 80 kt.",
        half: "Través da metade da pista: executar o Landing Checklist e manter a perna do vento.",
        threshold: "Través da cabeceira: 1300 RPM, flape 10° e 65 kt.",
        base: "Base: flape 10° ou 20° e velocidade de aproximação de 65 kt.",
        final: "Final: flape 30° e velocidade de aproximação de 60 kt.",
        landing: "Pouso: cruzar a cabeceira com 5 kt menos que a velocidade de aproximação e 50 ft acima da TDZE.",
      },
      cueByVariant: {
        entry: "Entrar no circuito, reduzir potência e avisar a posição.",
        downwind: "Perna do vento com 2100 RPM e 80 kt.",
        half: "Través da metade da pista: executar o Landing Checklist.",
        threshold: "Través da cabeceira: configurar 1300 RPM, flape 10° e 65 kt.",
        base: "Base: ajustar flape 10° ou 20° e manter 65 kt.",
        final: "Final: configurar flape 30° e manter 60 kt.",
        landing: "Pouso: cruzar a cabeceira com 5 kt menos que a aproximação e 50 ft acima da TDZE.",
      },
      radioByVariant: {
        entry: "Avisar posição e alinhar a entrada do circuito.",
        downwind: "Perna do vento estabilizada.",
        half: "Executar o Landing Checklist.",
        threshold: "Configuração de aproximação pronta.",
        base: "Base estabilizada.",
        final: "Final estabilizada.",
        landing: "Pouso e saída da pista.",
      },
      metricsByVariant: {
        entry: [
          { label: "Altitude", value: "__PATTERN_ALT__", meta: "Altitude do circuito" },
          { label: "Potência", value: "Reduzir", meta: "Preparar a perna do vento" },
          { label: "Velocidade", value: "Ajustar", meta: "Entrada no circuito" },
          { label: "Rádio", value: "Torre / ATC", meta: "Avisar posição" },
        ],
        downwind: [
          { label: "Altitude", value: "__PATTERN_ALT__", meta: "Circuito de tráfego" },
          { label: "Potência", value: "2100 RPM", meta: "Perna do vento" },
          { label: "Velocidade", value: "80 kt", meta: "Downwind" },
          { label: "Flape", value: "UP", meta: "Até a configuração" },
        ],
        half: [
          { label: "Checklist", value: "Landing", meta: "Na metade da pista" },
          { label: "Potência", value: "2100 RPM", meta: "Perna do vento" },
          { label: "Velocidade", value: "80 kt", meta: "Manter a perna" },
          { label: "Próxima etapa", value: "Través da cabeceira", meta: "Preparar a aproximação" },
        ],
        threshold: [
          { label: "Potência", value: "1300 RPM", meta: "Través da cabeceira" },
          { label: "Flape", value: "10°", meta: "Configurar aproximação" },
          { label: "Velocidade", value: "65 kt", meta: "Velocidade de aproximação" },
          { label: "Próxima etapa", value: "Base", meta: "Manter a rampa" },
        ],
        base: [
          { label: "Flape", value: "10° / 20°", meta: "Conforme a rampa" },
          { label: "Velocidade", value: "65 kt", meta: "Base normal" },
          { label: "Potência", value: "Ajustar", meta: "Manter a rampa" },
          { label: "Objetivo", value: "Estabilizar", meta: "Antes da final" },
        ],
        final: [
          { label: "Flape", value: "30°", meta: "Final normal" },
          { label: "Velocidade", value: "60 kt", meta: "Aproximação" },
          { label: "Cruzando cabeceira", value: "55 kt", meta: "5 kt menos que a aproximação" },
          { label: "Altura", value: "50 ft", meta: "Acima da TDZE" },
        ],
        landing: [
          { label: "Cabeceira", value: "55 kt", meta: "5 kt menos que a velocidade de aproximação" },
          { label: "Altura", value: "50 ft", meta: "Acima da TDZE" },
          { label: "Próxima ação", value: "Touchdown", meta: "Depois livrar a pista" },
          { label: "Checklist", value: "After Landing", meta: "Ao livrar o eixo" },
        ],
      },
      variantCopy: {
        entry: [
          "Entrar no circuito na altitude configurada.",
          "Reduzir potência e avisar a posição.",
          "Preparar o avião para a perna do vento.",
        ],
        downwind: [
          "Perna do vento: 2100 RPM e 80 kt.",
          "Manter a perna estabilizada.",
          "Preparar o Landing Checklist para a metade da pista.",
        ],
        half: [
          "Través da metade da pista na perna do vento.",
          "Executar ações do Landing Checklist.",
          "Manter 2100 RPM e 80 kt.",
        ],
        threshold: [
          "Través da cabeceira: 1300 RPM, flape 10° e 65 kt.",
          "Configurar a aproximação.",
          "Seguir para a base com o avião estabilizado.",
        ],
        base: [
          "Base: usar flape 10° ou 20° conforme a rampa.",
          "Manter 65 kt.",
          "Preparar final com aproximação estabilizada.",
        ],
        final: [
          "Final: aplicar flape 30°.",
          "Manter 60 kt até a cabeceira.",
          "Cruzar a cabeceira com 55 kt e 50 ft acima da TDZE.",
        ],
        landing: [
          "Cruzar a cabeceira com 5 kt menos que a velocidade de aproximação.",
          "Manter 50 ft acima da TDZE no cruzamento.",
          "Depois do toque, livrar a pista e seguir para o After Landing Checklist.",
        ],
      },
      chips: [
        { id: "entry", label: "Entrada" },
        { id: "downwind", label: "Perna do vento" },
        { id: "half", label: "Través da metade" },
        { id: "threshold", label: "Través da cabeceira" },
        { id: "base", label: "Base" },
        { id: "final", label: "Final" },
        { id: "landing", label: "Pouso" },
      ],
      isDanger: false,
    },
    goaround: {
      label: "Arremetida",
      summary: "Procedimento de recuperação na final ou no solo.",
      cue: "Aplicar potência total e reorganizar a aeronave com calma.",
      radio: "Avisar a decisão de arremeter e seguir a sequência com cautela.",
      metricsByVariant: {
        final: [
          { label: "Potência", value: "Total", meta: "Aplicar toda" },
          { label: "Carb heat", value: "Fechar", meta: "Se estiver aberto" },
          { label: "Flape", value: "Recolher gradualmente", meta: "Com razão de subida positiva" },
          { label: "Velocidade", value: "Subida", meta: "Acelerar para a velocidade de subida" },
        ],
        ground: [
          { label: "Flape", value: "UP / 10°", meta: "Conferir antes" },
          { label: "Mixture", value: "Full rich", meta: "Antes da arremetida" },
          { label: "Carb heat", value: "Closed", meta: "Antes da potência" },
          { label: "Trim", value: "T/O", meta: "Posição de decolagem" },
        ],
      },
      variantCopy: {
        final: [
          "Aplique toda a potência.",
          "Feche o ar quente do carburador se estiver aberto.",
          "Cabre suavemente e, com razão de subida positiva, recolha o flape gradualmente.",
        ],
        ground: [
          "Antes da arremetida no solo: flape UP ou 10°, mixture full rich, carb heat closed e trim em T/O.",
          "Seguir o procedimento de recuperação com calma.",
        ],
      },
      chips: [
        { id: "final", label: "Na final" },
        { id: "ground", label: "No solo" },
      ],
      isDanger: true,
    },
    afterlanding: {
      label: "Pós-pouso",
      summary: "Checklist após livrar a pista, corte e abandono da aeronave.",
      cue: "Depois do pouso, seguir a sequência de saída, corte e abandono.",
      radio: "After Landing, Shutdown e Securing Aircraft Checklist.",
      metrics: [
        { label: "Ao livrar", value: "After Landing", meta: "Executar ao sair da pista" },
        { label: "Corte", value: "Shutdown", meta: "Sequência de desligamento" },
        { label: "Abandono", value: "Securing", meta: "Após o corte" },
        { label: "Fim", value: "Cabine segura", meta: "Após o checklist" },
      ],
      steps: [
        "Ao livrar o eixo, executar o After Landing Checklist.",
        "Executar o Shutdown Checklist.",
        "Após o corte, executar o Securing Aircraft Checklist.",
      ],
      chips: [],
      isDanger: false,
    },
  },
};

const state = {
  ...defaultState,
  phaseId: "preflight",
  variantId: null,
};

const elements = {
  phaseRail: document.getElementById("phaseRail"),
  subphaseRail: document.getElementById("subphaseRail"),
  phaseIndex: document.getElementById("phaseIndex"),
  phaseTitle: document.getElementById("phaseTitle"),
  phaseSummary: document.getElementById("phaseSummary"),
  phaseTag: document.getElementById("phaseTag"),
  metrics: document.getElementById("metrics"),
  stepsList: document.getElementById("stepsList"),
  cueText: document.getElementById("cueText"),
  cueExtra: document.getElementById("cueExtra"),
  baselineStrip: document.getElementById("baselineStrip"),
  transcript: document.getElementById("transcript"),
  voiceState: document.getElementById("voiceState"),
  listenBtn: document.getElementById("listenBtn"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  app: document.querySelector(".app"),
  wakeWordInput: document.getElementById("wakeWordInput"),
  patternAltitudeInput: document.getElementById("patternAltitudeInput"),
  stepsHint: document.getElementById("stepsHint"),
  settingsBtn: document.getElementById("settingsBtn"),
  settingsPage: document.getElementById("settingsPage"),
  closeSettingsBtn: document.getElementById("closeSettingsBtn"),
};

const speech = {
  recognition: null,
  manualStop: false,
  finalTranscript: "",
};

init();

function init() {
  loadSettings();
  initVoice();
  bindEvents();
  render();
  registerServiceWorker();
}

function loadSettings() {
  const savedWake = localStorage.getItem(STORAGE_KEYS.wakeWord);
  const savedPattern = localStorage.getItem(STORAGE_KEYS.patternAltitude);
  state.wakeWord = savedWake || defaultState.wakeWord;
  state.patternAltitude = savedPattern || defaultState.patternAltitude;
  elements.wakeWordInput.value = state.wakeWord;
  elements.patternAltitudeInput.value = state.patternAltitude;
}

function bindEvents() {
  elements.listenBtn.addEventListener("click", toggleListening);
  elements.prevBtn.addEventListener("click", goPreviousPhase);
  elements.nextBtn.addEventListener("click", goNextPhase);
  elements.settingsBtn.addEventListener("click", openSettings);
  elements.closeSettingsBtn.addEventListener("click", closeSettings);
  elements.settingsPage.addEventListener("click", (event) => {
    if (event.target === elements.settingsPage) closeSettings();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.settingsPage.hidden) closeSettings();
  });
  elements.wakeWordInput.addEventListener("input", (event) => {
    state.wakeWord = event.target.value.trim() || defaultState.wakeWord;
    localStorage.setItem(STORAGE_KEYS.wakeWord, state.wakeWord);
    updateVoiceHint();
  });
  elements.patternAltitudeInput.addEventListener("input", (event) => {
    state.patternAltitude = event.target.value.trim() || defaultState.patternAltitude;
    localStorage.setItem(STORAGE_KEYS.patternAltitude, state.patternAltitude);
    render();
  });
}

function openSettings() {
  elements.settingsPage.hidden = false;
  elements.closeSettingsBtn.focus();
}

function closeSettings() {
  elements.settingsPage.hidden = true;
  elements.settingsBtn.focus();
}

function initVoice() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    speech.recognition = null;
    state.voiceAvailable = false;
    updateVoiceHint("Voz indisponível neste navegador");
    return;
  }

  const recognition = new Recognition();
  recognition.lang = "pt-BR";
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    state.voiceAvailable = true;
    updateVoiceHint("Ouvindo comando");
    elements.app.classList.add("is-listening");
    elements.listenBtn.textContent = "Pausar voz";
  };

  recognition.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const result = event.results[i];
      const transcript = result[0].transcript.trim();
      if (result.isFinal) {
        speech.finalTranscript = transcript;
        const match = parseVoiceCommand(transcript);
        if (match) {
          setPhase(match.phaseId, match.variantId);
          const commandLabel = match.label || transcript;
          state.recognizedLabel = `Reconhecido: ${commandLabel}`;
          elements.transcript.textContent = `${state.wakeWord}, ${commandLabel}`;
        } else {
          state.recognizedLabel = "Comando não reconhecido";
          elements.transcript.textContent = `Não entendi: ${transcript}`;
        }
      } else {
        interim += `${transcript} `;
      }
    }
    if (interim.trim()) {
      elements.transcript.textContent = `Escutando: ${interim.trim()}`;
    }
  };

  recognition.onerror = (event) => {
    state.voiceListening = false;
    elements.app.classList.remove("is-listening");
    elements.listenBtn.textContent = "Ativar voz";
    const message = voiceErrorMessage(event.error);
    updateVoiceHint(message);
    elements.transcript.textContent = message;
  };

  recognition.onend = () => {
    elements.app.classList.remove("is-listening");
    elements.listenBtn.textContent = "Ativar voz";
    if (!speech.manualStop && state.voiceListening) {
      try {
        recognition.start();
        return;
      } catch (error) {
        // Ignora tentativa de reinício duplicado.
      }
    }
    state.voiceListening = false;
    updateVoiceHint("Voz pronta");
  };

  speech.recognition = recognition;
  state.voiceAvailable = true;
  updateVoiceHint("Voz pronta");
}

function toggleListening() {
  if (!speech.recognition) {
    updateVoiceHint("Voz indisponível neste navegador");
    return;
  }

  if (state.voiceListening) {
    speech.manualStop = true;
    state.voiceListening = false;
    speech.recognition.stop();
    elements.app.classList.remove("is-listening");
    elements.listenBtn.textContent = "Ativar voz";
    updateVoiceHint("Voz pausada");
    return;
  }

  try {
    speech.manualStop = false;
    state.voiceListening = true;
    speech.recognition.start();
  } catch (error) {
    state.voiceListening = false;
    updateVoiceHint("Não foi possível iniciar a voz");
  }
}

function goPreviousPhase() {
  const currentIndex = flightOrder.findIndex((phase) => phase.id === state.phaseId);
  const prevIndex = (currentIndex - 1 + flightOrder.length) % flightOrder.length;
  setPhase(flightOrder[prevIndex].id);
}

function goNextPhase() {
  const currentIndex = flightOrder.findIndex((phase) => phase.id === state.phaseId);
  const nextIndex = (currentIndex + 1) % flightOrder.length;
  setPhase(flightOrder[nextIndex].id);
}

function setPhase(phaseId, variantId = null) {
  state.phaseId = phaseId;
  const phase = profile.phases[phaseId];
  if (!phase) return;

  if (variantId) {
    state.variantId = variantId;
  } else if (phase.chips && phase.chips.length > 0) {
    state.variantId = state.variantId && phase.chips.some((chip) => chip.id === state.variantId)
      ? state.variantId
      : phase.chips[0].id;
  } else if (phase.variantsByDefault) {
    state.variantId = phase.variantsByDefault;
  } else {
    state.variantId = null;
  }

  render();
}

function render() {
  const phase = profile.phases[state.phaseId];
  const phaseIndex = flightOrder.findIndex((item) => item.id === state.phaseId);
  const total = flightOrder.length;
  const variantId = resolveVariantId(phase);
  const variant = resolveVariant(phase, variantId);
  const isCircuit = phase.id === "circuit";
  const circuitStageIndex = isCircuit && phase.chips
    ? Math.max(phase.chips.findIndex((chip) => chip.id === variantId), 0)
    : -1;
  const circuitStageTotal = isCircuit && phase.chips ? phase.chips.length : 0;
  const displayTitle = isCircuit
    ? phase.stageLabels?.[variantId] || phase.label
    : phase.label;
  const displaySummary = isCircuit
    ? phase.summaryByVariant?.[variantId] || phase.summary
    : phase.summary;
  const displayCue = isCircuit
    ? phase.cueByVariant?.[variantId] || phase.cue
    : phase.cue;
  const displayRadio = isCircuit
    ? phase.radioByVariant?.[variantId] || phase.radio
    : phase.radio;

  elements.phaseIndex.textContent = isCircuit
    ? `Etapa ${circuitStageIndex + 1} de ${circuitStageTotal}`
    : `${phaseIndex + 1} de ${total}`;
  elements.phaseTitle.textContent = displayTitle;
  elements.phaseSummary.textContent = displaySummary;
  elements.phaseTag.textContent = isCircuit ? "Circuito" : phase.isDanger ? "Atenção crítica" : "SOP ativo";
  elements.stepsHint.textContent = displayRadio;
  elements.app.classList.toggle("is-danger", Boolean(phase.isDanger));

  renderPhaseRail();
  renderSubphaseRail(phase, variantId);
  renderMetrics(phase, variant, variantId);
  renderSteps(phase, variant, variantId);
  renderCallout(phase, variant, displayCue);
  renderBaseline();
  renderVoiceStatus();
}

function renderPhaseRail() {
  elements.phaseRail.innerHTML = "";
  flightOrder.forEach((phaseItem) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chip ${phaseItem.id === state.phaseId ? "is-active" : ""}`;
    button.textContent = phaseItem.label;
    button.addEventListener("click", () => setPhase(phaseItem.id));
    elements.phaseRail.appendChild(button);
  });
}

function renderSubphaseRail(phase, activeVariantId) {
  const chips = phase.chips || [];
  elements.subphaseRail.innerHTML = "";

  if (!chips.length) {
    elements.subphaseRail.hidden = true;
    return;
  }

  elements.subphaseRail.hidden = false;
  chips.forEach((chip) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chip ${chip.id === activeVariantId ? "is-active" : ""}`;
    button.textContent = chip.label;
    button.addEventListener("click", () => {
      state.variantId = chip.id;
      render();
    });
    elements.subphaseRail.appendChild(button);
  });
}

function renderMetrics(phase, variant, variantId) {
  const metrics = resolveMetrics(phase, variant, variantId);
  elements.metrics.innerHTML = "";
  metrics.forEach((metric) => {
    const article = document.createElement("article");
    article.className = "metric";
    article.innerHTML = `
      <p class="metric__label">${escapeHtml(metric.label)}</p>
      <p class="metric__value">${escapeHtml(metric.value)}</p>
      <p class="metric__meta">${escapeHtml(metric.meta || "")}</p>
    `;
    elements.metrics.appendChild(article);
  });
}

function renderSteps(phase, variant, variantId) {
  const steps = resolveSteps(phase, variant, variantId);
  elements.stepsList.innerHTML = "";
  steps.forEach((step, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="step-index">${index + 1}</span>
      <span class="step-copy">${escapeHtml(step)}</span>
    `;
    elements.stepsList.appendChild(li);
  });
}

function renderCallout(phase, variant, defaultCue) {
  const danger = phase.dangerCopy || [];
  const text = variant?.callout || phase.dangerCopy?.[0] || defaultCue;
  elements.cueText.textContent = text;

  elements.cueExtra.innerHTML = "";
  if (!danger.length) return;

  if (danger.length > 1) {
    elements.cueExtra.innerHTML = danger
      .slice(1)
      .map((item) => `<p>${escapeHtml(item)}</p>`)
      .join("");
  }
}

function renderBaseline() {
  const items = profile.baseline.map((item) => {
    return `
      <article class="mini">
        <p class="mini__label">${escapeHtml(item.label)}</p>
        <p class="mini__value">${escapeHtml(item.value)}</p>
      </article>
    `;
  });
  const patternNote = `
    <article class="mini">
      <p class="mini__label">Circuito</p>
      <p class="mini__value">${escapeHtml(state.patternAltitude)}</p>
    </article>
  `;
  elements.baselineStrip.innerHTML = `${patternNote}${items.join("")}`;
}

function renderVoiceStatus() {
  if (!speech.recognition) {
    elements.voiceState.textContent = "Voz indisponível";
    elements.transcript.textContent = "Voz indisponível neste navegador";
    elements.listenBtn.disabled = true;
    elements.listenBtn.textContent = "Sem voz";
    return;
  }

  elements.listenBtn.disabled = false;
  elements.listenBtn.textContent = state.voiceListening ? "Pausar voz" : "Ativar voz";
  const status = state.voiceListening ? "Ouvindo comando" : state.recognizedLabel || "Voz pronta";
  elements.voiceState.textContent = status;
  if (!elements.transcript.textContent || elements.transcript.textContent === "Voz pronta") {
    elements.transcript.textContent = status;
  }
}

function resolveVariantId(phase) {
  if (!phase) return null;
  if (state.variantId && phase.chips && phase.chips.some((chip) => chip.id === state.variantId)) {
    return state.variantId;
  }
  if (phase.chips && phase.chips.length > 0) {
    return phase.chips[0].id;
  }
  return null;
}

function resolveVariant(phase, variantId) {
  if (!phase || !variantId) return phase;
  if (phase.metricsByVariant) {
    return phase.metricsByVariant[variantId] || phase.metricsByVariant[phase.chips?.[0]?.id];
  }
  return phase.variants?.[variantId] || phase;
}

function resolveMetrics(phase, variant, variantId) {
  if (phase.id === "circuit" && variantId === "entry") {
    return (variant || phase.metricsByVariant.entry).map((metric) => ({
      ...metric,
      value: metric.value.replace("__PATTERN_ALT__", state.patternAltitude),
    }));
  }

  if (phase.metricsByVariant && variantId && phase.metricsByVariant[variantId]) {
    return phase.metricsByVariant[variantId].map((metric) => ({
      ...metric,
      value: metric.value.replace("__PATTERN_ALT__", state.patternAltitude),
    }));
  }

  return (phase.metrics || []).map((metric) => ({
    ...metric,
    value: metric.value.replace("__PATTERN_ALT__", state.patternAltitude),
  }));
}

function resolveSteps(phase, variant, variantId) {
  if (phase.variantCopy && variantId && phase.variantCopy[variantId]) {
    return phase.variantCopy[variantId];
  }
  if (variant?.steps) {
    return variant.steps;
  }
  return phase.steps || [];
}

function parseVoiceCommand(text) {
  const normalized = normalize(text);
  const wake = normalize(state.wakeWord);
  const hasWakeWord = !wake || normalized.includes(wake);

  if (!hasWakeWord) {
    return null;
  }

  const stripped = wake ? normalized.replace(wake, " ").replace(/\s+/g, " ").trim() : normalized;

  const matchers = [
    { phaseId: "preflight", variantId: null, patterns: ["pre voo", "preflight", "pre-voo", "check pre voo", "check preflight"], label: "pré-voo" },
    { phaseId: "start", variantId: "cold", patterns: ["partida fria", "cold start", "start fria"], label: "partida fria" },
    { phaseId: "start", variantId: "warm", patterns: ["partida quente", "hot start", "start quente"], label: "partida quente" },
    { phaseId: "start", variantId: "flooded", patterns: ["partida afogada", "flooded start", "partida inundada"], label: "partida afogada" },
    { phaseId: "taxi", variantId: null, patterns: ["taxi", "taxiar"], label: "táxi" },
    { phaseId: "runup", variantId: null, patterns: ["cheque de motor", "run up", "runup", "motor"], label: "cheque de motor" },
    { phaseId: "takeoff", variantId: "normal", patterns: ["decolagem normal", "takeoff normal", "decolando normal"], label: "decolagem normal" },
    { phaseId: "takeoff", variantId: "short", patterns: ["decolagem curta", "short field", "pista curta"], label: "decolagem curta" },
    { phaseId: "climb", variantId: null, patterns: ["subida", "subida em cruzeiro", "cruise climb"], label: "subida" },
    { phaseId: "cruise", variantId: "navigation", patterns: ["cruzeiro navegacao", "cruzeiro navegação", "navegacao", "navigation"], label: "cruzeiro de navegação" },
    { phaseId: "cruise", variantId: "local", patterns: ["cruzeiro local", "voo local", "voo local"], label: "voo local" },
    { phaseId: "descent", variantId: null, patterns: ["descida", "descent"], label: "descida" },
    { phaseId: "circuit", variantId: "entry", patterns: ["entrando no circuito de trafego", "circuito de trafego", "circuito de tráfego", "entrada no circuito"], label: "entrada no circuito" },
    { phaseId: "circuit", variantId: "downwind", patterns: ["perna do vento", "downwind"], label: "perna do vento" },
    { phaseId: "circuit", variantId: "half", patterns: ["metade da pista", "traves da metade", "traves da metade da pista", "atraves da metade", "traves metade"], label: "través da metade da pista" },
    { phaseId: "circuit", variantId: "threshold", patterns: ["traves da cabeceira", "atraves da cabeceira", "través da cabeceira"], label: "través da cabeceira" },
    { phaseId: "circuit", variantId: "base", patterns: ["base"], label: "base" },
    { phaseId: "circuit", variantId: "final", patterns: ["final", "perna final"], label: "final" },
    { phaseId: "circuit", variantId: "landing", patterns: ["pouso", "toque", "touchdown", "touch down"], label: "pouso" },
    { phaseId: "goaround", variantId: "final", patterns: ["arremetida na final", "arremetida", "go around", "go-around"], label: "arremetida na final" },
    { phaseId: "goaround", variantId: "ground", patterns: ["arremetida no solo", "arremetida no chão", "arremetida no solo"], label: "arremetida no solo" },
    { phaseId: "afterlanding", variantId: null, patterns: ["apos pouso", "após pouso", "after landing", "pouso finalizado", "shutdown"], label: "pós-pouso" },
  ];

  const source = stripped || normalized;
  for (const matcher of matchers) {
    if (matcher.patterns.some((pattern) => source.includes(normalize(pattern)))) {
      return matcher;
    }
  }

  return null;
}

function normalize(input) {
  return String(input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[º°]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function updateVoiceHint(message) {
  if (message) {
    state.recognizedLabel = message;
  }
  if (elements.transcript && message) {
    elements.transcript.textContent = message;
  }
  renderVoiceStatus();
}

function voiceErrorMessage(error) {
  switch (error) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microfone negado. Libere a permissão para usar a voz.";
    case "network":
      return "Sem conexão para reconhecer voz.";
    case "no-speech":
      return "Nenhuma fala detectada.";
    case "audio-capture":
      return "Não encontrei entrada de áudio.";
    default:
      return "A voz encontrou uma falha.";
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  navigator.serviceWorker.register("./sw.js", { scope: "./" }).catch(() => {
    // Offline caching is progressive; failure here should not block the app.
  });
}
