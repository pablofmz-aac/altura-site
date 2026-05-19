// ==========================================
//   ALTURA ATHLETICS — shared components
// ==========================================

function getPageName() {
  const path = window.location.pathname.split('/').pop().replace('.html','') || 'index';
  return path;
}

function renderNavbar() {
  const page = getPageName();
  const links = [
    { href: 'index.html',          label: 'Inicio',          id: 'index' },
    { href: 'sobre-altura.html',   label: 'Sobre Altura',    id: 'sobre-altura' },
    { href: 'comunidad.html',      label: 'Comunidad',       id: 'comunidad' },
    { href: 'eventos.html',        label: 'Eventos',         id: 'eventos' },
    { href: 'entrenamientos.html', label: 'Entrenamientos',  id: 'entrenamientos' },
    { href: 'contacto.html',       label: 'Contacto',        id: 'contacto' },
  ];
  const linksHTML = links.map(l =>
    `<a href="${l.href}" class="${page === l.id ? 'active' : ''}">${l.label}</a>`
  ).join('');

  return `
  <nav class="navbar" id="navbar">
    <div class="container">
      <a href="index.html" class="navbar-logo">
        <img
          src="images/logo.jpg"
          alt="Altura Athletics"
          class="navbar-logo-img"
        />
      </a>
      <div class="nav-links">
        ${linksHTML}
        <a href="miembros.html" class="btn btn-primary nav-cta" style="padding:9px 20px;font-size:0.85rem;">
          Ser Miembro Fundador
        </a>
      </div>
      <button class="menu-toggle" onclick="toggleMenu()" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
    <!-- Mobile menu -->
    <div class="mobile-menu" id="mobileMenu">
      ${links.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
      <a href="miembros.html" class="btn btn-primary" style="margin-top:8px;">Ser Miembro Fundador</a>
    </div>
  </nav>`;
}

function renderFooter() {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html">
            <img src="images/logo.jpg" alt="Altura Athletics" class="footer-logo-img" />
          </a>
          <p>Comunidad deportiva en Antigua Guatemala. Entrenamos juntos, nos apoyamos y celebramos cada paso del camino.</p>
          <div class="footer-socials" style="margin-top:20px;">
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="WhatsApp">WA</a>
          </div>
        </div>
        <div>
          <h5>Navegación</h5>
          <ul>
            <li><a href="index.html">Inicio</a></li>
            <li><a href="sobre-altura.html">Sobre Altura</a></li>
            <li><a href="comunidad.html">Comunidad</a></li>
            <li><a href="miembros.html">Miembros Fundadores</a></li>
          </ul>
        </div>
        <div>
          <h5>Actividad</h5>
          <ul>
            <li><a href="eventos.html">Eventos</a></li>
            <li><a href="entrenamientos.html">Entrenamientos</a></li>
            <li><a href="blog.html">Journal</a></li>
            <li><a href="sponsors.html">Patrocinadores</a></li>
          </ul>
        </div>
        <div>
          <h5>Contacto</h5>
          <ul>
            <li><a href="contacto.html">Hablemos</a></li>
            <li><a href="mailto:hola@alturaathletics.com">hola@alturaathletics.com</a></li>
            <li><a href="https://wa.me/50212345678">WhatsApp</a></li>
            <li><a href="links.html">Links Rápidos</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Altura Athletics. Antigua Guatemala.</span>
        <span>Endurance · Connection · Transformation</span>
      </div>
    </div>
  </footer>`;
}

function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
});

// Inject on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const navEl = document.getElementById('nav-placeholder');
  if (navEl) navEl.innerHTML = renderNavbar();
  const footEl = document.getElementById('footer-placeholder');
  if (footEl) footEl.innerHTML = renderFooter();

  // Re-bind scroll listener after navbar is injected
  window.dispatchEvent(new Event('scroll'));
});
