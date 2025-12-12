/* =====================================================
   CHECKLIST OPERACIONAL RPAS
   Controle de fluxo + Identificação da Missão
   ===================================================== */

const checklistSession = {
  metadata: {
    checklistName: "Checklist Operacional RPAS",
    institution: "PCSC / SAER / NOARP",
    doctrine: "COARP",
    version: "v1.0",
    startTime: null,
    pilot: "",
    observer: "",
    unit: "",
    rpas: "",
    missionType: ""
  },
  phases: []
};

/* ===== FUNÇÃO UTILITÁRIA: TROCA DE TELAS ===== */
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });
  document.getElementById(screenId).classList.add("active");
}

/* ===== INICIAR CHECKLIST ===== */
function startChecklist() {
  checklistSession.metadata.startTime = new Date().toISOString();

  localStorage.setItem(
    "checklistRPAS_session",
    JSON.stringify(checklistSession)
  );

  showScreen("mission");
}

/* ===== DOM READY ===== */
document.addEventListener("DOMContentLoaded", () => {

  const startBtn = document.getElementById("startBtn");
  const missionForm = document.getElementById("missionForm");

  startBtn.addEventListener("click", startChecklist);

  missionForm.addEventListener("submit", (event) => {
    event.preventDefault();

    checklistSession.metadata.pilot = pilot.value;
    checklistSession.metadata.observer = observer.value;
    checklistSession.metadata.unit = unit.value;
    checklistSession.metadata.rpas = rpas.value;
    checklistSession.metadata.missionType = missionType.value;

    localStorage.setItem(
      "checklistRPAS_session",
      JSON.stringify(checklistSession)
    );

    alert(
      "Identificação da missão registrada.\n\n" +
      "Próxima etapa: Preparação para o Voo."
    );

    // Próxima tela será criada no próximo passo
  });
});
