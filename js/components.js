// Función auxiliar para limpiar y renderizar en un contenedor
function renderInto(selector, html) {
  const container = document.querySelector(selector);
  if (container) {
    container.innerHTML = html;
  }
}

// === Componentes Estáticos Comunes ===

function renderMasthead() {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = today.toLocaleDateString('es-ES', options);
  
  const html = `
    <div onclick="Router.navigate('#home')" style="cursor:pointer">
      <h1>The Pixel Times</h1>
      <div class="edition">${dateStr} — Núm. 42 — Edición Especial Digital</div>
    </div>
  `;
  renderInto('#masthead', html);
}

function renderMainNav(categories, currentPath) {
  // Enlaces de secciones fijas
  const sections = [
    { name: 'Inicio', hash: 'home' },
    { name: 'Nosotros', hash: 'nosotros' },
    { name: 'Servicios', hash: 'servicios' },
    { name: 'Galería', hash: 'galeria' },
    { name: 'Contacto', hash: 'contacto' }
  ];

  const sectionLinks = sections.map(s => {
    const active = (currentPath === s.hash) ? 'class="active"' : '';
    return `<a href="#${s.hash}" ${active}>${s.name}</a>`;
  }).join('');

  // Enlaces de categorías dinámicas (opcional, se pueden mostrar solo en Home)
  const catLinks = categories.map(cat => {
    const active = (currentPath === 'categoria/' + cat) ? 'class="active"' : '';
    return `<a href="#categoria/${cat}" ${active}>${cat.charAt(0).toUpperCase() + cat.slice(1)}</a>`;
  }).join('');

  const html = `
    <div class="nav-links">
      ${sectionLinks}
      <span class="admin-link" id="open-admin" onclick="Router.navigate('#admin')">[Edición]</span>
    </div>
  `;
  renderInto('#main-nav', html);
}

function renderFooter() {
  renderInto('#page-footer', `
    <footer>
      <p>© 2026 The Pixel Times · Información en tiempo real con estilo de ayer</p>
      <p>Impreso en los servidores de la red global</p>
    </footer>
  `);
}

// === Sección: HOME (Inicio) ===

function renderHome() {
  const state = AppState.getState();
  const { news } = state;
  
  // Definimos las categorías que queremos mostrar
  const categories = ['lanzamientos', 'reviews', 'esports', 'hardware', 'indie'];
  renderMainNav(categories, 'home');

  const featured = news.find(n => n.featured) || news[0];
  const secondary = news.filter(n => n.id !== featured.id).slice(0, 4);

  const html = `
    <div class="home-layout">
      <div class="main-column">
        <article class="featured-news" onclick="Router.navigate('#noticia/${featured.id}')" style="cursor:pointer">
          <h2>${featured.title}</h2>
          <img src="${featured.image}" alt="${featured.title}">
          <p class="drop-cap">${featured.summary}</p>
          <p class="meta">Corresponsal: ${featured.author} | ${featured.date}</p>
        </article>
        
        <div class="secondary-news">
          ${secondary.map(n => `
            <div class="news-card" onclick="Router.navigate('#noticia/${n.id}')">
              <h3>${n.title}</h3>
              <p>${n.summary.substring(0, 85)}...</p>
              <span class="meta">${n.category.toUpperCase()} | ${n.date}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <aside class="sidebar">
        <div class="breaking">Última Hora</div>
        <h4>Avisos Clasificados</h4>
        <p><strong>EMPLEO:</strong> Se busca experto en cables RF para conectar consolas de 1990.</p>
        <p><strong>VENTA:</strong> Monitor de tubo (CRT) de 14 pulgadas. Colores vibrantes. Pesa 20 kilos.</p>
        <br>
        <h4>Suscripciones</h4>
        <p>Reciba este boletín cada mañana por solo 10 monedas de oro al mes.</p>
        <button class="btn-retro" onclick="Router.navigate('#servicios')" style="width:100%; margin-top:10px;">Ver Planes</button>
      </aside>
    </div>
  `;
  renderInto('#page-content', html);
}

// === Sección: NOSOTROS ===

function renderAbout() {
  renderMainNav([], 'nosotros');
  const html = `
    <div class="article-full">
      <h2>Nuestra Editorial</h2>
      <p class="drop-cap">The Pixel Times no es solo un noticiero; es una cápsula del tiempo digital. Fundado en la era de la información masiva, decidimos volver a las raíces: tipografía clara, columnas estructuradas y un respeto sagrado por el lector.</p>
      <img src="https://tourhistoria.es/wp-content/uploads/2018/11/0-rotativaavapor_Erste-Rotationsmaschine-1876.png" alt="Nuestra oficina">
      <p>Nuestro equipo está compuesto por veteranos de la industria y entusiastas del hardware clásico. No buscamos el clickbait, buscamos la crónica. Creemos que la tecnología avanza muy rápido, pero el buen periodismo debe tener el peso de un periódico de domingo.</p>
    </div>
  `;
  renderInto('#page-content', html);
}

// === Sección: SERVICIOS / PRODUCTOS ===

function renderServices() {
  renderMainNav([], 'servicios');
  const html = `
    <div class="article-full">
      <h2>Productos y Servicios</h2>
      <p>Ofrecemos soluciones para el entusiasta de la tecnología que valora la estética clásica.</p>
      
      <div class="secondary-news" style="margin-top:30px;">
        <div class="news-card">
          <h3>Suscripción "Papel Digital"</h3>
          <p>Acceso ilimitado a todas nuestras crónicas y archivos históricos de la década.</p>
          <button class="btn-retro">15 Monedas / Mes</button>
        </div>
        <div class="news-card">
          <h3>Publicidad de Época</h3>
          <p>Diseñamos anuncios para su marca con estilo de los años 20 pero para el público de hoy.</p>
          <button class="btn-retro">Consultar</button>
        </div>
        <div class="news-card">
          <h3>Archivo en PDF</h3>
          <p>Descargue nuestras ediciones mensuales listas para imprimir en papel bond.</p>
          <button class="btn-retro">Comprar</button>
        </div>
      </div>
    </div>
  `;
  renderInto('#page-content', html);
}

// === Sección: GALERÍA ===

function renderGallery() {
  renderMainNav([], 'galeria');
  // Usamos IDs de Picsum que se ven bien con el filtro sepia del CSS
  const images = [250, 1, 2, 3, 4, 5, 6, 9]; 
  const html = `
    <div class="article-full">
      <h2>Archivo Fotográfico</h2>
      <p>Instantáneas de nuestra redacción y de los eventos tecnológicos más importantes del año.</p>
      <div class="gallery-grid">
        ${images.map(id => `
          <div class="gallery-item">
            <img src="https://picsum.photos/id/${id}/600/400" alt="Foto de archivo">
          </div>
        `).join('')}
      </div>
    </div>
  `;
  renderInto('#page-content', html);
}

// === Sección: CONTACTO ===

function renderContact() {
  renderMainNav([], 'contacto');
  const html = `
    <div class="article-full">
      <div style="text-align:center; margin-bottom:30px;">
        <h2>Envíe un Telegrama</h2>
        <p>¿Tiene una primicia? ¿Una queja? Escríbanos directamente.</p>
      </div>
      
      <form class="contact-form" onsubmit="event.preventDefault(); alert('Mensaje enviado. Lo recibiremos en nuestra terminal en breve.'); Router.navigate('#home');">
        <div class="form-group">
          <label>Nombre Completo</label>
          <input type="text" placeholder="Ej. Sr. Juan Pérez" required>
        </div>
        <div class="form-group">
          <label>Correo Electrónico</label>
          <input type="email" placeholder="su@correo.com" required>
        </div>
        <div class="form-group">
          <label>Asunto</label>
          <select>
            <option>Pista de noticia</option>
            <option>Publicidad</option>
            <option>Suscripciones</option>
            <option>Otro</option>
          </select>
        </div>
        <div class="form-group">
          <label>Mensaje</label>
          <textarea rows="6" placeholder="Escriba aquí..." required></textarea>
        </div>
        <button type="submit" class="btn-retro">Enviar Mensaje</button>
      </form>
    </div>
  `;
  renderInto('#page-content', html);
}

// --- Artículo Completo ---
function renderArticle(params) {
  const { id } = params;
  const state = AppState.getState();
  const article = state.news.find(n => n.id === id);
  
  if (!article) {
    renderInto('#page-content', '<h2>Artículo no encontrado</h2>');
    return;
  }

  renderMainNav([], '');
  const html = `
    <div class="article-full">
      <h2>${article.title}</h2>
      <p class="meta">${article.category.toUpperCase()} | ${article.date} | por ${article.author}</p>
      <img src="${article.image}" alt="${article.title}">
      <div class="drop-cap">${article.content}</div>
      <p style="margin-top:20px;"><strong>Plataformas:</strong> ${article.platforms.join(', ')}</p>
      <button class="btn-retro" style="margin-top:40px;" onclick="Router.navigate('#home')">← Volver a Portada</button>
    </div>
  `;
  renderInto('#page-content', html);
}

// --- Categoría ---
function renderCategory(params) {
  const { category } = params;
  const state = AppState.getState();
  const filtered = state.news.filter(n => n.category === category);
  
  renderMainNav(['lanzamientos', 'reviews', 'esports', 'hardware', 'indie'], 'categoria/' + category);
  
  const html = `
    <h2 style="font-family:'Playfair Display'; border-bottom:2px solid #1a1a1a; padding-bottom:10px;">
      Sección: ${category.charAt(0).toUpperCase() + category.slice(1)}
    </h2>
    <div class="secondary-news" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
      ${filtered.map(n => `
        <div class="news-card" onclick="Router.navigate('#noticia/${n.id}')">
          <h3>${n.title}</h3>
          <p>${n.summary}</p>
          <span class="meta">${n.date}</span>
        </div>
      `).join('')}
    </div>
  `;
  renderInto('#page-content', html);
}

// --- Admin Panel ---
function renderAdminPanel() {
  if (!AppState.getState().isAdmin) {
    renderInto('#page-content', `
      <div class="admin-panel" style="max-width:400px; margin: 40px auto; text-align:center;">
        <h3>Terminal de Acceso</h3>
        <p>Ingrese clave de redacción</p>
        <input type="password" id="admin-pass" style="width:100%; margin:15px 0; padding:10px;">
        <button id="login-admin" class="btn-retro" style="width:100%;">Ingresar</button>
        <p id="login-error" style="color:#b32d2d; margin-top:10px; font-weight:bold;"></p>
      </div>
    `);
    document.getElementById('login-admin').addEventListener('click', adminLogin);
    return;
  }
  renderMainNav([], '');
  AdminUI.render();
}

function adminLogin() {
  const passInput = document.getElementById('admin-pass');
  if (passInput.value === CONFIG.adminPassword) {
    AppState.setState({ isAdmin: true });
    Router.navigate('#admin');
  } else {
    document.getElementById('login-error').textContent = 'CONTRASEÑA INCORRECTA';
  }
}
