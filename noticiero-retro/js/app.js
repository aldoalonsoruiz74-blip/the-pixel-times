(async function initApp() {
  // 1. Cargar JSON original
  let baseNews = [];
  try {
    const res = await fetch(CONFIG.newsJsonPath);
    if (!res.ok) throw new Error('No se pudo cargar news.json');
    baseNews = await res.json();
  } catch (err) {
    console.error(err);
    baseNews = []; // fallback vacío
  }

  // 2. Combinar con cambios del admin desde localStorage
  const adminNews = AdminUI.loadAdminChanges();
  let mergedNews;
  if (adminNews && adminNews.length) {
    // Lógica: sobreescribimos por id, añadimos nuevos
    const newsMap = new Map(baseNews.map(n => [n.id, n]));
    adminNews.forEach(n => newsMap.set(n.id, n));
    mergedNews = Array.from(newsMap.values());
  } else {
    mergedNews = baseNews;
  }

  // 3. Inicializar estado
  AppState.setState({ news: mergedNews, originalNews: baseNews });

  // 4. Renderizar elementos fijos
  renderMasthead();
  renderFooter();

  // 5. Suscribir a cambios de estado para actualizar navegación si es necesario (opcional)
  AppState.subscribe((newState) => {
    // Podríamos re-renderizar elementos comunes si cambian datos globales
    // Pero lo manejamos en cada handler de ruta.
  });

  // 6. Arrancar router
  Router.init();
})();