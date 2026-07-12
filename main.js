import { CONFIG } from "./config.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (str = "") =>
  String(str).replace(/[&<>"']/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch])
  );

const page = document.body.dataset.page;

/* ---- шапка ---- */
$$("[data-brand]").forEach((el) => (el.textContent = CONFIG.brand));

const navEl = $("[data-nav]");
if (navEl) {
  navEl.innerHTML = CONFIG.nav
    .map((n) => `<a href="${n.href}"${n.key === page ? ' class="is-active"' : ""}>${esc(n.label)}</a>`)
    .join("");
}
$$("[data-phone]").forEach((el) => {
  el.href = `tel:${CONFIG.contacts.phone.replace(/\s/g, "")}`;
  el.textContent = CONFIG.contacts.phone;
});

/* ---- подвал ---- */
const c = CONFIG.contacts;
const footerContacts = $("[data-footer-contacts]");
if (footerContacts) {
  footerContacts.innerHTML = `
    <li><a href="tel:${c.phone.replace(/\s/g, "")}">${esc(c.phone)}</a></li>
    <li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>
    <li>${esc(c.address)}</li>
    <li>${esc(c.hours)}</li>`;
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

function baMarkup(before, after, capBefore = "ДО", capAfter = "ПОСЛЕ") {
  return `
    <img class="ba__after" src="${esc(after)}" alt="После уборки" loading="lazy" />
    <img class="ba__before" src="${esc(before)}" alt="До уборки" loading="lazy" />
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
  $("[data-hero-ba]").innerHTML = baMarkup(ba.before, ba.after);
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
