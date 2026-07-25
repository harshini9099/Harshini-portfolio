// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// Light / dark theme toggle
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("light", !themeToggle.checked);
});

// Scroll-reveal animations
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in-view"));
}

// Poster wall slider
const posterTrack = document.getElementById("posterTrack");
const posterPrev = document.getElementById("posterPrev");
const posterNext = document.getElementById("posterNext");
const posterDotsWrap = document.getElementById("posterDots");
const posterSlider = document.getElementById("posterSlider");

if (posterTrack) {
  const cards = Array.from(posterTrack.children);
  let index = 0;
  let perView = 1;
  let autoplayId = null;

  const getPerView = () => {
    const trackWidth = posterTrack.parentElement.clientWidth;
    const cardWidth = cards[0].getBoundingClientRect().width + 20; // gap
    return Math.max(1, Math.floor(trackWidth / cardWidth));
  };

  const maxIndex = () => Math.max(0, cards.length - perView);

  const buildDots = () => {
    posterDotsWrap.innerHTML = "";
    const dotCount = maxIndex() + 1;
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement("button");
      dot.className = "poster-dot" + (i === index ? " active" : "");
      dot.setAttribute("aria-label", "Go to poster " + (i + 1));
      dot.addEventListener("click", () => {
        index = i;
        update();
      });
      posterDotsWrap.appendChild(dot);
    }
  };

  const update = () => {
    const cardWidth = cards[0].getBoundingClientRect().width + 20;
    posterTrack.style.transform = `translateX(-${index * cardWidth}px)`;
    Array.from(posterDotsWrap.children).forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  };

  const goNext = () => {
    index = index >= maxIndex() ? 0 : index + 1;
    update();
  };

  const goPrev = () => {
    index = index <= 0 ? maxIndex() : index - 1;
    update();
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayId = setInterval(goNext, 4000);
  };
  const stopAutoplay = () => {
    if (autoplayId) clearInterval(autoplayId);
  };

  const init = () => {
    perView = getPerView();
    index = Math.min(index, maxIndex());
    buildDots();
    update();
  };

  posterNext.addEventListener("click", () => {
    goNext();
    startAutoplay();
  });
  posterPrev.addEventListener("click", () => {
    goPrev();
    startAutoplay();
  });

  posterSlider.addEventListener("mouseenter", stopAutoplay);
  posterSlider.addEventListener("mouseleave", startAutoplay);

  // Touch swipe support
  let touchStartX = 0;
  posterTrack.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    stopAutoplay();
  });
  posterTrack.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff > 40) goPrev();
    else if (diff < -40) goNext();
    startAutoplay();
  });

  window.addEventListener("resize", init);
  init();
  startAutoplay();
}

// Subtle mouse-tilt effect on project cards
document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * -6;
    const rotateY = ((x - rect.width / 2) / rect.width) * 6;
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// Typewriter animation for the hero job title — loops through multiple titles
const heroRoleText = document.getElementById("heroRoleText");

if (heroRoleText) {
  // Edit this list to add/remove titles that cycle continuously
  const roleStrings = [
    "Software Development Engineer in Test (SDET)",
    "QA Automation Engineer",
    "Test Automation Architect",
  ];

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    heroRoleText.textContent = roleStrings[0];
  } else {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const TYPE_SPEED = 45;
    const DELETE_SPEED = 25;
    const HOLD_TIME = 1800;
    const SWITCH_PAUSE = 400;

    const tick = () => {
      const currentRole = roleStrings[roleIndex];

      if (!isDeleting) {
        charIndex++;
        heroRoleText.textContent = currentRole.slice(0, charIndex);

        if (charIndex === currentRole.length) {
          isDeleting = true;
          setTimeout(tick, HOLD_TIME);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex--;
        heroRoleText.textContent = currentRole.slice(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roleStrings.length;
          setTimeout(tick, SWITCH_PAUSE);
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    };

    setTimeout(tick, 600);
  }
}

// Ambient particle network background
const networkCanvas = document.getElementById("bgNetwork");

if (networkCanvas) {
  const ctx = networkCanvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const DOT_COLOR = "99, 149, 255";
  const LINE_COLOR = "99, 149, 255";
  const MAX_DISTANCE = 140;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  let width = 0;
  let height = 0;
  let particles = [];
  let animationId = null;

  const particleCount = () => {
    const area = window.innerWidth * window.innerHeight;
    return Math.max(35, Math.min(90, Math.round(area / 16000)));
  };

  const createParticles = () => {
    const count = particleCount();
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 1,
    }));
  };

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    networkCanvas.width = width * DPR;
    networkCanvas.height = height * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    createParticles();
  };

  const step = () => {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${DOT_COLOR}, 0.55)`;
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DISTANCE) {
          const opacity = (1 - dist / MAX_DISTANCE) * 0.22;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${LINE_COLOR}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(step);
  };

  resize();

  if (!prefersReducedMotion) {
    step();
    window.addEventListener("resize", () => {
      if (animationId) cancelAnimationFrame(animationId);
      resize();
      step();
    });
  } else {
    // Draw a single static frame of dots only, no motion
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${DOT_COLOR}, 0.4)`;
      ctx.fill();
    }
  }
}