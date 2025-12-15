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

/* ===== UTIL ===== */
function persist() {
  localStorage.setItem("checklistRPAS_session", JSON.stringify(checklistSession));
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s =>
    s.classList.remove("active")
  );
  document.getElementById(screenId)?.classList.add("active");
}

/* ===== INICIAR CHECKLIST ===== */
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
window.goToEarlyEnd = goToEarlyEnd;

/* ===== GERAR HASH SHA-256 ===== */
async function gerarHashSHA256(data) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(JSON.stringify(data));
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/* ===== FORMATADORES ===== */
function formatDateBR(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");

  return `${dd}/${mm}/${yyyy} ${hh}:${mi}:${ss}`;
}

function phaseLabel(phaseKey) {
  const map = {
    phase1: "Fase 1 – Preparação para o Voo",
    phase2: "Fase 2 – Prevoo",
    phase3: "Fase 3 – Voo",
    phase4: "Fase 4 – Pós-Voo",
    phase5: "Fase 5 – Pós-Missão"
  };
  return map[phaseKey] || phaseKey || "";
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

      persist();
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

      if (!ok)
        return alert(`Conclua todos os itens da ${phase.toUpperCase()}.`);

      checklistSession.phases[phase].completed = true;
      checklistSession.phases[phase].completedAt = new Date().toISOString();

      if (phase === "phase5") {
        checklistSession.metadata.endTime = new Date().toISOString();
        persist();
        showScreen("pdfScreen");
      } else {
        persist();
        showScreen(`phase${i + 2}`);
      }
    });
  });

  /* Encerramento antecipado */
  document.getElementById("earlyEndForm")
    ?.addEventListener("submit", async e => {
      e.preventDefault();

      const reason = (document.getElementById("earlyEndReason")?.value || "").trim();
      const confirm = !!document.getElementById("earlyEndConfirm")?.checked;

      if (!reason || !confirm) {
        alert("Informe o motivo e confirme o encerramento antecipado.");
        return;
      }

      checklistSession.metadata.earlyEndReason = reason;
      checklistSession.metadata.endTime = new Date().toISOString();

      checklistSession.metadata.operatorNotes =
        (document.getElementById("operatorNotes")?.value || "").trim();

      checklistSession.metadata.hash =
        await gerarHashSHA256(checklistSession);

      persist();
      await gerarPDF(checklistSession);
    });

  /* Fluxo normal */
  document.getElementById("signatureForm")
    ?.addEventListener("submit", async e => {
      e.preventDefault();

      const name = (document.getElementById("signatureName")?.value || "").trim();
      const id = (document.getElementById("signatureId")?.value || "").trim();
      const confirm = !!document.getElementById("signatureConfirm")?.checked;

      if (!name || !id || !confirm) {
        alert("Preencha Nome, Matrícula e confirme a veracidade.");
        return;
      }

      checklistSession.metadata.signatureName = name;
      checklistSession.metadata.signatureId = id;

      checklistSession.metadata.operatorNotes =
        (document.getElementById("operatorNotes")?.value || "").trim();

      checklistSession.metadata.endTime =
        checklistSession.metadata.endTime || new Date().toISOString();

      checklistSession.metadata.hash =
        await gerarHashSHA256(checklistSession);

      persist();
      await gerarPDF(checklistSession);
    });

});

/* ===== PDF ===== */
async function gerarPDF(data) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const footerText =
    "Centro Administrativo da SSP, Bloco B - Av. Gov. Ivo Silveira, 1521 - Capoeiras, Florianópolis - SC | CEP 88085-000 | Fone: (48) 3665-8488 | www.pc.sc.gov.br";

  function loadImage(src) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  async function loadImageAny(paths) {
    for (const p of paths) {
      const img = await loadImage(p);
      if (img) return { img, path: p };
    }
    return { img: null, path: null };
  }

  const pcsc = await loadImageAny(["assets/logos/pcsc.png"]);
  const saer = await loadImageAny(["assets/logos/saer.png"]);
  const noarp = await loadImageAny(["assets/logos/noarp.png"]);

  /* Logo PCSC centralizado */
  if (pcsc.img) {
    pdf.addImage(pcsc.img, "PNG", (pageWidth / 2) - 12, 10, 24, 24);
  }

  /* Cabeçalho institucional */
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

  /* Logos SAER + NOARP (centralizados) */
  const duoY = 64;
  const duoSize = 18;
  const duoGap = 14;

  if (saer.img && noarp.img) {
    const duoTotal = (duoSize * 2) + duoGap;
    const duoStartX = (pageWidth - duoTotal) / 2;
    pdf.addImage(saer.img, "PNG", duoStartX, duoY, duoSize, duoSize);
    pdf.addImage(noarp.img, "PNG", duoStartX + duoSize + duoGap, duoY, duoSize, duoSize);
  } else if (saer.img) {
    pdf.addImage(saer.img, "PNG", (pageWidth / 2) - (duoSize / 2), duoY, duoSize, duoSize);
  } else if (noarp.img) {
    pdf.addImage(noarp.img, "PNG", (pageWidth / 2) - (duoSize / 2), duoY, duoSize, duoSize);
  }

  /* Título */
  const titleY = duoY + duoSize + 10;
  pdf.setFontSize(14);
  pdf.text("CHECKLIST OPERACIONAL RPAS", pageWidth / 2, titleY, { align: "center" });

  let y = titleY + 12;

  /* DADOS com data BR */
  pdf.setFontSize(10);
  pdf.text(`Piloto Remoto: ${data.metadata.pilot}`, 20, y); y += 6;
  pdf.text(`Observador: ${data.metadata.observer}`, 20, y); y += 6;
  pdf.text(`Unidade: ${data.metadata.unit}`, 20, y); y += 6;
  pdf.text(`RPAS: ${data.metadata.rpas}`, 20, y); y += 6;
  pdf.text(`Tipo de Missão: ${data.metadata.missionType}`, 20, y); y += 6;

  pdf.text(`Início: ${formatDateBR(data.metadata.startTime)}`, 20, y); y += 6;
  pdf.text(`Término: ${formatDateBR(data.metadata.endTime)}`, 20, y); y += 10;

  /* Encerramento antecipado com FASE em texto */
  if (data.metadata.endedEarly) {
    pdf.setFontSize(12);
    pdf.text("ENCERRAMENTO ANTECIPADO", 20, y); y += 6;
    pdf.setFontSize(10);

    const faseTxt = phaseLabel(data.metadata.endedAtPhase);
    pdf.text(`Fase: ${faseTxt}`, 20, y); y += 6;

    pdf.text(`Motivo: ${data.metadata.earlyEndReason}`, 20, y, { maxWidth: 170 });
    y += 10;
  }

  /* Observações */
  if (data.metadata.operatorNotes) {
    pdf.setFontSize(12);
    pdf.text("Observações do Operador", 20, y); y += 6;
    pdf.setFontSize(10);
    pdf.text(data.metadata.operatorNotes, 20, y, { maxWidth: 170 });
    y += 10;
  }

  /* Assinatura */
  if (data.metadata.signatureName || data.metadata.signatureId) {
    pdf.setFontSize(12);
    pdf.text("Assinatura do Operador", 20, y); y += 6;
    pdf.setFontSize(10);
    if (data.metadata.signatureName) { pdf.text(`Nome: ${data.metadata.signatureName}`, 20, y); y += 6; }
    if (data.metadata.signatureId) { pdf.text(`Matrícula: ${data.metadata.signatureId}`, 20, y); y += 8; }
  }

  /* Hash */
  pdf.setFontSize(9);
  pdf.text("HASH SHA-256:", 20, y); y += 5;
  pdf.setFontSize(8);
  pdf.text(data.metadata.hash || "(não gerado)", 20, y, { maxWidth: 170 });

  /* Rodapé */
  pdf.setFontSize(7);
  pdf.text(footerText, pageWidth / 2, pageHeight - 10, {
    align: "center",
    maxWidth: 180
  });

  pdf.save("Checklist_Operacional_RPAS.pdf");
}
