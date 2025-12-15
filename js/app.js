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
    version: "v1.7",
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

      if (!ok) {
        alert(`Conclua todos os itens da ${phase.toUpperCase()}.`);
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

  /* ===== BOTÕES ENCERRAR ===== */
  document.querySelectorAll(".btn-early-end").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const phase = btn.getAttribute("data-phase");
      if (phase) goToEarlyEnd(phase);
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
  let y = 115;

  /* ===== LOGOS ===== */
  const logoMainSize = 24;
  const logoSubSize = 18;

  const logoMainX = (pageWidth - logoMainSize) / 2;
  const logoSubGap = 20;
  const totalSubWidth = (logoSubSize * 2) + logoSubGap;
  const startSubX = (pageWidth - totalSubWidth) / 2;

  const logoPC = new Image();
  const logoSAER = new Image();
  const logoNOARP = new Image();

  logoPC.onload = () => {
    pdf.addImage(logoPC, "PNG", logoMainX, 15, logoMainSize, logoMainSize);

    pdf.setFontSize(10);
    pdf.text("ESTADO DE SANTA CATARINA", pageWidth / 2, 45, { align: "center" });
    pdf.text("POLÍCIA CIVIL", pageWidth / 2, 51, { align: "center" });
    pdf.text("DELEGACIA GERAL", pageWidth / 2, 57, { align: "center" });
    pdf.text(
      "NÚCLEO DE OPERAÇÕES AÉREAS REMOTAMENTE PILOTADAS",
      pageWidth / 2,
      63,
      { align: "center" }
    );

    logoSAER.onload = () => {
      pdf.addImage(logoSAER, "PNG", startSubX, 70, logoSubSize, logoSubSize);

      logoNOARP.onload = () => {
        pdf.addImage(
          logoNOARP,
          "PNG",
          startSubX + logoSubSize + logoSubGap,
          70,
          logoSubSize,
          logoSubSize
        );

        /* ===== TÍTULO ===== */
        pdf.setFontSize(12);
        pdf.text("CHECKLIST OPERACIONAL RPAS", pageWidth / 2, 100, {
          align: "center"
        });

        /* ===== CONTEÚDO ===== */
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
          pdf.text(data.metadata.operatorNotes, 20, y, { maxWidth: 170 });
          y+=10;
        }

        pdf.setFontSize(10);
        pdf.text("Hash SHA-256:", 20, y); y+=6;
        pdf.setFontSize(8);
        pdf.text(data.metadata.hash, 20, y, { maxWidth: 170 });

        /* ===== RODAPÉ ===== */
        pdf.setFontSize(7);
        pdf.text(
          "Centro Administrativo da SSP, Bloco B - Av. Gov. Ivo Silveira, 1521 - Capoeiras, Florianópolis - SC | CEP 88085-000 | Fone: (48) 3665-8488 | www.pc.sc.gov.br",
          pageWidth / 2,
          287,
          { align: "center", maxWidth: 180 }
        );

        pdf.save("Checklist_Operacional_RPAS.pdf");
      };

      logoNOARP.src = "assets/logos/noarp.png";
    };

    logoSAER.src = "assets/logos/saer.png";
  };

  logoPC.src = "assets/logos/pcsc.png";
}
