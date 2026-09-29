(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.documentElement;
  root.classList.add('js');
  if (reduce) root.classList.add('reduce');

  /* ───────── Tahun & umur (dihitung otomatis) ───────── */
  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
  $$('[data-age]').forEach((el) => {
    const b = new Date(el.dataset.age);
    const n = new Date();
    let age = n.getFullYear() - b.getFullYear();
    if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) age--;
    el.textContent = age;
    el.dataset.count = age;
  });

  /* ───────── Pecah judul hero jadi huruf ───────── */
  $$('[data-split]').forEach((el) => {
    const text = el.textContent.trim();
    const offset = Number(el.dataset.offset) || 0;
    el.textContent = '';
    [...text].forEach((c, i) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = c;
      s.style.setProperty('--i', i + offset);
      el.appendChild(s);
    });
  });

  /* ───────── Huruf hidup: berat huruf mengikuti kursor, bergelombang saat diam ───────── */
  const chars = $$('.ch');
  if (chars.length && !reduce) {
    let px = -9999;
    let py = -9999;
    let lastMove = 0;
    const weights = chars.map(() => 720);
    let ready = false;
    setTimeout(() => (ready = true), 1700);

    addEventListener(
      'pointermove',
      (e) => {
        px = e.clientX;
        py = e.clientY;
        lastMove = performance.now();
      },
      { passive: true }
    );

    const tick = (t) => {
      if (ready && !document.hidden) {
        const active = t - lastMove < 1800;
        const rects = chars.map((c) => c.getBoundingClientRect());
        chars.forEach((c, i) => {
          let target;
          if (active) {
            const r = rects[i];
            const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
            target = 520 + 300 * clamp(1 - d / 300, 0, 1);
          } else {
            target = 660 + 110 * Math.sin(t / 650 + i * 0.7);
          }
          weights[i] = lerp(weights[i], target, 0.14);
          c.style.setProperty('--w', weights[i].toFixed(0));
        });
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ───────── Typewriter ───────── */
  const typed = $('#typed');
  if (typed) {
    const roles = [
      'membuat poster promo yang menarik mata',
      'merapikan foto produk jadi lebih hidup',
      'mengedit video pendek untuk media sosial',
      'menggambar ikon dan logo vektor',
      'menulis PHP, HTML, dan JavaScript',
    ];
    if (reduce) {
      typed.textContent = roles[0];
    } else {
      let r = 0;
      let i = 0;
      let del = false;
      const step = () => {
        const word = roles[r];
        i += del ? -1 : 1;
        typed.textContent = word.slice(0, i);
        let wait = del ? 24 : 52;
        if (!del && i === word.length) {
          wait = 1700;
          del = true;
        } else if (del && i === 0) {
          del = false;
          r = (r + 1) % roles.length;
          wait = 380;
        }
        setTimeout(step, wait);
      };
      setTimeout(step, 1400);
    }
  }

  /* ───────── Reveal saat scroll ───────── */
  const revealIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target;
          el.classList.add('in');
          revealIO.unobserve(el);
          const d = parseInt(el.style.getPropertyValue('--d')) || 0;
          setTimeout(() => el.removeAttribute('data-anim'), d + 1000);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );
  $$('[data-anim]').forEach((el) => revealIO.observe(el));

  /* ───────── Counter ───────── */
  const countIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        countIO.unobserve(e.target);
        const el = e.target;
        const to = Number(el.dataset.count);
        if (reduce) return (el.textContent = to);
        const t0 = performance.now();
        const dur = 1500;
        const run = (t) => {
          const p = clamp((t - t0) / dur, 0, 1);
          el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(run);
        };
        requestAnimationFrame(run);
      });
    },
    { threshold: 0.6 }
  );
  $$('[data-count]').forEach((el) => {
    if (!reduce) el.textContent = '0';
    countIO.observe(el);
  });

  /* ───────── Progress scroll + parallax ───────── */
  const bar = $('#progress');
  const parallax = $$('[data-parallax]');
  const tlLine = $('#tl-line');
  const tlWrap = $('#tl-wrap');
  const tlItems = $$('.tl-item');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const h = document.documentElement.scrollHeight - innerHeight;
      if (bar) bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
      if (!reduce) {
        parallax.forEach((el) => {
          const speed = Number(el.dataset.parallax);
          const r = el.parentElement.getBoundingClientRect();
          const off = (r.top + r.height / 2 - innerHeight / 2) * speed;
          el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
        });
      }
      if (tlLine && tlWrap) {
        const r = tlWrap.getBoundingClientRect();
        const p = clamp((innerHeight * 0.6 - r.top) / r.height, 0, 1);
        tlLine.style.transform = `scaleY(${p})`;
        tlItems.forEach((el) => {
          const dot = el.firstElementChild.getBoundingClientRect();
          el.classList.toggle('on', dot.top + dot.height / 2 < innerHeight * 0.6);
        });
      }
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ───────── Nav: indikator aktif + menu mobile ───────── */
  const navLinks = $$('[data-nav]');
  const indicator = $('#nav-ind');
  const moveInd = (link) => {
    if (!indicator || !link) return;
    indicator.style.width = link.offsetWidth + 'px';
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;
    indicator.style.opacity = 1;
  };
  let currentSec = null;
  const secIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        currentSec = e.target.id;
        const link = navLinks.find((l) => l.getAttribute('href') === '#' + currentSec);
        navLinks.forEach((l) => l.classList.toggle('text-white', l === link));
        navLinks.forEach((l) => l.classList.toggle('text-white/70', l !== link));
        if (link) moveInd(link);
        else if (indicator) indicator.style.opacity = 0;
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  $$('main section[id]').forEach((s) => secIO.observe(s));
  addEventListener('resize', () => {
    const l = navLinks.find((x) => x.getAttribute('href') === '#' + currentSec);
    moveInd(l);
  });

  const menuBtn = $('#menu-btn');
  const mnav = $('#mnav');
  const setMenu = (open) => {
    if (!menuBtn || !mnav) return;
    menuBtn.setAttribute('aria-expanded', open);
    mnav.classList.toggle('pointer-events-none', !open);
    mnav.classList.toggle('opacity-0', !open);
    mnav.classList.toggle('-translate-y-3', !open);
    mnav.classList.toggle('scale-95', !open);
    $('#bar1').style.transform = open ? 'translateY(4px) rotate(45deg)' : '';
    $('#bar2').style.transform = open ? 'translateY(-4px) rotate(-45deg)' : '';
  };
  if (menuBtn) {
    menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
    $$('#mnav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));
  }

  /* ───────── Kursor + spotlight (hanya perangkat mouse) ───────── */
  if (fine && !reduce) {
    const ring = $('#cursor');
    const spot = $('#spot');
    let tx = innerWidth / 2;
    let ty = innerHeight / 2;
    let rx = tx;
    let ry = ty;
    let sx = tx;
    let sy = ty;
    addEventListener(
      'pointermove',
      (e) => {
        tx = e.clientX;
        ty = e.clientY;
        ring && ring.classList.add('active');
      },
      { passive: true }
    );
    document.addEventListener('pointerleave', () => ring && ring.classList.remove('active'));
    const hot = 'a, button, [data-magnetic], [data-open], input, textarea';
    document.addEventListener('pointerover', (e) => ring && ring.classList.toggle('hot', !!e.target.closest(hot)));
    const loop = () => {
      rx = lerp(rx, tx, 0.22);
      ry = lerp(ry, ty, 0.22);
      sx = lerp(sx, tx, 0.08);
      sy = lerp(sy, ty, 0.08);
      if (ring) ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (spot) spot.style.background = `radial-gradient(520px circle at ${sx}px ${sy}px, rgba(120,220,255,.11), transparent 60%)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ───────── Blob mengikuti pointer (parallax halus) ───────── */
  const blobs = $$('[data-depth]');
  if (blobs.length && !reduce && fine) {
    let bx = 0;
    let by = 0;
    let cx = 0;
    let cy = 0;
    addEventListener(
      'pointermove',
      (e) => {
        bx = e.clientX / innerWidth - 0.5;
        by = e.clientY / innerHeight - 0.5;
      },
      { passive: true }
    );
    const move = () => {
      cx = lerp(cx, bx, 0.05);
      cy = lerp(cy, by, 0.05);
      blobs.forEach((b) => {
        const d = Number(b.dataset.depth);
        b.style.translate = `${(cx * d).toFixed(1)}px ${(cy * d).toFixed(1)}px`;
      });
      requestAnimationFrame(move);
    };
    move();
  }

  /* ───────── Tilt 3D + kilau ───────── */
  const attachTilt = (el, max = 9) => {
    if (!fine || reduce) return;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', x * 100 + '%');
      el.style.setProperty('--my', y * 100 + '%');
      el.style.transform = `perspective(1000px) rotateX(${((0.5 - y) * max).toFixed(2)}deg) rotateY(${((x - 0.5) * max).toFixed(2)}deg) scale3d(1.015,1.015,1.015)`;
    });
    el.addEventListener('pointerleave', () => (el.style.transform = ''));
  };
  $$('.tilt').forEach((el) => attachTilt(el, Number(el.dataset.tilt) || 9));

  /* ───────── Tombol magnetik ───────── */
  if (fine && !reduce) {
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * 0.28}px, ${dy * 0.4}px)`;
      });
      el.addEventListener('pointerleave', () => (el.style.transform = ''));
    });
  }

  /* ───────── Filter project ───────── */
  const chips = $$('[data-filter]');
  const items = $$('.proj');
  const countLabel = $('#proj-count');
  const applyFilter = (f) => {
    let shown = 0;
    items.forEach((li) => {
      const match = f === 'all' || li.dataset.cat.split(' ').includes(f);
      const wasHidden = li.hidden;
      if (match) {
        shown++;
        if (wasHidden) {
          li.hidden = false;
          li.classList.remove('fx-out');
          li.classList.remove('fx-in');
          void li.offsetWidth;
          li.style.setProperty('--fd', (shown % 6) * 55 + 'ms');
          li.classList.add('fx-in');
        }
      } else if (!wasHidden) {
        li.classList.remove('fx-in');
        li.classList.add('fx-out');
        setTimeout(() => {
          li.hidden = true;
          li.classList.remove('fx-out');
        }, reduce ? 0 : 220);
      }
    });
    if (countLabel) countLabel.textContent = `Menampilkan ${shown} project`;
  };
  chips.forEach((c) =>
    c.addEventListener('click', () => {
      chips.forEach((x) => x.setAttribute('aria-pressed', x === c));
      applyFilter(c.dataset.filter);
    })
  );

  /* ───────── Lightbox ───────── */
  const lb = $('#lb');
  if (lb) {
    const lbBg = $('#lb-bg');
    const lbCard = $('#lb-card');
    const lbImg = $('#lb-img');
    const lbThumbs = $('#lb-thumbs');
    let opener = null;
    let idx = 0;
    let list = [];
    let open = false;

    const visible = () => items.filter((li) => !li.hidden && !li.classList.contains('fx-out'));

    const fill = (li) => {
      const b = $('[data-open]', li);
      const d = b.dataset;
      $('#lb-title').textContent = d.title;
      $('#lb-brand').textContent = d.brand || '-';
      $('#lb-tool').textContent = d.tool || '-';
      $('#lb-media').textContent = d.media || '-';
      $('#lb-desc').textContent = d.desc || '';
      $('#lb-link').href = d.link || '#';
      $('#lb-count').textContent = `${idx + 1} / ${list.length}`;
      const imgs = (d.imgs || '').split(',').filter(Boolean);
      const set = (src) => {
        lbImg.src = src;
        lbImg.alt = d.title;
        $$('button', lbThumbs).forEach((t) => t.setAttribute('aria-current', t.dataset.src === src));
      };
      lbThumbs.innerHTML = '';
      if (imgs.length > 1) {
        imgs.forEach((src, i) => {
          const t = document.createElement('button');
          t.type = 'button';
          t.dataset.src = src;
          t.setAttribute('aria-label', `Gambar ${i + 1}`);
          t.className =
            'h-14 w-14 overflow-hidden rounded-xl border border-white/20 opacity-60 transition aria-[current=true]:border-macaw aria-[current=true]:opacity-100';
          t.innerHTML = `<img src="${src}" alt="" class="h-full w-full object-cover">`;
          t.addEventListener('click', () => set(src));
          lbThumbs.appendChild(t);
        });
      }
      set(imgs[0]);
    };

    const openLb = (li, btn) => {
      list = visible();
      idx = Math.max(0, list.indexOf(li));
      opener = btn;
      fill(li);
      lb.hidden = false;
      lb.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      open = true;

      // FLIP: gambar terbang dari kartu ke lightbox
      const from = $('img', btn).getBoundingClientRect();
      lbBg.style.opacity = 0;
      lbCard.style.animation = reduce ? 'none' : 'lbIn .55s cubic-bezier(.2,.9,.2,1) both';
      requestAnimationFrame(() => {
        lbBg.style.opacity = 1;
        if (!reduce && lbImg.complete) {
          const to = lbImg.getBoundingClientRect();
          if (to.width) {
            lbImg.style.transition = 'none';
            lbImg.style.transformOrigin = 'top left';
            lbImg.style.transform = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;
            void lbImg.offsetWidth;
            lbImg.style.transition = 'transform .6s cubic-bezier(.2,.9,.2,1)';
            lbImg.style.transform = 'none';
          }
        }
        $('#lb-close').focus({ preventScroll: true });
      });
    };

    const closeLb = () => {
      if (!open) return;
      open = false;
      lbBg.style.opacity = 0;
      lbCard.style.transition = 'opacity .25s, transform .25s';
      lbCard.style.opacity = 0;
      lbCard.style.transform = 'translateY(16px) scale(.97)';
      setTimeout(
        () => {
          lb.hidden = true;
          lb.classList.add('hidden');
          lbCard.style.cssText = '';
          lbImg.style.cssText = '';
          document.body.style.overflow = '';
          opener && opener.focus({ preventScroll: true });
        },
        reduce ? 0 : 260
      );
    };

    const go = (dir) => {
      if (!open || list.length < 2) return;
      idx = (idx + dir + list.length) % list.length;
      lbImg.style.transition = 'opacity .18s, transform .18s';
      lbImg.style.opacity = 0;
      lbImg.style.transform = `translateX(${dir * 24}px)`;
      setTimeout(() => {
        fill(list[idx]);
        opener = $('[data-open]', list[idx]);
        lbImg.style.transition = 'none';
        lbImg.style.transform = `translateX(${dir * -24}px)`;
        void lbImg.offsetWidth;
        lbImg.style.transition = 'opacity .3s, transform .3s';
        lbImg.style.opacity = 1;
        lbImg.style.transform = 'none';
      }, reduce ? 0 : 180);
    };

    items.forEach((li) => {
      const b = $('[data-open]', li);
      b.addEventListener('click', () => openLb(li, b));
    });
    $('#lb-close').addEventListener('click', closeLb);
    lbBg.addEventListener('click', closeLb);
    lb.addEventListener('click', (e) => {
      if (e.target.id === 'lb-wrap' || e.target.id === 'lb-grid') closeLb();
    });
    $('#lb-prev').addEventListener('click', () => go(-1));
    $('#lb-next').addEventListener('click', () => go(1));

    addEventListener('keydown', (e) => {
      if (!open) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab') {
        const f = $$('button, a[href]', lb).filter((x) => x.offsetParent !== null);
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // geser di layar sentuh
    let sx0 = 0;
    lbCard.addEventListener('touchstart', (e) => (sx0 = e.touches[0].clientX), { passive: true });
    lbCard.addEventListener(
      'touchend',
      (e) => {
        const dx = e.changedTouches[0].clientX - sx0;
        if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
      },
      { passive: true }
    );
  }
})();
