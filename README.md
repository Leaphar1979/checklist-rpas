# Checklist Operacional RPAS

**COARP · NOARP · SAER · PCSC**

---

## 📌 Finalidade

Este repositório contém um **WebApp institucional** destinado à execução e ao registro do **Checklist Operacional de Aeronaves Remotamente Pilotadas (RPAS)** no âmbito da **Polícia Civil de Santa Catarina**.

O aplicativo foi desenvolvido como **ferramenta de apoio operacional**, com foco em:

- padronização da execução do checklist;
- redução de erro humano durante a operação;
- registro temporal das fases do procedimento;
- cadeia de custódia digital do checklist;
- geração de documento institucional (PDF) para fins de registro administrativo e controle interno.

🔗 **Acesso ao aplicativo:**  
👉 https://leaphar1979.github.io/checklist-rpas/

---

## ⚖️ Base Normativa e Legal

O conteúdo do checklist segue **integralmente**, sem supressão, criação ou modificação de itens, a doutrina e as normativas vigentes, em especial:

- **Resolução nº 05/GAB/DGPC/PCSC**, de 03 de março de 2023  
  *(Publicada no DOE nº 21.975, de 08/03/2023)*  
  — Regulamenta o uso de Aeronaves Remotamente Pilotadas (RPAS) no âmbito da Polícia Civil de Santa Catarina e institui o NOARP;

- **Doutrina COARP** — Curso de Operador de Aeronaves Remotamente Pilotadas;

- Diretrizes operacionais do **NOARP / SAER / PCSC**;

- Normas aplicáveis da **ANAC**, **DECEA** e **ANATEL**, relativas ao uso do espaço aéreo, segurança operacional e telecomunicações.

⚠️ **Este aplicativo não substitui, altera ou cria normas operacionais**, servindo exclusivamente como instrumento de apoio à execução da doutrina vigente.

---

## 🧭 Responsabilidade Operacional

Este aplicativo **não autoriza voo**.

A decisão de decolagem, condução da missão e pouso é **exclusiva do Piloto em Comando**, que permanece integralmente responsável pela operação da aeronave, nos termos da legislação aeronáutica, da doutrina institucional e das normas internas da PCSC.

---

## 🔢 Numeração Oficial do Checklist

A numeração oficial dos itens do checklist:

- é preservada internamente no sistema, para fins de rastreabilidade e auditoria;
- pode ser exibida nos documentos técnicos (PDF);
- pode não ser exibida na interface do aplicativo, por decisão de usabilidade.

Essa opção **não altera conteúdo, ordem ou doutrina**, tendo como único objetivo melhorar a clareza visual e reduzir erro humano durante a execução operacional.

---

## 🗂️ Cadeia de Custódia Digital

O aplicativo registra automaticamente:

- data e hora de início do checklist;
- identificação da missão;
- data e hora de conclusão de cada fase;
- encerramento formal do procedimento;
- declaração final de cumprimento integral do checklist;
- assinatura do operador;
- hash criptográfico (SHA-256) para garantia de integridade.

Esses dados são utilizados para a geração de **PDF institucional**, destinado exclusivamente a registro administrativo, controle interno e eventual auditoria.

---

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- Web Crypto API (SHA-256)
- jsPDF (geração de PDF)
- Armazenamento local (localStorage)

O projeto é compatível com:

- celular (Android / iOS);
- tablet;
- computador (desktop).

---

## 🚧 Status do Projeto

- ✔ Checklist operacional completo
- ✔ Fluxo de fases implementado
- ✔ Cadeia de custódia digital funcional
- ✔ Assinatura do operador
- ✔ Hash de integridade (SHA-256)
- ✔ Geração de PDF institucional
- 🚧 PWA instalável (em fase final de implementação)

---

## 🔒 Licença e Uso Institucional

Este repositório e o aplicativo dele derivado destinam-se **exclusivamente ao uso institucional da Polícia Civil de Santa Catarina**, em especial no âmbito do **NOARP / SAER**.

🔴 **É vedada** a reprodução, redistribuição, adaptação, compartilhamento externo ou uso por terceiros **sem autorização formal da gestão competente**.

🔴 O conteúdo operacional não poderá ser alterado sem respaldo normativo ou orientação institucional expressa.

📄 **Licença:**  
Creative Commons **CC BY-NC-ND 4.0**  
(Atribuição · Uso Não Comercial · Vedada a Criação de Obras Derivadas)

---

## 📄 Observação Final

Este projeto poderá sofrer atualizações futuras **exclusivamente** para:

- adequação a novas versões da doutrina;
- melhorias de usabilidade;
- correções técnicas ou de segurança.

Qualquer alteração de conteúdo operacional dependerá de **orientação formal da gestão competente**.
