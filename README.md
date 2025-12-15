# Checklist Operacional RPAS

COARP · NOARP · SAER · PCSC

## 📌 Finalidade

Este aplicativo (PWA) é uma ferramenta **institucional** destinada à execução e ao registro do **Checklist Operacional de Aeronaves Remotamente Pilotadas (RPAS)** no âmbito da Polícia Civil de Santa Catarina.

Objetivos principais:
- padronizar a execução do checklist operacional;
- registrar temporalmente as fases e o encerramento;
- fortalecer a cadeia de custódia digital do procedimento;
- gerar relatório em PDF para registro e controle administrativo.

## ✅ Acesso ao Aplicativo (PWA)

Acesse pelo navegador e, se desejado, instale na tela inicial (modo aplicativo):

**Acesso:** https://leaphar1979.github.io/checklist-rpas/

## ⚖️ Base Normativa

O conteúdo do checklist segue **integralmente** a doutrina e as normativas vigentes, **sem supressão ou criação de itens**, em especial:

- **Resolução nº 05/GAB/DGPC/PCSC, de 03 de março de 2023** (publicada no DOE 21975 de 08/03/2023);
- Doutrina COARP – Curso de Operador de Aeronaves Remotamente Pilotadas;
- Diretrizes NOARP / SAER / PCSC;
- Normas ANAC, DECEA e ANATEL aplicáveis ao uso de RPAS.

⚠️ Este aplicativo **não substitui** normas operacionais, **não cria** doutrina e **não autoriza voo**.

## 🧭 Responsabilidade Operacional

A decisão de decolagem, condução da missão e pouso é **exclusiva do Piloto em Comando**, que permanece integralmente responsável pela operação da aeronave, nos termos da legislação e da doutrina vigente.

## 🗂️ Cadeia de Custódia Digital e Integridade

O aplicativo registra automaticamente:
- data/hora de início;
- identificação da missão;
- conclusão de cada fase (quando aplicável);
- encerramento (normal ou antecipado, com justificativa);
- declaração final do operador;
- hash SHA-256 do registro (integridade).

O relatório PDF é gerado para **uso administrativo interno**, conforme diretrizes institucionais.

## 🔢 Numeração do Checklist

A numeração oficial:
- é preservada internamente para rastreabilidade/auditoria;
- pode ser exibida no PDF quando necessário;
- pode não ser exibida na interface por decisão de usabilidade, sem alterar conteúdo, ordem ou doutrina.

## 🔒 Uso Institucional e Restrições

Uso **exclusivamente institucional** (NOARP/SAER/PCSC).

É **vedado**:
- divulgar externamente;
- compartilhar arquivos/relatórios fora dos canais autorizados;
- reproduzir, modificar ou distribuir o aplicativo sem autorização formal da gestão competente.

## 🛠️ Tecnologias

- HTML5, CSS3, JavaScript (Vanilla)
- jsPDF (PDF)
- localStorage (armazenamento local)
- PWA (Service Worker + Manifest)

Compatível com:
- Android / iOS (Safari / Chrome)
- tablet
- computador

## 👤 Contato do Desenvolvedor

Desenvolvedor: **Raphael Serafim** — Agente de Polícia (PCSC)  
Contato (Telegram): **@Leapharr**

## 📄 Atualizações

O projeto poderá sofrer atualizações futuras, exclusivamente para:
- adequação a novas versões da doutrina;
- melhorias de usabilidade;
- correções técnicas.

Qualquer alteração de conteúdo operacional dependerá de orientação formal da gestão competente.
