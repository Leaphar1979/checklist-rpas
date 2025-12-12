/* =====================================================
   CHECKLIST OPERACIONAL RPAS
   Fases 1, 2 e 3 – Validação + Registro
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
    phase1: { completed: false, completedAt: null },
    phase2: { completed: false, completedAt: null },
    phase3: { completed: false, completedAt: null }
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

  document.getElementById("startBtn")
    .addEventListener("click", startChecklist);

  document.getElementById("missionForm")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      checklistSession.metadata.pilot = pilot.value;
      checklistSession.metadata.observer = observer.value;
      checklistSession.metadata.unit = unit.value;
      checklistSession.metadata.rpas = rpas.value;
      checklistSession.metadata.missionType = missionType.value;

      localStorage.setItem("checklistRPAS_session", JSON.stringify(checklistSession));
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

  /* ===== FASE 3 — VOO DA AERONAVE ===== */
  document.getElementById("phase3Form")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      const ok = [...document.querySelectorAll("#phase3Form input[type='checkbox']")]
        .every(cb => cb.checked);

      if (!ok) {
        alert("Todos os itens da Fase 3 (Voo da Aeronave) devem ser concluídos.");
        return;
      }

      checklistSession.phases.phase3.completed = true;
      checklistSession.phases.phase3.completedAt = new Date().toISOString();

      localStorage.setItem(
        "checklistRPAS_session",
        JSON.stringify(checklistSession)
      );

      alert(
        "Fase 3 – Voo da Aeronave concluída.\n\n" +
        "Próxima etapa: Pós-Voo Imediato."
      );

      // A Fase 4 será implementada no próximo passo
    });

});
