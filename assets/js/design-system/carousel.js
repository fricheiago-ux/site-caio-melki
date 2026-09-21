/*
  Carrossel com Ken Burns e parallax — lógica da ref-4.
  .carousel-slide troca de .active a cada 5s (imagem escala 1 -> 1.12 em 10s)
  .parallax-img desloca no scroll conforme data-speed
*/
(function () {
  // Carrossel
  const slides = document.querySelectorAll('.carousel-slide');
  let currentSlide = 0;
  if (slides.length > 1) {
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 5000);
  }

  // Parallax
  const parallaxEls = document.querySelectorAll('.parallax-img');
  if (parallaxEls.length) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        parallaxEls.forEach((el) => {
          const speed = el.dataset.speed || 0.1;
          el.style.transform = `translateY(${scrolled * speed}px)`;
        });
        ticking = false;
      });
    }, { passive: true });
  }
})();
