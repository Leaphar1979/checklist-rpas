/* =====================================================
   CHECKLIST OPERACIONAL RPAS
   PCSC · SAER · NOARP · COARP
   Fluxo completo + PDF institucional + HASH
   ===================================================== */

const checklistSession = {
  metadata: {
    checklistName: "Checklist Operacional RPAS",
    institution: "PCSC / SAER / NOARP",
    doctrine: "COARP",
    version: "v1.3",
    startTime: null,
    endTime: null,
    pilot: "",
    observer: "",
    unit: "",
    rpas: "",
    missionType: "",
    signatureName: "",
    signatureId: "",
    hash: "",

    /* ===== NOVOS CAMPOS (ENCERRAMENTO ANTECIPADO) ===== */
    endedEarly: false,
    endedAtPhase: null,
    earlyEndReason: ""
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
  document.querySelectorAll(".screen").forEach(s =>
    s.classList.remove("active")
  );
  document.getElementById(screenId)?.classList.add("active");
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

/* ===== GERAR HASH SHA-256 ===== */
async function gerarHashSHA256(data) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(JSON.stringify(data));
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/* ===== DOM READY ===== */
document.addEventListener("DOMContentLoaded", () => {

  /* Splash */
  document.getElementById("startBtn")
    ?.addEventListener("click", startChecklist);

  /* Missão */
  document.getElementById("missionForm")
    ?.addEventListener("submit", e => {
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

  /* ===== FASES ===== */
  ["phase1","phase2","phase3","phase4","phase5"].forEach((phase, i) => {
    const form = document.getElementById(`${phase}Form`);
    if (!form) return;

    form.addEventListener("submit", e => {
      e.preventDefault();

      const ok = [...form.querySelectorAll("input[type='checkbox']")]
        .every(cb => cb.checked);

      if (!ok)
        return alert(`Conclua todos os itens da ${phase.toUpperCase()}.`);

      checklistSession.phases[phase].completed = true;
      checklistSession.phases[phase].completedAt =
        new Date().toISOString();

      if (phase === "phase5") {
        checklistSession.metadata.endTime =
          new Date().toISOString();
        showScreen("pdfScreen");
      } else {
        showScreen(`phase${i + 2}`);
      }

      localStorage.setItem(
        "checklistRPAS_session",
        JSON.stringify(checklistSession)
      );
    });
  });

  /* ===== ASSINATURA + PDF ===== */
  document.getElementById("signatureForm")
    ?.addEventListener("submit", async e => {
      e.preventDefault();

      const name =
        document.getElementById("signatureName").value.trim();
      const id =
        document.getElementById("signatureId").value.trim();
      const confirm =
        document.getElementById("signatureConfirm").checked;

      if (!name || !id || !confirm) {
        alert("Preencha e confirme a assinatura.");
        return;
      }

      checklistSession.metadata.signatureName = name;
      checklistSession.metadata.signatureId = id;

      checklistSession.metadata.hash =
        await gerarHashSHA256(checklistSession);

      localStorage.setItem(
        "checklistRPAS_session",
        JSON.stringify(checklistSession)
      );

      gerarPDF(checklistSession);
    });

});

/* ===== PDF (SEM ALTERAÇÕES NESTE PASSO) ===== */
function gerarPDF(data) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  let y;

  const addLogo = (src, x, next) => {
    const img = new Image();
    img.onload = () => {
      pdf.addImage(img, "PNG", x, 15, 18, 18);
      if (next) next();
    };
    img.src = src;
  };

  const gerarConteudo = () => {

    pdf.setFontSize(16);
    pdf.text("CHECKLIST OPERACIONAL RPAS", 105, 45, { align: "center" });

    pdf.setFontSize(10);
    pdf.text(
      "Polícia Civil de Santa Catarina · SAER · NOARP · COARP",
      105,
      52,
      { align: "center" }
    );

    y = 65;

    pdf.setFontSize(12);
    pdf.text("Identificação da Missão", 20, y);
    y += 6;

    pdf.setFontSize(10);
    pdf.text(`Piloto Remoto: ${data.metadata.pilot}`, 20, y); y += 6;
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
        `${fase.toUpperCase()} — ${info.completed ? "CONCLUÍDA" : "NÃO CONCLUÍDA"} ${
          info.completedAt ? "(" + info.completedAt + ")" : ""
        }`,
        20,
        y
      );
      y += 6;
    });

    y += 10;

    pdf.setFontSize(12);
    pdf.text("Assinatura do Operador", 20, y);
    y += 6;

    pdf.setFontSize(10);
    pdf.text(`Nome: ${data.metadata.signatureName}`, 20, y); y += 6;
    pdf.text(`Matrícula: ${data.metadata.signatureId}`, 20, y); y += 10;

    pdf.setFontSize(12);
    pdf.text("Hash de Integridade (SHA-256)", 20, y);
    y += 6;

    pdf.setFontSize(8);
    pdf.text(data.metadata.hash, 20, y, { maxWidth: 170 });

    pdf.save("Checklist_Operacional_RPAS.pdf");
  };

  addLogo("assets/logos/pcsc.png", 35, () => {
    addLogo("assets/logos/saer.png", 70, () => {
      addLogo("assets/logos/coarp.png", 105, gerarConteudo);
    });
  });
}
