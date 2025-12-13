/* =====================================================
   CHECKLIST OPERACIONAL RPAS
   PCSC · SAER · NOARP · COARP
   Fluxo completo + PDF institucional
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

/* ===== FUNÇÃO DE NAVEGAÇÃO ===== */
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("active");
  });
  const target = document.getElementById(screenId);
  if (target) target.classList.add("active");
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

  /* Splash */
  const startBtn = document.getElementById("startBtn");
  if (startBtn) startBtn.addEventListener("click", startChecklist);

  /* Missão */
  const missionForm = document.getElementById("missionForm");
  if (missionForm) {
    missionForm.addEventListener("submit", e => {
      e.preventDefault();

      checklistSession.metadata.pilot =
        document.getElementById("pilot").value;

      checklistSession.metadata.observer =
        document.getElementById("observer").value;

      checklistSession.metadata.unit =
        document.getElementById("unit").value;

      checklistSession.metadata.rpas =
        document.getElementById("rpas").value;

      checklistSession.metadata.missionType =
        document.getElementById("missionType").value;

      localStorage.setItem(
        "checklistRPAS_session",
        JSON.stringify(checklistSession)
      );

      showScreen("phase1");
    });
  }

  /* ===== FASE 1 ===== */
  const phase1Form = document.getElementById("phase1Form");
  if (phase1Form) {
    phase1Form.addEventListener("submit", e => {
      e.preventDefault();
      const ok = [...phase1Form.querySelectorAll("input[type='checkbox']")]
        .every(cb => cb.checked);

      if (!ok) return alert("Conclua todos os itens da Fase 1.");

      checklistSession.phases.phase1.completed = true;
      checklistSession.phases.phase1.completedAt = new Date().toISOString();
      localStorage.setItem("checklistRPAS_session", JSON.stringify(checklistSession));
      showScreen("phase2");
    });
  }

  /* ===== FASE 2 ===== */
  const phase2Form = document.getElementById("phase2Form");
  if (phase2Form) {
    phase2Form.addEventListener("submit", e => {
      e.preventDefault();
      const ok = [...phase2Form.querySelectorAll("input[type='checkbox']")]
        .every(cb => cb.checked);

      if (!ok) return alert("Conclua todos os itens da Fase 2.");

      checklistSession.phases.phase2.completed = true;
      checklistSession.phases.phase2.completedAt = new Date().toISOString();
      localStorage.setItem("checklistRPAS_session", JSON.stringify(checklistSession));
      showScreen("phase3");
    });
  }

  /* ===== FASE 3 ===== */
  const phase3Form = document.getElementById("phase3Form");
  if (phase3Form) {
    phase3Form.addEventListener("submit", e => {
      e.preventDefault();
      const ok = [...phase3Form.querySelectorAll("input[type='checkbox']")]
        .every(cb => cb.checked);

      if (!ok) return alert("Conclua todos os itens da Fase 3.");

      checklistSession.phases.phase3.completed = true;
      checklistSession.phases.phase3.completedAt = new Date().toISOString();
      localStorage.setItem("checklistRPAS_session", JSON.stringify(checklistSession));
      showScreen("phase4");
    });
  }

  /* ===== FASE 4 ===== */
  const phase4Form = document.getElementById("phase4Form");
  if (phase4Form) {
    phase4Form.addEventListener("submit", e => {
      e.preventDefault();
      const ok = [...phase4Form.querySelectorAll("input[type='checkbox']")]
        .every(cb => cb.checked);

      if (!ok) return alert("Conclua todos os itens da Fase 4.");

      checklistSession.phases.phase4.completed = true;
      checklistSession.phases.phase4.completedAt = new Date().toISOString();
      localStorage.setItem("checklistRPAS_session", JSON.stringify(checklistSession));
      showScreen("phase5");
    });
  }

  /* ===== FASE 5 ===== */
  const phase5Form = document.getElementById("phase5Form");
  if (phase5Form) {
    phase5Form.addEventListener("submit", e => {
      e.preventDefault();
      const ok = [...phase5Form.querySelectorAll("input[type='checkbox']")]
        .every(cb => cb.checked);

      if (!ok) return alert("Conclua todos os itens da Fase 5.");

      checklistSession.phases.phase5.completed = true;
      checklistSession.phases.phase5.completedAt = new Date().toISOString();
      checklistSession.metadata.endTime = new Date().toISOString();

      localStorage.setItem(
        "checklistRPAS_session",
        JSON.stringify(checklistSession)
      );

      alert("Checklist operacional RPAS encerrado com sucesso.");
      showScreen("pdfScreen");
    });
  }

  /* ===== GERAÇÃO DE PDF (ROBUSTA) ===== */
  const pdfBtn = document.getElementById("generatePdfBtn");
  if (pdfBtn) {
    pdfBtn.addEventListener("click", () => {
      const data = JSON.parse(
        localStorage.getItem("checklistRPAS_session")
      );

      if (!data) {
        alert("Nenhum checklist encontrado.");
        return;
      }

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF();
      let y = 40;

      const addLogo = (src, x, next) => {
        const img = new Image();
        img.onload = () => {
          pdf.addImage(img, "PNG", x, 10, 18, 18);
          if (next) next();
        };
        img.src = src;
      };

      const gerarConteudo = () => {

        pdf.setFontSize(14);
        pdf.text("CHECKLIST OPERACIONAL RPAS", 105, 18, { align: "center" });

        pdf.setFontSize(10);
        pdf.text(
          "Polícia Civil de Santa Catarina · SAER · NOARP · COARP",
          105,
          25,
          { align: "center" }
        );

        pdf.setFontSize(12);
        pdf.text("Identificação da Missão", 20, y);
        y += 6;

        pdf.setFontSize(10);
        pdf.text(`Piloto: ${data.metadata.pilot}`, 20, y); y += 6;
        pdf.text(`Observador: ${data.metadata.observer}`, 20, y); y += 6;
        pdf.text(`Unidade: ${data.metadata.unit}`, 20, y); y += 6;
        pdf.text(`RPAS: ${data.metadata.rpas}`, 20, y); y += 6;
        pdf.text(`Tipo de Missão: ${data.metadata.missionType}`, 20, y); y += 6;
        pdf.text(`Início: ${data.metadata.startTime}`, 20, y); y += 6;
        pdf.text(`Término: ${data.metadata.endTime}`, 20, y); y += 10;

        pdf.setFontSize(12);
        pdf.text("Status das Fases", 20, y);
        y += 6;

        pdf.setFontSize(10);
        Object.entries(data.phases).forEach(([fase, info]) => {
          pdf.text(
            `${fase.toUpperCase()} — ${info.completed ? "CONCLUÍDA" : "NÃO CONCLUÍDA"} ${info.completedAt ? "(" + info.completedAt + ")" : ""}`,
            20,
            y
          );
          y += 6;
        });

        y += 10;

        pdf.text(
          "Declaro que executei integralmente o checklist operacional RPAS conforme a doutrina vigente da Polícia Civil de Santa Catarina.",
          20,
          y,
          { maxWidth: 170 }
        );

        pdf.save("Checklist_Operacional_RPAS.pdf");
      };

      addLogo("assets/logos/pcsc.png", 20, () => {
        addLogo("assets/logos/saer.png", 45, () => {
          addLogo("assets/logos/coarp.png", 70, gerarConteudo);
        });
      });

    });
  }

});
