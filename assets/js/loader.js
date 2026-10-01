(() => {
  const root = document.documentElement;
  const L = document.getElementById('loader');
  if (!L) return;
  if (!root.classList.contains('loading')) return L.remove();
  const fill = document.getElementById('ld-fill');
  const pct = document.getElementById('ld-pct');
  const msg = document.getElementById('ld-msg');
  const t0 = performance.now();
  const MIN = 1600;
  const MAX = 9000;
  let done = 0;
  let shown = 0;
  let over = false;

  // Aset penting: font, gambar hero/tentang/project pertama, dan event load
  const imgs = [...document.querySelectorAll('#home img, #about img, #projects img')].slice(0, 12);
  const tasks = [
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((r) => (document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true }))),
    ...imgs.map((im) => {
      im.loading = 'eager';
      return im.decode ? im.decode().catch(() => {}) : Promise.resolve();
    }),
  ];
  tasks.forEach((p) => p.then(() => done++, () => done++));

  const finish = () => {
    if (over) return;
    over = true;
    msg.textContent = 'Selamat datang';
    L.classList.add('out');
    setTimeout(() => {
      root.classList.remove('loading');
      dispatchEvent(new Event('site:ready'));
    }, 350);
    setTimeout(() => {
      L.remove();
      // muat sisa gambar di waktu senggang agar scroll tidak pop-in
      const rest = [...document.images].filter((i) => i.loading === 'lazy');
      const next = () => {
        const i = rest.shift();
        if (!i) return;
        i.loading = 'eager';
        (i.decode ? i.decode().catch(() => {}) : Promise.resolve()).then(() => (window.requestIdleCallback ? requestIdleCallback(next) : setTimeout(next, 120)));
      };
      next();
    }, 1300);
  };

  const tick = (t) => {
    const el = t - t0;
    const target = Math.min((done / tasks.length) * 100, (el / MIN) * 100);
    shown += (target - shown) * 0.14;
    if (target - shown < 0.3) shown = target;
    const p = Math.min(100, Math.round(shown));
    fill.style.transform = `scaleX(${shown / 100})`;
    pct.textContent = p;
    msg.textContent = p < 35 ? 'Menyiapkan tampilan' : p < 70 ? 'Memuat gambar' : p < 100 ? 'Merapikan animasi' : 'Hampir siap';
    if ((shown >= 99.5 && done >= tasks.length) || el > MAX) return finish();
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  setTimeout(finish, MAX + 1500); // pengaman
})();
