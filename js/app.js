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
    version: "v1.6",
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

/* ===== NAVEGAÇÃO ===== */
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s =>
    s.classList.remove("active")
  );
  document.getElementById(screenId)?.classList.add("active");
}

/* ===== INÍCIO ===== */
function startChecklist() {
  checklistSession.metadata.startTime = new Date().toISOString();
  persist();
  showScreen("mission");
}

/* ===== ENCERRAMENTO ANTECIPADO ===== */
function goToEarlyEnd(phase) {
  checklistSession.metadata.endedEarly = true;
  checklistSession.metadata.endedAtPhase = phase;
  persist();
  showScreen("earlyEndScreen");
}

/* ===== HASH ===== */
async function gerarHashSHA256(data) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(JSON.stringify(data));
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

function persist() {
  localStorage.setItem(
    "checklistRPAS_session",
    JSON.stringify(checklistSession)
  );
}

/* ===== DOM ===== */
document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("startBtn")
    ?.addEventListener("click", startChecklist);

  document.getElementById("missionForm")
    ?.addEventListener("submit", e => {
      e.preventDefault();

      checklistSession.metadata.pilot = pilot.value;
      checklistSession.metadata.observer = observer.value;
      checklistSession.metadata.unit = unit.value;
      checklistSession.metadata.rpas = rpas.value;
      checklistSession.metadata.missionType = missionType.value;

      persist();
      showScreen("phase1");
    });

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
      checklistSession.phases[phase].completedAt = new Date().toISOString();

      if (phase === "phase5") {
        checklistSession.metadata.endTime = new Date().toISOString();
        showScreen("pdfScreen");
      } else {
        showScreen(`phase${i + 2}`);
      }

      persist();
    });
  });

  document.getElementById("confirmEarlyEndBtn")
    ?.addEventListener("click", async () => {

      const reason = earlyEndReason.value.trim();
      if (!reason || !earlyEndConfirm.checked) {
        alert("Informe o motivo e confirme o encerramento.");
        return;
      }

      checklistSession.metadata.earlyEndReason = reason;
      checklistSession.metadata.endTime = new Date().toISOString();
      checklistSession.metadata.operatorNotes =
        operatorNotes?.value.trim() || "";

      checklistSession.metadata.hash =
        await gerarHashSHA256(checklistSession);

      persist();
      gerarPDF(checklistSession);
    });

  document.getElementById("confirmSignatureBtn")
    ?.addEventListener("click", async () => {

      if (!signatureConfirm.checked) {
        alert("Confirme a assinatura.");
        return;
      }

      checklistSession.metadata.signatureName = signatureName.value.trim();
      checklistSession.metadata.signatureId = signatureId.value.trim();
      checklistSession.metadata.operatorNotes = operatorNotes.value.trim();
      checklistSession.metadata.endTime = new Date().toISOString();

      checklistSession.metadata.hash =
        await gerarHashSHA256(checklistSession);

      persist();
      gerarPDF(checklistSession);
    });
});

/* ===== PDF ===== */
function gerarPDF(data) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  let y = 70;

  /* LOGO PCSC */
  const logo = new Image();
  logo.src = "assets/logos/pcsc.png";
  logo.onload = () => {
    pdf.addImage(logo, "PNG", pageWidth / 2 - 12, 10, 24, 24);
    render();
  };

  function render() {

    pdf.setFontSize(10);
    pdf.text("ESTADO DE SANTA CATARINA", pageWidth / 2, 42, { align: "center" });
    pdf.text("POLÍCIA CIVIL", pageWidth / 2, 48, { align: "center" });
    pdf.text("DELEGACIA GERAL", pageWidth / 2, 54, { align: "center" });
    pdf.text(
      "NÚCLEO DE OPERAÇÕES AÉREAS REMOTAMENTE PILOTADAS",
      pageWidth / 2,
      60,
      { align: "center" }
    );

    pdf.setFontSize(14);
    pdf.text("CHECKLIST OPERACIONAL RPAS", pageWidth / 2, y, { align: "center" });
    y += 10;

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
      pdf.text(`Motivo: ${data.metadata.earlyEndReason}`, 20, y, { maxWidth: 170 });
      y+=10;
    }

    if (data.metadata.operatorNotes) {
      pdf.setFontSize(12);
      pdf.text("Observações do Operador", 20, y); y+=6;
      pdf.setFontSize(10);
      pdf.text(data.metadata.operatorNotes, 20, y, { maxWidth: 170 });
      y+=10;
    }

    pdf.setFontSize(8);
    pdf.text(`HASH SHA-256: ${data.metadata.hash}`, 20, y, { maxWidth: 170 });

    pdf.setFontSize(7);
    pdf.text(
      "Centro Administrativo da SSP, Bloco B - Av. Gov. Ivo Silveira, 1521 - Capoeiras, Florianópolis - SC | CEP 88085-000 | Fone: (48) 3665-8488 | www.pc.sc.gov.br",
      pageWidth / 2,
      285,
      { align: "center", maxWidth: 180 }
    );

    pdf.save("Checklist_Operacional_RPAS.pdf");
  }
}
