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

    /* Encerramento antecipado */
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

/* ===== HASH SHA-256 ===== */
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

  /* Fases */
  ["phase1","phase2","phase3","phase4","phase5"].forEach((phase, i) => {
    const form = document.getElementById(`${phase}Form`);
    if (!form) return;

    form.addEventListener("submit", e => {
      e.preventDefault();

      const ok = [...form.querySelectorAll("input[type='checkbox']")]
        .every(cb => cb.checked);

      if (!ok) {
        alert("Conclua todos os itens da fase.");
        return;
      }

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

  /* ===== BOTÃO ENCERRAMENTO ANTECIPADO ===== */
  document.getElementById("confirmEarlyEndBtn")
    ?.addEventListener("click", async () => {

      const reason =
        document.getElementById("earlyEndReason").value.trim();
      const confirm =
        document.getElementById("earlyEndConfirm").checked;

      if (!reason || !confirm) {
        alert("Informe o motivo e confirme o encerramento.");
        return;
      }

      checklistSession.metadata.earlyEndReason = reason;
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

  /* ===== BOTÃO ASSINATURA NORMAL ===== */
  document.getElementById("confirmSignatureBtn")
    ?.addEventListener("click", async () => {

      const name =
        document.getElementById("signatureName").value.trim();
      const id =
        document.getElementById("signatureId").value.trim();
      const confirm =
        document.getElementById("signatureConfirm").checked;

      if (!name || !id || !confirm) {
        alert("Preencha os dados e confirme a assinatura.");
        return;
      }

      checklistSession.metadata.signatureName = name;
      checklistSession.metadata.signatureId = id;
      checklistSession.metadata.operatorNotes =
        document.getElementById("operatorNotes").value.trim();
      checklistSession.metadata.endTime =
        new Date().toISOString();

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

  const pageWidth = pdf.internal.pageSize.getWidth();
  let y = 80;

  /* LOGOS */
  const logoSize = 18;
  const gap = 12;
  const total = logoSize * 3 + gap * 2;
  const startX = (pageWidth - total) / 2;

  const addLogo = (src, x, next) => {
    const img = new Image();
    img.onload = () => {
      pdf.addImage(img, "PNG", x, 20, logoSize, logoSize);
      if (next) next();
    };
    img.src = src;
  };

  const conteudo = () => {

    pdf.setFontSize(12);
    pdf.text("ESTADO DE SANTA CATARINA", pageWidth/2, 50, { align: "center" });
    pdf.text("POLÍCIA CIVIL", pageWidth/2, 56, { align: "center" });
    pdf.text("DELEGACIA GERAL", pageWidth/2, 62, { align: "center" });
    pdf.text(
      "NÚCLEO DE OPERAÇÕES AÉREAS REMOTAMENTE PILOTADAS",
      pageWidth/2,
      68,
      { align: "center" }
    );

    pdf.setFontSize(14);
    pdf.text("CHECKLIST OPERACIONAL RPAS", pageWidth/2, 78, {
      align: "center"
    });

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
      pdf.text(`Motivo: ${data.metadata.earlyEndReason}`, 20, y, {
        maxWidth: 170
      });
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
    pdf.text(
      "Centro Administrativo da SSP, Bloco B - Av. Gov. Ivo Silveira, 1521 - Capoeiras, Florianópolis - SC | CEP 88085-000 | Fone: (48) 3665-8488 | www.pc.sc.gov.br",
      pageWidth/2,
      285,
      { align: "center", maxWidth: 180 }
    );

    pdf.save("Checklist_Operacional_RPAS.pdf");
  };

  addLogo("assets/logos/pcsc.png", startX, () => {
    addLogo("assets/logos/saer.png", startX + logoSize + gap, () => {
      addLogo("assets/logos/noarp.png", startX + (logoSize + gap) * 2, conteudo);
    });
  });
}
