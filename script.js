// Conecta ao servidor via WebSocket
const socket = io();

let currentLeads = [];
let isExtracting = false;

// Manipula o envio do formulário
document.getElementById('extractForm').addEventListener('submit', (e) => {
  e.preventDefault();

  if (isExtracting) return;

  const nicho = document.getElementById('nicho').value.trim();
  const regiao = document.getElementById('regiao').value.trim();
  const quantidade = parseInt(document.getElementById('quantidade').value);

  // Validação
  if (!nicho || !regiao || !quantidade) {
    showMessage('Por favor, preencha todos os campos!', 'error');
    return;
  }

  if (quantidade < 1 || quantidade > 100) {
    showMessage('A quantidade deve estar entre 1 e 100', 'error');
    return;
  }

  startExtraction(nicho, regiao, quantidade);
});

function startExtraction(nicho, regiao, quantidade) {
  isExtracting = true;

  // Limpa resultados anteriores
  currentLeads = [];
  document.getElementById('resultsBody').innerHTML = '';
  document.getElementById('totalResults').textContent = '0 contatos';
  document.getElementById('statusMessage').style.display = 'none';

  // Mostra barra de progresso
  document.getElementById('progressBar').style.display = 'block';
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('progressPercent').textContent = '0%';
  document.getElementById('progressText').textContent = 'Iniciando...';

  // Mostra seção de resultados
  document.getElementById('resultsSection').style.display = 'block';

  // Desabilita botão
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoader.style.display = 'flex';

  // Inicia extração via WebSocket
  socket.emit('start-extraction', { nicho, regiao, quantidade });
}

// Recebe novo lead em tempo real
socket.on('new-lead', (lead) => {
  currentLeads.push(lead);
  addLeadToTable(lead);
  updateCounter();

  // Scroll automático para o último item
  const resultsSection = document.getElementById('resultsSection');
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
});

// Recebe progresso
socket.on('progress', (progress) => {
  const progressFill = document.getElementById('progressFill');
  const progressPercent = document.getElementById('progressPercent');
  const progressText = document.getElementById('progressText');

  progressFill.style.width = `${progress.percent}%`;
  progressPercent.textContent = `${progress.percent}%`;
  progressText.textContent = progress.status;
});

// Extração completa
socket.on('extraction-complete', (data) => {
  isExtracting = false;

  // Reabilita botão
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');
  submitBtn.disabled = false;
  btnText.style.display = 'inline';
  btnLoader.style.display = 'none';

  showMessage(`Extração finalizada! ${currentLeads.length} contatos coletados.`, 'success');

  // Esconde barra de progresso após 3 segundos
  setTimeout(() => {
    document.getElementById('progressBar').style.display = 'none';
  }, 3000);
});

// Erro na extração
socket.on('extraction-error', (data) => {
  isExtracting = false;

  // Reabilita botão
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');
  submitBtn.disabled = false;
  btnText.style.display = 'inline';
  btnLoader.style.display = 'none';

  showMessage(`Erro: ${data.message}`, 'error');
  document.getElementById('progressBar').style.display = 'none';
});

// Adiciona lead na tabela
function addLeadToTable(lead) {
  const tbody = document.getElementById('resultsBody');

  const row = document.createElement('tr');
  row.className = 'new-row'; // Para animação
  row.innerHTML = `
    <td>${lead.index}</td>
    <td>${escapeHtml(lead.nome)}</td>
    <td>${escapeHtml(lead.telefone)}</td>
    <td>${escapeHtml(lead.endereco)}</td>
  `;

  tbody.appendChild(row);

  // Remove classe de animação após 1 segundo
  setTimeout(() => {
    row.classList.remove('new-row');
  }, 1000);
}

// Atualiza contador
function updateCounter() {
  const total = currentLeads.length;
  document.getElementById('totalResults').textContent = `${total} contato${total !== 1 ? 's' : ''}`;
}

// Exibe mensagem de status
function showMessage(message, type) {
  const statusDiv = document.getElementById('statusMessage');
  statusDiv.textContent = message;
  statusDiv.className = `status-message ${type}`;
  statusDiv.style.display = 'flex';

  if (type === 'success' || type === 'error') {
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 5000);
  }
}

// Exporta para CSV
function exportToCSV() {
  if (currentLeads.length === 0) {
    showMessage('Nenhum dado para exportar', 'error');
    return;
  }

  let csv = 'Número,Nome,Telefone,Endereço\n';

  currentLeads.forEach((lead, index) => {
    csv += `${index + 1},"${lead.nome}","${lead.telefone}","${lead.endereco}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  const nicho = document.getElementById('nicho').value.trim();
  const regiao = document.getElementById('regiao').value.trim();
  const filename = `leads_${nicho}_${regiao}_${new Date().getTime()}.csv`;

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showMessage('Arquivo CSV exportado com sucesso!', 'success');
}

// Copia para área de transferência
function copyToClipboard() {
  if (currentLeads.length === 0) {
    showMessage('Nenhum dado para copiar', 'error');
    return;
  }

  let text = 'Nome\tTelefone\tEndereço\n';

  currentLeads.forEach(lead => {
    text += `${lead.nome}\t${lead.telefone}\t${lead.endereco}\n`;
  });

  navigator.clipboard.writeText(text).then(() => {
    showMessage('Dados copiados para a área de transferência!', 'success');
  }).catch(err => {
    showMessage('Erro ao copiar dados', 'error');
    console.error('Erro:', err);
  });
}

// Escapa HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Validação em tempo real
document.getElementById('quantidade').addEventListener('input', (e) => {
  const value = parseInt(e.target.value);
  if (value > 100) {
    e.target.value = 100;
  } else if (value < 1) {
    e.target.value = 1;
  }
});
