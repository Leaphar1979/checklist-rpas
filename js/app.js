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
    version: "v1.5",
    startTime: null,
    endTime: null,
    pilot: "",
    observer: "",
    unit: "",
    rpas: "",
    missionType: "",
    signatureName: "",
    signatureId: "",
    operatorNotes: "",
    hash: "",

    /* ===== ENCERRAMENTO ANTECIPADO ===== */
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

/* ===== ENCERRAMENTO ANTECIPADO ===== */
function goToEarlyEnd(phase) {
  checklistSession.metadata.endedEarly = true;
  checklistSession.metadata.endedAtPhase = phase;

  localStorage.setItem(
    "checklistRPAS_session",
    JSON.stringify(checklistSession)
  );

  showScreen("earlyEndScreen");
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

  /* ===== ENCERRAMENTO ANTECIPADO ===== */
  document.getElementById("earlyEndForm")
    ?.addEventListener("submit", async e => {
      e.preventDefault();

      checklistSession.metadata.earlyEndReason =
        document.getElementById("earlyEndReason").value.trim();
      checklistSession.metadata.endTime =
        new Date().toISOString();

      checklistSession.metadata.operatorNotes =
        document.getElementById("operatorNotes")?.value.trim() || "";

      checklistSession.metadata.hash =
        await gerarHashSHA256(checklistSession);

      localStorage.setItem(
        "checklistRPAS_session",
        JSON.stringify(checklistSession)
      );

      gerarPDF(checklistSession);
    });

  /* ===== FLUXO NORMAL ===== */
  document.getElementById("signatureForm")
    ?.addEventListener("submit", async e => {
      e.preventDefault();

      checklistSession.metadata.signatureName =
        document.getElementById("signatureName").value.trim();
      checklistSession.metadata.signatureId =
        document.getElementById("signatureId").value.trim();

      checklistSession.metadata.operatorNotes =
        document.getElementById("operatorNotes").value.trim();

      checklistSession.metadata.hash =
        await gerarHashSHA256(checklistSession);

      localStorage.setItem(
        "checklistRPAS_session",
        JSON.stringify(checklistSession)
      );

      gerarPDF(checklistSession);
    });

});

/* ===== PDF ===== */
function gerarPDF(data) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  let y = 65;

const pageWidth = pdf.internal.pageSize.getWidth();

/* ===== LOGOS CENTRALIZADOS ===== */
const logoSize = 18;
const logoGap = 12;
const totalLogoWidth = (logoSize * 3) + (logoGap * 2);
const startX = (pageWidth - totalLogoWidth) / 2;
const logoY = 15;

const addLogo = (src, x, next) => {
  const img = new Image();
  img.onload = () => {
    pdf.addImage(img, "PNG", x, logoY, logoSize, logoSize);
    if (next) next();
  };
  img.src = src;
};

/* ===== CONTEÚDO DO PDF ===== */
const gerarConteudo = () => {

  const titleY = logoY + logoSize + 12;

  pdf.setFontSize(16);
  pdf.text("CHECKLIST OPERACIONAL RPAS", pageWidth / 2, titleY, {
    align: "center"
  });

  pdf.setFontSize(10);
  pdf.text(
    "Polícia Civil de Santa Catarina · SAER · NOARP · COARP",
    pageWidth / 2,
    titleY + 7,
    { align: "center" }
  );

    pdf.setFontSize(10);
    pdf.text(`Piloto: ${data.metadata.pilot}`, 20, y); y+=6;
    pdf.text(`Unidade: ${data.metadata.unit}`, 20, y); y+=6;
    pdf.text(`Início: ${data.metadata.startTime}`, 20, y); y+=6;
    pdf.text(`Término: ${data.metadata.endTime}`, 20, y); y+=10;

    if (data.metadata.endedEarly) {
      pdf.setFontSize(12);
      pdf.text("ENCERRAMENTO ANTECIPADO", 20, y); y+=6;
      pdf.setFontSize(10);
      pdf.text(`Fase: ${data.metadata.endedAtPhase}`, 20, y); y+=6;
      pdf.text(
        `Motivo: ${data.metadata.earlyEndReason}`,
        20,
        y,
        { maxWidth: 170 }
      );
      y+=10;
    }

    if (data.metadata.operatorNotes) {
      pdf.setFontSize(12);
      pdf.text("Observações do Operador", 20, y); y+=6;
      pdf.setFontSize(10);
      pdf.text(
        data.metadata.operatorNotes,
        20,
        y,
        { maxWidth: 170 }
      );
      y+=10;
    }

    pdf.setFontSize(10);
    pdf.text("Hash SHA-256:", 20, y); y+=6;
    pdf.setFontSize(8);
    pdf.text(data.metadata.hash, 20, y, { maxWidth: 170 });

    pdf.save("Checklist_Operacional_RPAS.pdf");
  };

 addLogo("assets/logos/pcsc.png", startX, () => {
  addLogo("assets/logos/saer.png", startX + logoSize + logoGap, () => {
    addLogo(
      "assets/logos/coarp.png",
      startX + (logoSize + logoGap) * 2,
      gerarConteudo
    );
  });
});
