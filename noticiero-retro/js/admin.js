const AdminUI = (() => {
  const state = AppState.getState;

  function render() {
    const allNews = state().news;
    const html = `
      <div class="admin-panel">
        <h3>Panel de Administración</h3>
        <button id="add-news-btn">+ Añadir noticia</button>
        <table>
          <thead><tr><th>Título</th><th>Categoría</th><th>Fecha</th><th>Acciones</th></tr></thead>
          <tbody>
            ${allNews.map(n => `
              <tr>
                <td>${n.title}</td>
                <td>${n.category}</td>
                <td>${n.date}</td>
                <td>
                  <button data-id="${n.id}" class="edit-btn">Editar</button>
                  <button data-id="${n.id}" class="delete-btn">Borrar</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div id="form-container"></div>
      </div>
    `;
    renderInto('#page-content', html);
    document.getElementById('add-news-btn').addEventListener('click', () => showForm());
    document.querySelectorAll('.edit-btn').forEach(b => b.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      const news = state().news.find(n => n.id === id);
      showForm(news);
    }));
    document.querySelectorAll('.delete-btn').forEach(b => b.addEventListener('click', (e) => {
      deleteNews(e.target.dataset.id);
    }));
  }

  function showForm(newsItem = null) {
    const editing = !!newsItem;
    AppState.setState({ isEditing: editing, editingNewsId: editing ? newsItem.id : null });
    const formHtml = `
      <div class="form-modal">
        <h4>${editing ? 'Editar' : 'Nueva'} noticia</h4>
        <input type="text" id="n-title" placeholder="Título" value="${editing ? newsItem.title : ''}">
        <textarea id="n-summary" placeholder="Resumen">${editing ? newsItem.summary : ''}</textarea>
        <textarea id="n-content" placeholder="Contenido completo">${editing ? newsItem.content : ''}</textarea>
        <input type="url" id="n-image" placeholder="URL de imagen" value="${editing ? newsItem.image : ''}">
        <select id="n-category">
          <option value="lanzamientos" ${editing && newsItem.category==='lanzamientos'?'selected':''}>Lanzamientos</option>
          <option value="reviews" ${editing && newsItem.category==='reviews'?'selected':''}>Reviews</option>
          <option value="esports" ${editing && newsItem.category==='esports'?'selected':''}>eSports</option>
          <option value="hardware" ${editing && newsItem.category==='hardware'?'selected':''}>Hardware</option>
          <option value="indie" ${editing && newsItem.category==='indie'?'selected':''}>Indie</option>
        </select>
        <input type="date" id="n-date" value="${editing ? newsItem.date : new Date().toISOString().slice(0,10)}">
        <input type="text" id="n-author" placeholder="Autor" value="${editing ? newsItem.author : ''}">
        <input type="checkbox" id="n-featured" ${editing && newsItem.featured ? 'checked' : ''}> Destacada
        <button id="save-news">Guardar</button>
        <button id="cancel-form">Cancelar</button>
      </div>
    `;
    document.getElementById('form-container').innerHTML = formHtml;
    document.getElementById('save-news').addEventListener('click', saveNews);
    document.getElementById('cancel-form').addEventListener('click', () => {
      document.getElementById('form-container').innerHTML = '';
    });
  }

  function saveNews() {
    const id = AppState.getState().editingNewsId || 'noticia-' + Date.now();
    const newsItem = {
      id: id,
      title: document.getElementById('n-title').value,
      summary: document.getElementById('n-summary').value,
      content: document.getElementById('n-content').value,
      image: document.getElementById('n-image').value || 'https://picsum.photos/id/100/800/400',
      category: document.getElementById('n-category').value,
      date: document.getElementById('n-date').value,
      author: document.getElementById('n-author').value,
      platforms: ['PC', 'PS5'], // simplificación
      featured: document.getElementById('n-featured').checked
    };
    const currentState = AppState.getState();
    let updatedNews;
    if (currentState.editingNewsId) {
      updatedNews = currentState.news.map(n => n.id === id ? newsItem : n);
    } else {
      updatedNews = [...currentState.news, newsItem];
    }
    AppState.setState({ news: updatedNews, hasUnsavedChanges: true });
    persistAdminChanges(updatedNews);
    render(); // recargar tabla
  }

  function deleteNews(id) {
    if (!confirm('¿Eliminar esta noticia?')) return;
    const updatedNews = AppState.getState().news.filter(n => n.id !== id);
    AppState.setState({ news: updatedNews, hasUnsavedChanges: true });
    persistAdminChanges(updatedNews);
    render();
  }

  function persistAdminChanges(newsArray) {
    localStorage.setItem(CONFIG.localStorageKey, JSON.stringify(newsArray));
  }

  function loadAdminChanges() {
    const stored = localStorage.getItem(CONFIG.localStorageKey);
    return stored ? JSON.parse(stored) : null;
  }

  return { render, loadAdminChanges, persistAdminChanges };
})();