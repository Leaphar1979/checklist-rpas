/* =====================================================
   CHECKLIST OPERACIONAL RPAS
   Fases 1 a 5 – Validação + Encerramento
   ===================================================== */

const checklistSession = {
  metadata: {
    checklistName: "Checklist Operacional RPAS",
    institution: "PCSC / SAER / NOARP",
    doctrine: "COARP",
    version: "v1.0",
    startTime: null,
    endTime: null,
    pilot: "",
    observer: "",
    unit: "",
    rpas: "",
    missionType: ""
  },
  phases: {
    phase1: { completed: false, completedAt: null },
    phase2: { completed: false, completedAt: null },
    phase3: { completed: false, completedAt: null },
    phase4: { completed: false, completedAt: null },
    phase5: { completed: false, completedAt: null }
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

  /* ===== FASE 1 ===== */
  document.getElementById("phase1Form")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      const ok = [...document.querySelectorAll("#phase1Form input[type='checkbox']")]
        .every(cb => cb.checked);

      if (!ok) return alert("Conclua todos os itens da Fase 1.");

      checklistSession.phases.phase1.completed = true;
      checklistSession.phases.phase1.completedAt = new Date().toISOString();
      localStorage.setItem("checklistRPAS_session", JSON.stringify(checklistSession));
      showScreen("phase2");
    });

  /* ===== FASE 2 ===== */
  document.getElementById("phase2Form")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      const ok = [...document.querySelectorAll("#phase2Form input[type='checkbox']")]
        .every(cb => cb.checked);

      if (!ok) return alert("Conclua todos os itens da Fase 2.");

      checklistSession.phases.phase2.completed = true;
      checklistSession.phases.phase2.completedAt = new Date().toISOString();
      localStorage.setItem("checklistRPAS_session", JSON.stringify(checklistSession));
      showScreen("phase3");
    });

  /* ===== FASE 3 ===== */
  document.getElementById("phase3Form")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      const ok = [...document.querySelectorAll("#phase3Form input[type='checkbox']")]
        .every(cb => cb.checked);

      if (!ok) return alert("Conclua todos os itens da Fase 3.");

      checklistSession.phases.phase3.completed = true;
      checklistSession.phases.phase3.completedAt = new Date().toISOString();
      localStorage.setItem("checklistRPAS_session", JSON.stringify(checklistSession));
      showScreen("phase4");
    });

  /* ===== FASE 4 ===== */
  document.getElementById("phase4Form")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      const ok = [...document.querySelectorAll("#phase4Form input[type='checkbox']")]
        .every(cb => cb.checked);

      if (!ok) return alert("Conclua todos os itens da Fase 4.");

      checklistSession.phases.phase4.completed = true;
      checklistSession.phases.phase4.completedAt = new Date().toISOString();
      localStorage.setItem("checklistRPAS_session", JSON.stringify(checklistSession));
      showScreen("phase5");
    });

  /* ===== FASE 5 — CONCLUSÃO DO VOO ===== */
  document.getElementById("phase5Form")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      const ok = [...document.querySelectorAll("#phase5Form input[type='checkbox']")]
        .every(cb => cb.checked);

      if (!ok) {
        alert("Todos os itens da Fase 5 devem ser concluídos.");
        return;
      }

      checklistSession.phases.phase5.completed = true;
      checklistSession.phases.phase5.completedAt = new Date().toISOString();
      checklistSession.metadata.endTime = new Date().toISOString();

      localStorage.setItem(
        "checklistRPAS_session",
        JSON.stringify(checklistSession)
      );

alert(
  "Checklist operacional RPAS ENCERRADO com sucesso.\n\n" +
  "Procedimento concluído e registrado."
);

// Avança para a tela de geração de PDF
showScreen("pdfScreen");
    });

});
