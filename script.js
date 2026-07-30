document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Switcher (Dark / Light Mode)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('portfolio-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      themeToggleBtn.innerHTML = theme === 'dark' ? `
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5"></circle>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
        </svg>
      ` : `
        <svg viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    }
  };

  setTheme(storedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  // 2. Mobile Navigation Toggle
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const primaryNav = document.getElementById('primary-nav');

  if (mobileNavToggle && primaryNav) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.contains('open');
      primaryNav.classList.toggle('open');
      mobileNavToggle.setAttribute('aria-expanded', !isOpen);
    });

    // Close nav on click link
    primaryNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Dynamic Sticky Header & Back to Top Button
  const header = document.querySelector('.site-header');
  
  let backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M12 19V5M5 12l7-7 7 7"/>
      </svg>
    `;
    document.body.appendChild(backToTopBtn);
  }

  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 4. Scrollspy Navigation Highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');

  const highlightNavOnScroll = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll);

  // 5. Scroll Animations (Intersection Observer)
  const fadeElements = document.querySelectorAll('.fade-in');
  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeElements.forEach(el => fadeObserver.observe(el));

  // 6. Dynamic Number Counters
  const counters = document.querySelectorAll('.counter-value');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.getAttribute('data-target'));
        const suffix = entry.target.getAttribute('data-suffix') || '';
        let startTime = null;
        const duration = 1500;

        const updateCounter = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const currentVal = target * easeOutQuart;

          if (target % 1 !== 0) {
            const decimals = target.toString().split('.')[1].length;
            entry.target.innerText = currentVal.toFixed(decimals) + suffix;
          } else {
            entry.target.innerText = Math.floor(currentVal) + suffix;
          }

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            entry.target.innerText = target + suffix;
          }
        };

        requestAnimationFrame(updateCounter);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // 7. Animated Bar Charts
  const barTracks = document.querySelectorAll('.bar-track span');
  const barObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetWidth = entry.target.style.width || '100%';
        entry.target.style.width = '0%';
        setTimeout(() => {
          entry.target.classList.add('animate-bar');
          entry.target.style.width = targetWidth;
        }, 50);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  barTracks.forEach(bar => barObserver.observe(bar));

  // 8. Projects Filtering & Search
  const filterPills = document.querySelectorAll('.filter-pill');
  const searchInput = document.getElementById('project-search');
  const projectCards = document.querySelectorAll('.project-card');

  let activeCategory = 'all';
  let searchQuery = '';

  const filterProjects = () => {
    projectCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const textContent = card.innerText.toLowerCase();
      
      const matchesCategory = activeCategory === 'all' || category.includes(activeCategory);
      const matchesSearch = searchQuery === '' || textContent.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        card.style.animation = 'fadeIn 0.3s ease';
      } else {
        card.style.display = 'none';
      }
    });
  };

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-filter');
      filterProjects();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterProjects();
    });
  }

  // 9. Toast Notification System & Copy to Clipboard
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const showToast = (message) => {
    toastContainer.innerText = message;
    toastContainer.classList.add('show');
    setTimeout(() => {
      toastContainer.classList.remove('show');
    }, 3200);
  };

  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`);
      }).catch(() => {
        showToast('Failed to copy. Please copy manually.');
      });
    });
  });

  // 10. Contact Form Submission Simulation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        showToast('Message sent successfully! Baidurja will get back to you soon.');
        contactForm.reset();
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
      }, 1000);
    });
  }
});
