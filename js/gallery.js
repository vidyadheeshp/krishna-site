/* ============================================================
   gallery.js — Lightbox & filter functionality
   ============================================================ */
(function () {
  'use strict';

  /* ---- Lightbox ---- */
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lb-img');
  const lbCaption  = document.getElementById('lb-caption');
  const lbClose    = document.getElementById('lb-close');
  const lbPrev     = document.getElementById('lb-prev');
  const lbNext     = document.getElementById('lb-next');

  let items        = [];
  let currentIndex = 0;

  function buildItems() {
    items = Array.from(document.querySelectorAll('[data-lightbox]'));
  }

  function openLightbox(index) {
    if (!lightbox || items.length === 0) return;
    currentIndex = index;
    showItem(currentIndex);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showItem(index) {
    const item = items[index];
    if (!item) return;

    // Try real img src first, else use a gradient placeholder SVG
    const src     = item.dataset.src     || '';
    const caption = item.dataset.caption || item.querySelector('.gal-label,span')?.textContent || '';

    if (lbCaption) lbCaption.textContent = caption;

    if (src && lbImg) {
      lbImg.src = src;
      lbImg.style.display = 'block';
    } else if (lbImg) {
      // Grab computed bg colour from placeholder and show a styled div instead
      lbImg.src = 'data:image/svg+xml,' + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
          <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#8B0000"/>
            <stop offset="100%" style="stop-color:#D4AF37"/>
          </linearGradient></defs>
          <rect width="800" height="500" fill="url(#g)"/>
          <text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle"
                font-size="80" fill="rgba(255,255,255,0.6)">🛕</text>
          <text x="50%" y="66%" dominant-baseline="middle" text-anchor="middle"
                font-size="20" fill="rgba(255,255,255,0.7)" font-family="sans-serif">${caption}</text>
        </svg>`
      );
      lbImg.style.display = 'block';
    }
  }

  function prevItem() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    showItem(currentIndex);
  }

  function nextItem() {
    currentIndex = (currentIndex + 1) % items.length;
    showItem(currentIndex);
  }

  /* Bind item clicks */
  document.addEventListener('click', e => {
    const target = e.target.closest('[data-lightbox]');
    if (target) {
      buildItems();
      const idx = items.indexOf(target);
      openLightbox(idx >= 0 ? idx : 0);
    }
  });

  lbClose && lbClose.addEventListener('click', closeLightbox);
  lbPrev  && lbPrev.addEventListener('click', prevItem);
  lbNext  && lbNext.addEventListener('click', nextItem);

  lightbox && lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  prevItem();
    if (e.key === 'ArrowRight') nextItem();
  });

  /* ---- Gallery Filter ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galItems   = document.querySelectorAll('.gal-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter || 'all';

      galItems.forEach(item => {
        const cat = item.dataset.category || 'all';
        if (filter === 'all' || cat === filter) {
          item.style.display = '';
          item.style.opacity  = '0';
          setTimeout(() => { item.style.opacity = '1'; item.style.transition = 'opacity .4s ease'; }, 10);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
})();
