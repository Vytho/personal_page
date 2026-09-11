// Shared page effects: scroll reveal, typing line, scroll progress.
(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Scroll reveal ---
  const revealEls = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('visible'));
  } else {
    let batch = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.style.transitionDelay = `${(batch++ % 4) * 90}ms`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
        batch = 0;
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  // --- Terminal typing line ---
  const typed = document.getElementById('typed');
  if (typed) {
    const words = (typed.dataset.words || '').split('|').filter(Boolean);
    if (reducedMotion || words.length === 0) {
      typed.textContent = words[0] || typed.textContent;
    } else {
      let wordIdx = 0;
      let charIdx = 0;
      let deleting = false;

      const tick = () => {
        const word = words[wordIdx];
        charIdx += deleting ? -1 : 1;
        typed.textContent = word.slice(0, charIdx);

        let delay = deleting ? 40 : 75;
        if (!deleting && charIdx === word.length) {
          deleting = true;
          delay = 1800; // pause on the full word
        } else if (deleting && charIdx === 0) {
          deleting = false;
          wordIdx = (wordIdx + 1) % words.length;
          delay = 350;
        }
        setTimeout(tick, delay);
      };
      tick();
    }
  }

  // --- Scroll progress bar ---
  if (!reducedMotion) {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }
})();
