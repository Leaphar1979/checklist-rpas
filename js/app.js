/* =====================================================
   CHECKLIST OPERACIONAL RPAS
   Fases 1 e 2 – Validação + Registro
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
  phases: {
    phase1: {
      completed: false,
      completedAt: null
    },
    phase2: {
      completed: false,
      completedAt: null
    }
  }
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
  localStorage.setItem("checklistRPAS_session", JSON.stringify(checklistSession));
  showScreen("mission");
}

/* ===== DOM READY ===== */
document.addEventListener("DOMContentLoaded", () => {

  /* Splash */
  document.getElementById("startBtn")
    .addEventListener("click", startChecklist);

  /* Identificação da missão */
  document.getElementById("missionForm")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      checklistSession.metadata.pilot = pilot.value;
      checklistSession.metadata.observer = observer.value;
      checklistSession.metadata.unit = unit.value;
      checklistSession.metadata.rpas = rpas.value;
      checklistSession.metadata.missionType = missionType.value;

      localStorage.setItem(
        "checklistRPAS_session",
        JSON.stringify(checklistSession)
      );

      showScreen("phase1");
    });

  /* ===== FASE 1 – PREPARAÇÃO PARA O VOO ===== */
  document.getElementById("phase1Form")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      const checkboxes = document
        .querySelectorAll("#phase1Form input[type='checkbox']");

      const allChecked = Array.from(checkboxes)
        .every(cb => cb.checked);

      if (!allChecked) {
        alert("Todos os itens da Fase 1 devem ser concluídos.");
        return;
      }

      checklistSession.phases.phase1.completed = true;
      checklistSession.phases.phase1.completedAt = new Date().toISOString();

      localStorage.setItem(
        "checklistRPAS_session",
        JSON.stringify(checklistSession)
      );

      showScreen("phase2");
    });

  /* ===== FASE 2 – PRÉ-VOO ===== */
  document.getElementById("phase2Form")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      const checkboxes = document
        .querySelectorAll("#phase2Form input[type='checkbox']");

      const allChecked = Array.from(checkboxes)
        .every(cb => cb.checked);

      if (!allChecked) {
        alert("Todos os itens da Fase 2 (Pré-Voo) devem ser concluídos.");
        return;
      }

      checklistSession.phases.phase2.completed = true;
      checklistSession.phases.phase2.completedAt = new Date().toISOString();

      localStorage.setItem(
        "checklistRPAS_session",
        JSON.stringify(checklistSession)
      );

      alert(
        "Fase 2 – Pré-Voo concluída.\n\n" +
        "Próxima etapa: Voo da Aeronave."
      );

      // A Fase 3 será implementada no próximo passo
    });

});
