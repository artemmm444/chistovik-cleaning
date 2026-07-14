import { CONFIG } from "./config.js?v=2";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (str = "") =>
  String(str).replace(/[&<>"']/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch])
  );

const page = document.body.dataset.page;

/* ---- общая оболочка: шапка и подвал рендерятся из конфига ---- */
const c = CONFIG.contacts;
const telHref = `tel:${c.phone.replace(/\s/g, "")}`;

const barEl = $("[data-bar]");
if (barEl) {
  barEl.innerHTML = `
    <a href="index.html" class="bar__brand"><span>${esc(CONFIG.brand)}</span><span>${esc(CONFIG.tagline.toUpperCase())}</span></a>
    <nav class="bar__nav">${CONFIG.nav
      .map((n) => `<a href="${n.href}"${n.key === page ? ' class="is-active"' : ""}>${esc(n.label)}</a>`)
      .join("")}</nav>
    <div class="bar__right">
      <a class="bar__phone" href="${telHref}">${esc(c.phone)}</a>
      <button class="theme-toggle" aria-label="Смена темы"></button>
      <a href="contacts.html" class="btn">ЗАЯВКА</a>
    </div>`;
}

/* ---- управление темой ---- */
const themeBtn = $(".theme-toggle");
if (themeBtn) {
  const modes = ["system", "light", "dark"];
  const icons = { system: "💻", light: "☀️", dark: "🌙" };
  const titles = { system: "Тема: системная", light: "Тема: светлая", dark: "Тема: тёмная" };
  let current = localStorage.getItem("theme") || "system";

  const apply = (t) => {
    if (t === "system") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", t);
    }
    themeBtn.textContent = icons[t];
    themeBtn.title = titles[t];
    localStorage.setItem("theme", t);
  };

  themeBtn.addEventListener("click", () => {
    current = modes[(modes.indexOf(current) + 1) % modes.length];
    apply(current);
  });

  apply(current);
}

const footerEl = $("[data-footer]");
if (footerEl) {
  footerEl.innerHTML = `
    <div class="footer__row">
      <div class="footer__brand">${esc(CONFIG.brand)}</div>
      <ul class="footer__contacts">
        <li><a href="${telHref}">${esc(c.phone)}</a></li>
        <li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>
        <li>${esc(c.address)}</li>
        <li>${esc(c.hours)}</li>
      </ul>
    </div>
    <p class="footer__muted">ДЕМО-САЙТ · СОБРАН ДЛЯ ПОРТФОЛИО</p>`;
}

/* ---- слайдер до/после: единственная сигнатура сайта ---- */
function initBeforeAfter(root = document) {
  $$("[data-ba]", root).forEach((el) => {
    let dragging = false;
    const setPos = (clientX) => {
      const r = el.getBoundingClientRect();
      let pct = ((clientX - r.left) / r.width) * 100;
      pct = Math.min(96, Math.max(4, pct));
      el.style.setProperty("--pos", pct + "%");
    };
    el.addEventListener("pointerdown", (e) => {
      dragging = true;
      el.setPointerCapture(e.pointerId);
      setPos(e.clientX);
    });
    el.addEventListener("pointermove", (e) => dragging && setPos(e.clientX));
    el.addEventListener("pointerup", () => (dragging = false));
    el.addEventListener("pointercancel", () => (dragging = false));
  });
}

function baMarkup(before, after, { lazy = true, capBefore = "ДО", capAfter = "ПОСЛЕ" } = {}) {
  const load = lazy ? ' loading="lazy"' : "";
  return `
    <img class="ba__after" src="${esc(after)}" alt="После уборки"${load} />
    <img class="ba__before" src="${esc(before)}" alt="До уборки"${load} />
    <span class="ba__tag ba__tag--before">${esc(capBefore)}</span>
    <span class="ba__tag ba__tag--after">${esc(capAfter)}</span>
    <div class="ba__handle"></div>`;
}

/* ---- страница: ГЛАВНАЯ ---- */
function renderHome() {
  const h = CONFIG.hero;
  $("[data-hero-label]").textContent = h.label;
  $("[data-hero-title]").textContent = h.title;
  $("[data-hero-accent]").textContent = h.accentWord;
  $("[data-hero-tail]").textContent = h.tail;
  $("[data-hero-lead]").textContent = h.lead;
  $("[data-hero-cta]").textContent = h.cta;
  $("[data-hero-cta-sub]").textContent = h.ctaSub;

  const ba = CONFIG.beforeAfter;
  $("[data-hero-ba]").innerHTML = baMarkup(ba.before, ba.after, { lazy: false });
  $("[data-hero-ba-cap]").textContent = ba.caption;

  $("[data-process]").innerHTML = CONFIG.process
    .map(
      (p) => `<div class="process__item"><span class="process__n">${esc(p.n)}</span>
        <h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div>`
    )
    .join("");

  $("[data-services-preview]").innerHTML = CONFIG.services
    .slice(0, 4)
    .map(
      (s) => `<div class="service">
        <div class="service__top"><span class="service__name">${esc(s.name)}</span><span class="service__price">${esc(s.price)}</span></div>
        <p class="service__unit">${esc(s.unit)}</p>
        <p class="service__text">${esc(s.text)}</p>
      </div>`
    )
    .join("");

  $("[data-reviews]").innerHTML = CONFIG.reviews
    .map(
      (r) => `<article class="review"><div class="review__q">"</div>
        <p class="review__text">${esc(r.text)}</p>
        <p class="review__by"><b>${esc(r.name)}</b> · ${esc(r.where)}</p></article>`
    )
    .join("");
}

/* ---- страница: УСЛУГИ ---- */
function renderServices() {
  $("[data-services]").innerHTML = CONFIG.services
    .map(
      (s) => `<div class="service">
        <div class="service__top"><span class="service__name">${esc(s.name)}</span><span class="service__price">${esc(s.price)}</span></div>
        <p class="service__unit">${esc(s.unit)}</p>
        <p class="service__text">${esc(s.text)}</p>
        <ul class="checklist">${s.checklist.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
      </div>`
    )
    .join("");
}

/* ---- страница: О КОМПАНИИ ---- */
function renderAbout() {
  $("[data-stats]").innerHTML = CONFIG.stats
    .map((s) => `<div><div class="stat__n">${esc(s.n)}</div><div class="stat__label">${esc(s.label)}</div></div>`)
    .join("");
  $("[data-values]").innerHTML = CONFIG.values
    .map(
      (v) => `<div class="value"><span class="value__n">${esc(v.n)}</span>
        <div><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p></div></div>`
    )
    .join("");
  $("[data-team]").innerHTML = CONFIG.team
    .map((t) => `<div class="team__card"><b>${esc(t.name)}</b><span>${esc(t.role)}</span></div>`)
    .join("");
}

/* ---- страница: КЕЙСЫ ---- */
function renderCases() {
  $("[data-cases]").innerHTML = CONFIG.cases
    .map(
      (c) => `<figure>
        <div class="ba" data-ba>${baMarkup(c.before, c.after)}</div>
        <figcaption class="ba__cap">${esc(c.title)}</figcaption>
      </figure>`
    )
    .join("");
}

/* ---- страница: КОНТАКТЫ ---- */
function renderContacts() {
  const c = CONFIG.contacts;
  $("[data-contact-list]").innerHTML = `
    <div><dt>ТЕЛЕФОН</dt><dd><a href="tel:${c.phone.replace(/\s/g, "")}">${esc(c.phone)}</a></dd></div>
    <div><dt>ПОЧТА</dt><dd><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></dd></div>
    <div><dt>АДРЕС</dt><dd>${esc(c.address)}</dd></div>
    <div><dt>ЧАСЫ РАБОТЫ</dt><dd>${esc(c.hours)}</dd></div>`;
  $("[data-map]").textContent = `КАРТА · ${c.mapQuery}`;

  const form = $("[data-form]");
  const statusEl = $("[data-status]");
  const submitBtn = $(".form__submit", form);
  const setStatus = (text, cls) => {
    statusEl.textContent = text;
    statusEl.className = `form__status ${cls}`;
  };
  const phoneOk = (v) => (v.match(/\d/g) || []).length >= 10;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    if (name.length < 2) return setStatus("→ Введите имя", "is-err");
    if (!phoneOk(phone)) return setStatus("→ Введите корректный телефон", "is-err");

    submitBtn.disabled = true;
    const original = submitBtn.textContent;
    submitBtn.textContent = "Отправляем…";
    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = original;
      setStatus(`✓ ${name}, заявка принята. Перезвоним на ${phone} для уточнения деталей.`, "is-ok");
    }, 700);
  });
}

/* ---- диспетчер ---- */
const renderers = { home: renderHome, services: renderServices, about: renderAbout, cases: renderCases, contacts: renderContacts };
renderers[page]?.();
initBeforeAfter();

/* ---- самопроверка слайдера до/после: ?selftest ---- */
if (location.search.includes("selftest")) {
  const clamp = (pct) => Math.min(96, Math.max(4, pct));
  console.assert(clamp(-10) === 4, "clamp min");
  console.assert(clamp(150) === 96, "clamp max");
  console.assert(clamp(50) === 50, "clamp mid");
  console.log("selftest ok");
}

/* ---- калькулятор стоимости (главная) ---- */
const calcRoot = $("[data-calc-type]");
if (calcRoot && CONFIG.calculator) {
  const K = CONFIG.calculator;
  const state = { type: K.types[0].id, area: 45, freq: K.freq[0].id };

  const opts = (list, key, host) => {
    host.innerHTML = list
      .map((o) => `<button type="button" class="calc__opt${o.id === state[key] ? " is-on" : ""}" data-v="${o.id}">${esc(o.label)}</button>`)
      .join("");
    $$(".calc__opt", host).forEach((btn) =>
      btn.addEventListener("click", () => {
        state[key] = btn.dataset.v;
        $$(".calc__opt", host).forEach((b) => b.classList.toggle("is-on", b === btn));
        recalc();
      })
    );
  };

  const typeHost = $("[data-calc-type]");
  const freqHost = $("[data-calc-freq]");
  const areaEl = $("[data-calc-area]");
  const areaLbl = $("[data-calc-area-lbl]");
  const priceEl = $("[data-calc-price]");
  const noteEl = $("[data-calc-note]");

  function recalc() {
    const t = K.types.find((x) => x.id === state.type);
    const f = K.freq.find((x) => x.id === state.freq);
    const extra = Math.max(0, state.area - K.baseArea) * t.perM2;
    const price = Math.round((t.base + extra) * f.k / 50) * 50;
    areaLbl.textContent = `${state.area} м²`;
    const from = parseInt(priceEl.dataset.v || "0", 10);
    priceEl.dataset.v = price;
    priceEl.textContent = `${price.toLocaleString("ru-RU")} ₽`;
    cancelAnimationFrame(recalc._raf);
    if (from && from !== price) {
      const t0 = performance.now();
      const tween = (now) => {
        const k = Math.min((now - t0) / 380, 1);
        const val = Math.round(from + (price - from) * (1 - Math.pow(1 - k, 3)));
        priceEl.textContent = `${val.toLocaleString("ru-RU")} ₽`;
        if (k < 1) recalc._raf = requestAnimationFrame(tween);
      };
      recalc._raf = requestAnimationFrame(tween);
    }
    noteEl.textContent = f.note || `${t.label.toLowerCase()} · разовый выезд`;
  }

  opts(K.types, "type", typeHost);
  opts(K.freq, "freq", freqHost);
  areaEl.addEventListener("input", () => {
    state.area = +areaEl.value;
    recalc();
  });
  recalc();
}

/* появление секций при скролле */
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const rvEls = $$(".process__list > *, .services__grid > *, .reviews__grid > *, .calc, .cta-band, .hero__grid > *, .cases__grid > *, .team__grid > *");
  rvEls.forEach((el, i) => {
    el.classList.add("rv");
    el.style.setProperty("--rv-d", (i % 4) * 80 + "ms");
  });
  const rvIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("rv-in"); rvIO.unobserve(en.target); }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
  rvEls.forEach((el) => rvIO.observe(el));
}
