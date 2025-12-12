/* =====================================================
   CHECKLIST OPERACIONAL RPAS
   Lógica inicial – PCSC / SAER / COARP
   ===================================================== */

/**
 * Estrutura base do checklist
 * A numeração oficial dos itens será preservada internamente
 * (não exibida na UI por padrão)
 */

const checklistSession = {
  metadata: {
    checklistName: "Checklist Operacional RPAS",
    institution: "PCSC / SAER / NOARP",
    doctrine: "COARP",
    version: "v1.0",
    startTime: null
  },
  phases: []
};

/**
 * Função: iniciar checklist
 * Registra data/hora e avança para próxima fase
 */
function startChecklist() {
  checklistSession.metadata.startTime = new Date().toISOString();

  // Salva início da sessão (cadeia de custódia digital)
  localStorage.setItem(
    "checklistRPAS_session",
    JSON.stringify(checklistSession)
  );

  // Feedback inicial
  alert(
    "Checklist iniciado.\n" +
    "Data e hora registradas.\n\n" +
    "Próxima etapa: Identificação da Missão."
  );

  // Aqui, no próximo passo, faremos a troca real de tela
}

/**
 * Vincula o botão da tela inicial
 */
document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startBtn");

  if (startButton) {
    startButton.addEventListener("click", startChecklist);
  }
});
