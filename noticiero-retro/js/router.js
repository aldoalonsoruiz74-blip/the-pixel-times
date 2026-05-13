const Router = (() => {
  const routes = {};
  let currentHash;

  function addRoute(pattern, handler) {
    routes[pattern] = handler;
  }

  function getParams(path) {
    // extrae parámetro de rutas como noticia/:id o categoria/:name
    return {};
  }

  function matchRoute(hash) {
    // Limpiamos el hash para obtener la ruta (ej: #contacto -> contacto)
    const path = hash.slice(1) || 'home';

    // 1. Rutas con parámetros dinámicos
    if (path.startsWith('noticia/')) {
      const id = path.split('/')[1];
      return { handler: renderArticle, params: { id } };
    }
    if (path.startsWith('categoria/')) {
      const cat = path.split('/')[1];
      return { handler: renderCategory, params: { category: cat } };
    }

    // 2. Rutas estáticas nuevas
    if (path === 'nosotros') {
      return { handler: renderAbout, params: {} };
    }
    if (path === 'servicios') {
      return { handler: renderServices, params: {} };
    }
    if (path === 'galeria') {
      return { handler: renderGallery, params: {} };
    }
    if (path === 'contacto') {
      return { handler: renderContact, params: {} };
    }

    // 3. Rutas administrativas y por defecto
    if (path === 'admin') {
      return { handler: renderAdminPanel, params: {} };
    }
    
    // Por defecto volvemos al inicio
    return { handler: renderHome, params: {} };
  }

  function init() {
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
  }

  function handleHashChange() {
    const hash = window.location.hash || '#home';
    const { handler, params } = matchRoute(hash);
    
    // Ejecutamos el renderizado correspondiente
    if (typeof handler === 'function') {
      handler(params);
      // Hacemos scroll arriba al cambiar de página
      window.scrollTo(0, 0);
    }
  }

  function navigate(hash) {
    window.location.hash = hash;
  }

  return { init, navigate, addRoute };
})();