(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Smooth scrolling for header links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      var target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", targetId);
    });
  });

  /* ---------- Section reveal animations ---------- */
  var revealElements = document.querySelectorAll(".reveal, .hero");
  var cardElements = document.querySelectorAll(".about-card, .reason-card, .testimonial-card, .contact-card, .service-card, .people-card, .gallery-card");

  revealElements.forEach(function (element) {
    element.classList.add("reveal");
  });
  cardElements.forEach(function (element) {
    element.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
    cardElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(function (element) {
      element.classList.add("is-visible");
    });
    cardElements.forEach(function (element) {
      element.classList.add("is-visible");
    });
  }

  /* ---------- Subtle parallax motion ---------- */
  var parallaxItems = document.querySelectorAll(".hero-media, .about-panel, .person-card");
  window.addEventListener("scroll", function () {
    var scrollY = window.scrollY;
    parallaxItems.forEach(function (item, index) {
      var offset = (scrollY * (0.03 + index * 0.01)).toFixed(2);
      item.style.setProperty("--parallax-offset", offset + "px");
      item.classList.add("parallax-layer");
    });
  }, { passive: true });

  /* ---------- Scroll progress bar ---------- */
  var progressBar = document.getElementById("scroll-progress");
  function updateProgressBar() {
    if (!progressBar) return;
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + "%";
  }
  updateProgressBar();
  window.addEventListener("scroll", updateProgressBar, { passive: true });
  window.addEventListener("resize", updateProgressBar);

  /* ---------- Mobile nav toggle ---------- */
  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("nav-toggle");
  var mobileMenu = document.getElementById("mobile-menu");

  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var isOpen = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close the menu after choosing a link
    if (mobileMenu) {
      mobileMenu.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
          header.classList.remove("nav-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }
  }

  /* ---------- Animated ledger counters ---------- */
  var counters = document.querySelectorAll(".counter[data-target]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function formatCounter(el, value) {
    var isCurrency = el.closest(".passbook-total") !== null;
    var rounded = Math.round(value);
    var formatted = rounded.toLocaleString("en-NG");
    el.textContent = isCurrency ? "\u20A6" + formatted : formatted;
  }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-target"), 10);
    if (isNaN(target)) return;

    if (reduceMotion) {
      formatCounter(el, target);
      return;
    }

    var duration = 1400;
    var startTime = null;

    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      formatCounter(el, target * eased);
      if (progress < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  if (counters.length) {
    if ("IntersectionObserver" in window) {
      var counterObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach(function (el) {
        counterObserver.observe(el);
      });
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    ".product-card, .ledger-steps li, .story-card, .section-head"
  );
  revealTargets.forEach(function (el) {
    el.setAttribute("data-reveal", "");
  });

  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Callback request form ---------- */
  var form = document.getElementById("cta-form");
  var note = document.getElementById("form-note");
  var NIGERIAN_PHONE = /^(0|\+234)[789][01]\d{8}$/;

  if (form && note) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var fullname = form.fullname.value.trim();
      var phone = form.phone.value.trim().replace(/\s+/g, "");
      var branch = form.branch.value;

      if (fullname.length < 3) {
        note.textContent = "Please enter your full name.";
        form.fullname.focus();
        return;
      }
      if (!NIGERIAN_PHONE.test(phone)) {
        note.textContent = "Please enter a valid Nigerian phone number.";
        form.phone.focus();
        return;
      }
      if (!branch) {
        note.textContent = "Please choose your nearest branch.";
        form.branch.focus();
        return;
      }

      var firstName = fullname.split(" ")[0];
      note.style.color = "var(--green-900)";
      note.textContent =
        "Thank you, " + firstName + " — an agent from " + branch + " will call you within one business day.";
      form.reset();
    });
  }

  /* ---------- Gallery lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImage = document.getElementById("lightbox-image");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var lightboxClose = document.getElementById("lightbox-close");

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = src;
    lightboxImage.alt = alt || "Gallery image";
    lightboxCaption.textContent = alt || "Refined Benefits gallery image.";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".gallery-card img, .people-card img").forEach(function (img) {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", function () {
      openLightbox(img.src, img.alt);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox || event.target === lightboxClose) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });

  /* ---------- Sticky header shadow on scroll ---------- */
  var lastScroll = 0;
  window.addEventListener(
    "scroll",
    function () {
      if (!header) return;
      var scrolled = window.scrollY > 12;
      header.style.boxShadow = scrolled ? "0 1px 0 rgba(15,61,46,0.08)" : "none";
      lastScroll = window.scrollY;
    },
    { passive: true }
  );

  /* ---------- Theme switcher (light / dark) ---------- */
  (function () {
    try {
      var stored = localStorage.getItem("theme");
      var systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

      function applyTheme(theme) {
        if (theme === "dark") {
          document.documentElement.setAttribute("data-theme", "dark");
          localStorage.setItem("theme", "dark");
        } else {
          document.documentElement.removeAttribute("data-theme");
          localStorage.setItem("theme", "light");
        }
      }

      // initial
      if (stored === "dark" || (!stored && systemPrefersDark)) {
        applyTheme("dark");
      }

      // build UI
      var switcher = document.createElement("div");
      switcher.className = "theme-switcher";
      switcher.innerHTML =
        '<span aria-hidden="true">☀️</span>' +
        '<button type="button" class="toggle" aria-label="Toggle theme" aria-pressed="false"><span class="knob"></span></button>' +
        '<span aria-hidden="true">🌙</span>';
      var footerBottom = document.querySelector(".footer-bottom");
      if (footerBottom) {
        footerBottom.appendChild(switcher);
      } else {
        document.body.appendChild(switcher);
      }

      var toggleBtn = switcher.querySelector(".toggle");

      function updateUI() {
        var isDark = document.documentElement.getAttribute("data-theme") === "dark";
        toggleBtn.setAttribute("aria-pressed", String(isDark));
      }

      toggleBtn.addEventListener("click", function () {
        var isDark = document.documentElement.getAttribute("data-theme") === "dark";
        applyTheme(isDark ? "light" : "dark");
        updateUI();
      });

      toggleBtn.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleBtn.click();
        }
      });

      updateUI();
    } catch (err) {
      // silent fail — do not break main script
      console.warn("Theme switcher init error", err);
    }
  })();

  /* ---------- Prominent floating object + cursor-follow effect ---------- */
  (function () {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      var cursor = document.createElement('div');
      cursor.className = 'cursor-light';
      document.body.appendChild(cursor);

      var mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
      var fx = 0, fy = 0;

      function onMove(e) {
        mouseX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || mouseX;
        mouseY = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY) || mouseY;
        cursor.style.opacity = '0.12';
        // (orb removed) only update cursor opacity here
      }

      // smooth cursor follow
      function rafLoop() {
        fx += (mouseX - fx) * 0.18;
        fy += (mouseY - fy) * 0.18;
        cursor.style.transform = 'translate(' + fx + 'px, ' + fy + 'px) translate(-50%, -50%)';
        requestAnimationFrame(rafLoop);
      }

      window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('touchmove', onMove, { passive: true });
      window.addEventListener('mouseleave', function () { cursor.style.opacity = '0'; }, { passive: true });

      rafLoop();
    } catch (err) {
      console.warn('Floating object init failed', err);
    }
  })();

  /* ---------- Subtle cinematic snow (decorative) ---------- */
  (function () {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      var canvas = document.createElement('canvas');
      canvas.className = 'snow-canvas';
      document.body.appendChild(canvas);
      var ctx = canvas.getContext('2d');

      var DPR = window.devicePixelRatio || 1;
      var particles = [];

      function resizeCanvas() {
        canvas.width = Math.max(1, window.innerWidth) * DPR;
        canvas.height = Math.max(1, window.innerHeight) * DPR;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      }

      function initParticles() {
        var count = Math.min(60, Math.max(12, Math.floor(window.innerWidth / 40)));
        particles = [];
        for (var i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 1.8 + 0.6,
            speed: Math.random() * 0.4 + 0.15,
            drift: (Math.random() - 0.5) * 0.6,
            opacity: 0.02 + Math.random() * 0.05
          });
        }
      }

      function step() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (var i = 0; i < particles.length; i++) {
          var p = particles[i];
          p.y += p.speed;
          p.x += p.drift;
          if (p.y > window.innerHeight + 10) {
            p.y = -10;
            p.x = Math.random() * window.innerWidth;
          }
          if (p.x < -10) p.x = window.innerWidth + 10;
          if (p.x > window.innerWidth + 10) p.x = -10;
          ctx.beginPath();
          ctx.fillStyle = 'rgba(255,255,255,' + p.opacity + ')';
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        requestAnimationFrame(step);
      }

      resizeCanvas();
      initParticles();
      requestAnimationFrame(step);

      var resizeTimeout;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
          resizeCanvas();
          initParticles();
        }, 120);
      });

      // Add grain overlay element
      var grain = document.createElement('div');
      grain.className = 'grain-overlay';
      document.body.appendChild(grain);

    } catch (err) {
      console.warn('Snow init failed', err);
    }
  })();
})();
