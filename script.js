/* ===============================
   VARIÁVEIS
================================ */
let viagens = JSON.parse(localStorage.getItem("viagens")) || [];
let indiceEdicao = null;

/* ===============================
   INICIAR
================================ */
window.onload = () => atualizarLista();

/* ===============================
   LOCALSTORAGE
================================ */
function salvarLocalStorage() {
  localStorage.setItem("viagens", JSON.stringify(viagens));
}

/* ===============================
   CADASTRAR / EDITAR
================================ */
function cadastrar() {
  let carro = Carro.value.trim();
  let linha = Linha.value.trim();
  let horario = Horario.value.trim();
  let motivo = Motivo.value.trim();
  let status = ativo.value;

  if (!carro || !linha || !horario || !motivo) {
    alert("Preencha todos os campos!");
    return;
  }

  let viagem = {
    carro,
    linha,
    horario,
    motivo,
    ativo: status === "true"
  };

  if (indiceEdicao === null) {
    viagens.push(viagem);
  } else {
    viagens[indiceEdicao] = viagem;
    indiceEdicao = null;
  }

  salvarLocalStorage();
  atualizarLista();
  limpar();
}

/* ===============================
   LISTAR
================================ */
function atualizarLista() {
  lista.innerHTML = "";

  viagens.forEach((v, i) => {
    lista.innerHTML += `
      <li>
        🚍 ${v.carro} | Linha ${v.linha} | ${v.horario} | ${v.motivo} | ${v.ativo ? "Ativo" : "Inativo"}
        <div>
          <button onclick="editar(${i})">✏️</button>
          <button onclick="remover(${i})">❌</button>
        </div>
      </li>
    `;
  });
}

/* ===============================
   EDITAR
================================ */
function editar(i) {
  let v = viagens[i];
  Carro.value = v.carro;
  Linha.value = v.linha;
  Horario.value = v.horario;
  Motivo.value = v.motivo;
  ativo.value = v.ativo ? "true" : "false";
  indiceEdicao = i;
}

/* ===============================
   REMOVER
================================ */
function remover(i) {
  viagens.splice(i, 1);
  salvarLocalStorage();
  atualizarLista();
}

/* ===============================
   LIMPAR
================================ */
function limpar() {
  Carro.value = "";
  Linha.value = "";
  Horario.value = "";
  Motivo.value = "";
  ativo.value = "true";
  indiceEdicao = null;
}

/* ===============================
   EXPORTAR EXCEL
================================ */
function exportarExcel() {
  if (!viagens.length) return alert("Nenhuma viagem cadastrada!");

  const dados = viagens.map(v => ({
    Carro: v.carro,
    Linha: v.linha,
    Horário: v.horario,
    Motivo: v.motivo,
    Status: v.ativo ? "Ativo" : "Inativo"
  }));

  const planilha = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, planilha, "Viagens");
  XLSX.writeFile(wb, "viagens.xlsx");
}

/* ===============================
   EXPORTAR PDF
================================ */
function exportarPDF() {
  if (!viagens.length) return alert("Nenhuma viagem cadastrada!");

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Relatório de Viagens", 10, 10);

  let y = 20;
  viagens.forEach((v, i) => {
    doc.text(`${i+1}. ${v.carro} | ${v.linha} | ${v.horario} | ${v.motivo}`, 10, y);
    y += 8;
  });

  doc.save("viagens.pdf");
}
