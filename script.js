/* ════════════════════════════════════════════════════
   INVITACIÓN XV AÑOS · ALEXA YULIANA · script.js
   HTML, CSS y JavaScript vanilla — sin frameworks.
   ════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   1. CONFIGURACIÓN — edita fácilmente aquí
   ───────────────────────────────────────────── */

// Fecha del evento: 17 de julio de 2026, 8:00 PM (hora local).
const EVENT_DATE = new Date(2026, 6, 17, 20, 0, 0); // mes 6 = julio

// Número de WhatsApp (formato internacional, sin "+", espacios ni guiones).
// Ejemplo México: 52 + 10 dígitos.
const WHATSAPP_NUMBER = "526862403401";

// Mensaje que se enviará por WhatsApp al confirmar.
// Los campos quedan en blanco para que el invitado los complete antes de enviar.
const WHATSAPP_MESSAGE =
  "¡Hola! Confirmo mi asistencia a los XV años de Alexa Yuliana 🌺\n\n" +
  "Nombre(s): ";

// Fotografías de la galería.
// Para sustituirlas, basta con cambiar las rutas o reemplazar los archivos
// dentro de la carpeta /Highlights/ conservando los mismos nombres.
const photos = [
  "Highlights/IMG_4535.jpeg",
  "Highlights/IMG_4541.jpeg",
  "Highlights/IMG_4544.jpeg",
];

// ───── ENCUADRE VERTICAL DE CADA FOTO ─────
// ¿Una foto sale recortada en el carrusel? Ajusta su número aquí.
//   0   = mostrar la parte de ARRIBA de la foto
//   50  = mostrar el CENTRO (valor por defecto)
//   100 = mostrar la parte de ABAJO
// Solo cambia el número de la foto que quieras. Las que no estén aquí
// usan 50 (centro) automáticamente.
const photoFraming = {
  "Highlights/IMG_4535.jpeg": 50,
  "Highlights/IMG_4541.jpeg": 50,
  "Highlights/IMG_4544.jpeg": 25,
};

/* ─────────────────────────────────────────────
   2. CUENTA REGRESIVA
   ───────────────────────────────────────────── */
(function initCountdown() {
  const elDays = document.getElementById("cd-days");
  const elHours = document.getElementById("cd-hours");
  const elMins = document.getElementById("cd-mins");
  const elSecs = document.getElementById("cd-secs");
  const elDone = document.getElementById("cd-done");
  const grid = document.querySelector(".countdown__grid");

  const pad = (n) => String(n).padStart(2, "0");

  function tick() {
    const diff = EVENT_DATE.getTime() - Date.now();

    if (diff <= 0) {
      if (grid) grid.style.display = "none";
      if (elDone) elDone.hidden = false;
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMins.textContent = pad(mins);
    elSecs.textContent = pad(secs);
  }

  tick();
  const timer = setInterval(tick, 1000);
})();

/* ─────────────────────────────────────────────
   3. GALERÍA / CARRUSEL
   ───────────────────────────────────────────── */
(function initCarousel() {
  const track = document.getElementById("carouselTrack");
  const dotsWrap = document.getElementById("carouselDots");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!track || !photos.length) return;

  let index = 0;
  let autoTimer = null;
  const AUTOPLAY_MS = 4500;

  // Construir diapositivas
  photos.forEach((src, i) => {
    const slide = document.createElement("div");
    slide.className = "carousel__slide";
    const img = document.createElement("img");
    img.src = src;
    img.alt = "Recuerdo de Alexa Yuliana " + (i + 1);
    img.loading = i === 0 ? "eager" : "lazy";
    // Aplica el encuadre vertical definido en photoFraming (50 = centro por defecto)
    const framing = photoFraming[src] != null ? photoFraming[src] : 50;
    img.style.objectPosition = "center " + framing + "%";
    slide.appendChild(img);
    track.appendChild(slide);

    const dot = document.createElement("button");
    dot.className = "carousel__dot";
    dot.type = "button";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Ir a la foto " + (i + 1));
    dot.addEventListener("click", () => goTo(i, true));
    dotsWrap.appendChild(dot);
  });

  const slides = Array.from(track.children);
  const dots = Array.from(dotsWrap.children);

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((s, i) => s.classList.toggle("carousel__slide--active", i === index));
    dots.forEach((d, i) => d.classList.toggle("carousel__dot--active", i === index));
  }

  function goTo(i, fromUser) {
    index = (i + slides.length) % slides.length;
    update();
    if (fromUser) restartAuto();
  }

  const next = (fromUser) => goTo(index + 1, fromUser);
  const prev = (fromUser) => goTo(index - 1, fromUser);

  function startAuto() {
    autoTimer = setInterval(() => next(false), AUTOPLAY_MS);
  }
  function restartAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  nextBtn.addEventListener("click", () => next(true));
  prevBtn.addEventListener("click", () => prev(true));

  // Pausar autoplay al pasar el cursor
  const carousel = track.closest(".carousel");
  carousel.addEventListener("mouseenter", () => clearInterval(autoTimer));
  carousel.addEventListener("mouseleave", startAuto);

  // Soporte de gestos táctiles (swipe)
  let startX = 0;
  let dragging = false;
  carousel.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    dragging = true;
  }, { passive: true });
  carousel.addEventListener("touchend", (e) => {
    if (!dragging) return;
    dragging = false;
    const delta = e.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 45) (delta < 0 ? next : prev)(true);
  });

  // Navegación con teclado
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") next(true);
    if (e.key === "ArrowLeft") prev(true);
  });

  update();
  startAuto();
})();

/* ─────────────────────────────────────────────
   4. CONFIRMACIÓN POR WHATSAPP
   ───────────────────────────────────────────── */
(function initRSVP() {
  const btn = document.getElementById("rsvpBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const url =
      "https://wa.me/" +
      WHATSAPP_NUMBER +
      "?text=" +
      encodeURIComponent(WHATSAPP_MESSAGE);
    window.open(url, "_blank", "noopener");
  });
})();

/* ─────────────────────────────────────────────
   5. ANIMACIONES AL HACER SCROLL (reveal)
   ───────────────────────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach((el) => observer.observe(el));
})();

/* ─────────────────────────────────────────────
   6. PÉTALOS FLOTANTES (decoración sutil)
   ───────────────────────────────────────────── */
(function initPetals() {
  const layer = document.querySelector(".petals");
  if (!layer) return;

  // Respetar la preferencia de movimiento reducido
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;



  const glyphs = ["🌺", "🌸"];
  const COUNT = 14;

  for (let i = 0; i < COUNT; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    const glyph = glyphs[i % glyphs.length];
    if (glyph.charAt(0) === "<") {
      petal.classList.add("petal--leaf");
      petal.innerHTML = glyph;
    } else {
      petal.textContent = glyph;
    }

    const size = 0.7 + Math.random() * 1.1;       // rem
    const duration = 9 + Math.random() * 9;        // s
    const delay = Math.random() * 12;              // s

    petal.style.left = Math.random() * 100 + "%";
    petal.style.fontSize = size + "rem";
    petal.style.animationDuration = duration + "s";
    petal.style.animationDelay = "-" + delay + "s";
    petal.style.opacity = 0.35 + Math.random() * 0.4;

    layer.appendChild(petal);
  }
})();
