/* =================================================================
   GASTÓN PÁEZ · PORTFOLIO — interacciones
   ================================================================= */
(function () {
  "use strict";

  /* ---------- Carga / reveal inicial del hero ---------- */
  window.addEventListener("load", function () {
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-loaded");
  });
  // Fallback por si 'load' tarda
  setTimeout(function () {
    document.body.classList.add("is-loaded");
  }, 700);

  /* ---------- Año del footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar: estado al hacer scroll ---------- */
  var topbar = document.querySelector(".topbar");
  function onScroll() {
    if (window.scrollY > 40) topbar.classList.add("is-stuck");
    else topbar.classList.remove("is-stuck");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var drawer = document.querySelector(".drawer");
  if (toggle && drawer) {
    toggle.addEventListener("click", function () {
      var open = drawer.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      drawer.setAttribute("aria-hidden", open ? "false" : "true");
      document.body.style.overflow = open ? "hidden" : "";
    });
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        drawer.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        drawer.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Scroll reveal con IntersectionObserver ---------- */
  var revealEls = document.querySelectorAll(".reveal-up");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Cursor personalizado ---------- */
  var canHover = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  if (canHover) {
    var ring = document.querySelector(".cursor");
    var dot = document.querySelector(".cursor-dot");
    var rx = window.innerWidth / 2, ry = window.innerHeight / 2;
    var dx = rx, dy = ry;

    document.addEventListener("mousemove", function (e) {
      dx = e.clientX; dy = e.clientY;
      dot.style.transform = "translate(" + dx + "px," + dy + "px) translate(-50%,-50%)";
    });

    (function loop() {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();

    // Estados según data-cursor
    document.querySelectorAll("[data-cursor]").forEach(function (el) {
      var type = el.getAttribute("data-cursor");
      el.addEventListener("mouseenter", function () {
        ring.classList.add(type === "view" ? "is-view" : "is-hover");
      });
      el.addEventListener("mouseleave", function () {
        ring.classList.remove("is-hover", "is-view");
      });
    });

    document.addEventListener("mouseleave", function () {
      ring.style.opacity = "0"; dot.style.opacity = "0";
    });
    document.addEventListener("mouseenter", function () {
      ring.style.opacity = "1"; dot.style.opacity = "1";
    });
  }

  /* ---------- Formulario (Formspree, sin recargar) ---------- */
  var form = document.querySelector(".contact-form");
  if (form) {
    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form-status";
      status.textContent = "Enviando…";
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            status.classList.add("ok");
            status.textContent = "Mensaje enviado. ¡Gracias!";
          } else {
            status.classList.add("err");
            status.textContent = "Hubo un problema. Probá por correo.";
          }
        })
        .catch(function () {
          status.classList.add("err");
          status.textContent = "Sin conexión. Escribime por correo.";
        });
    });
  }

  /* ---------- Smooth scroll para anclas internas ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length > 1) {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });
})();
