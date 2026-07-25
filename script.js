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

// Typewriter animation for the hero job title
const heroRoleText = document.getElementById("heroRoleText");

if (heroRoleText) {
  const roleString = "Software Development Engineer in Test (SDET)";
  let charIndex = 0;

  const typeNextChar = () => {
    if (charIndex <= roleString.length) {
      heroRoleText.textContent = roleString.slice(0, charIndex);
      charIndex++;
      setTimeout(typeNextChar, 45);
    }
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    heroRoleText.textContent = roleString;
  } else {
    setTimeout(typeNextChar, 600);
  }
}