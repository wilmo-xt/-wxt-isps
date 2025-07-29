async function buscar() {
  const termo = document.getElementById('busca').value.trim();
  if (!termo) return alert('Digite o nome de um app.');

  const resposta = await fetch(`/api/aptoide?q=${encodeURIComponent(termo)}`);
  const dados = await resposta.json();

  const resultadosDiv = document.getElementById('resultados');
  resultadosDiv.innerHTML = '';

  if (!Array.isArray(dados) || dados.length === 0) {
    resultadosDiv.innerHTML = '<p>Nenhum resultado encontrado.</p>';
    return;
  }

  dados.forEach(app => {
    resultadosDiv.innerHTML += `
      <div class="card" style="border:1px solid #ccc;padding:10px;margin-bottom:10px;border-radius:10px;display:flex;gap:10px;background:#1a1a1a;color:white;">
        <img src="${app.icon}" alt="icon" style="width:64px;height:64px;border-radius:12px;">
        <div>
          <h3 style="margin:0;">${app.name}</h3>
          <p style="margin:2px 0;"><strong>Versão:</strong> ${app.version}</p>
          <p style="margin:2px 0;"><strong>Pacote:</strong> ${app.package}</p>
          <p style="margin:2px 0;"><strong>Tamanho:</strong> ${app.size}</p>
          <p style="margin:2px 0;"><strong>Downloads:</strong> ${app.downloads.toLocaleString()}</p>
          <p style="margin:2px 0;"><strong>Avaliação:</strong> ${app.rating} ⭐</p>
          <a href="${app.downloadUrl}" style="margin-top:6px;display:inline-block;padding:6px 12px;background:#0f0;color:#000;text-decoration:none;border-radius:6px;">⬇️ Baixar APK</a>
        </div>
      </div>
    `;
  });
}