async function enviarMensagem() {
  const input = document.getElementById('user-input');
  const mensagem = input.value.trim();
  if (!mensagem) return;

  adicionarMensagem('user', mensagem);
  input.value = '';

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: mensagem })
    });

    const data = await res.json();
    adicionarMensagem('bot', data.reply || 'Sem resposta.');
  } catch (err) {
    adicionarMensagem('bot', 'Erro ao comunicar com a IA.');
  }
}

function adicionarMensagem(tipo, texto) {
  const chatBox = document.getElementById('chat-box');
  const div = document.createElement('div');
  div.className = `message ${tipo}`;
  div.innerHTML = `<span>${texto}</span>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function resetarConversa() {
  await fetch('/api/reset', { method: 'POST' });
  document.getElementById('chat-box').innerHTML = '';
}