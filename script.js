document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Sticky Header
  const header = document.querySelector('.site-header');
  
  // 2. Back to Top Button
  const backToTopBtn = document.createElement('button');
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.setAttribute('aria-label', 'Back to top');
  backToTopBtn.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
  `;
  document.body.appendChild(backToTopBtn);

  // Scroll Event Listener for Header and Back to Top
  window.addEventListener('scroll', () => {
    // Header effect
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  // Back to Top Click Action
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 3. Scroll Animations (Intersection Observer)
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
  };

  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after animating in to keep it visible
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => {
    fadeObserver.observe(el);
  });

  // 4. Dynamic Number Counters
  const counters = document.querySelectorAll('.counter-value');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.getAttribute('data-target'));
        const suffix = entry.target.getAttribute('data-suffix') || '';
        
        let startTime = null;
        const duration = 1500; // 1.5 seconds

        const updateCounter = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          
          // Easing function for smooth stop
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const currentVal = target * easeOutQuart;

          // Format: if target has decimal, keep decimals, else whole number
          if (target % 1 !== 0) {
            // Keep original decimal precision (e.g., 25.17 -> 2 decimals)
            const decimals = target.toString().split('.')[1].length;
            entry.target.innerText = currentVal.toFixed(decimals) + suffix;
          } else {
            entry.target.innerText = Math.floor(currentVal) + suffix;
          }

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            entry.target.innerText = target + suffix; // Ensure exact final value
          }
        };

        requestAnimationFrame(updateCounter);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });

  // 5. Animated Bar Charts
  const barTracks = document.querySelectorAll('.bar-track span');
  const barObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Find the target width from the inline style or parent
        const parent = entry.target.parentElement;
        const targetWidth = entry.target.style.width || parent.previousElementSibling.style.getPropertyValue('--bar');
        if (targetWidth) {
          entry.target.style.width = '0%';
          setTimeout(() => {
            entry.target.classList.add('animate-bar');
            entry.target.style.width = targetWidth;
          }, 50);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  barTracks.forEach(bar => {
    barObserver.observe(bar);
  });
});
