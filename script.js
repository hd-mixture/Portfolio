const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    if (isDarkMode) {
      enableDarkMode();
    }

    darkModeToggle.addEventListener('change', () => {
      if (darkModeToggle.checked) {
        enableDarkMode();
      } else {
        disableDarkMode();
      }
    });
    function enableDarkMode() {
      body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'enabled');
    }

    function disableDarkMode() {
      body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'disabled');
    }

// --- Enhanced navigation highlighting (click + scroll) ---
(function() {
  // Select both navs
  const desktopNavLinks = document.querySelectorAll('.desktop-nav li a');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav li a');
  // Use desktop nav for section list (they are the same)
  const navLinks = desktopNavLinks.length ? desktopNavLinks : mobileNavLinks;
  const sectionIds = Array.from(navLinks).map(link => link.getAttribute('href').replace('#', ''));
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  let isScrolling = false;
  let scrollTimeout;

  // Helper to sync active class on both navs
  function setActive(idx) {
    desktopNavLinks.forEach((l, i) => l.classList.toggle('active', i === idx));
    mobileNavLinks.forEach((l, i) => l.classList.toggle('active', i === idx));
  }

  // Handle click events
  [desktopNavLinks, mobileNavLinks].forEach(linkList => {
    linkList.forEach((link, idx) => {
      link.addEventListener('click', function(e) {
        setActive(idx);
        isScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isScrolling = false;
        }, 1000);
      });
    });
  });

  // Handle scroll events
  function onScroll() {
    if (isScrolling) return;
    const center = window.innerHeight / 2;
    let activeIdx = 0;
    for (let i = 0; i < sections.length; i++) {
      const rect = sections[i].getBoundingClientRect();
      if (rect.top <= center && rect.bottom > center) {
        activeIdx = i;
        break;
      }
    }
    setActive(activeIdx);
  }

  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onScroll);
  document.addEventListener('DOMContentLoaded', onScroll);
})();

// --- Mobile nav auto-hide logic (only for .mobile-nav) ---
(function() {
  const nav = document.querySelector('.mobile-nav');
  if (!nav) return;
  let lastScrollY = window.scrollY;
  let hideTimeout;

  function showNav() {
    nav.classList.remove('nav-hidden');
  }
  function hideNav() {
    nav.classList.add('nav-hidden');
  }
  function resetHideTimer() {
    showNav();
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      hideNav();
    }, 5000);
  }

  window.addEventListener('scroll', function() {
    if (window.innerWidth > 600) return;
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
      hideNav();
    } else if (currentScrollY < lastScrollY) {
      showNav();
      resetHideTimer();
    }
    lastScrollY = currentScrollY;
  });

  ['touchstart', 'mousemove', 'keydown', 'click'].forEach(evt => {
    window.addEventListener(evt, function() {
      if (window.innerWidth > 600) return;
      showNav();
      resetHideTimer();
    });
  });

  if (window.innerWidth <= 600) {
    resetHideTimer();
  }
})();

// Timeline scroll-triggered animation
function revealOnScroll() {
  const revealElements = document.querySelectorAll('.section-reveal, .timeline-dot, .timeline-date, .timeline-content');
  const observer = new window.IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.15 });
  revealElements.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', revealOnScroll);

// Project Modal Popups
const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const closeModalBtn = document.getElementById('closeModal');

document.querySelectorAll('.view-project').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const card = this.closest('.project-card');
    modalTitle.textContent = card.getAttribute('data-title');
    modalDesc.textContent = card.getAttribute('data-desc');
    modal.classList.add('active');
  });
});
closeModalBtn.addEventListener('click', () => {
  modal.classList.remove('active');
});
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('active');
});

// Download icon animation to checkmark
const downloadBtn = document.querySelector('.download-resume-icon');
if (downloadBtn) {
  downloadBtn.addEventListener('click', function(e) {
    // Let the download happen, but animate icon
    this.classList.add('success');
    setTimeout(() => {
      this.classList.remove('success');
    }, 1200);
  });
}

document.addEventListener("DOMContentLoaded", function() {
  function revealOnScroll() {
    document.querySelectorAll('.section-reveal').forEach(function(el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        el.classList.add('visible');
      }
    });
  }
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();
});

// Graphic Design Portfolio
document.addEventListener('DOMContentLoaded', function() {
    const designModal = document.getElementById('designModal');
    const closeDesignModal = document.getElementById('closeDesignModal');
    const designGallery = document.getElementById('designGallery');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    // Open design modal when clicking "View Portfolio"
    document.querySelector('a[href="#"][class="project-link"]').addEventListener('click', function(e) {
        e.preventDefault();
        designModal.style.display = 'block';
        loadDesigns('all');
    });

    // Close design modal
    closeDesignModal.addEventListener('click', function() {
        designModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === designModal) {
            designModal.style.display = 'none';
        }
    });

    // Category filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Load designs for selected category
            loadDesigns(this.dataset.category);
        });
    });

    // Function to load designs
    function loadDesigns(category) {
        // Clear existing gallery
        designGallery.innerHTML = '';
        
        // Define design categories and their images
        const designs = {
            android: [
                { src: 'Graphic Designs/Android_Screen_Images/IMG-20250408-WA0020.jpg', title: 'Android Screen Design 1' },
                { src: 'Graphic Designs/Android_Screen_Images/IMG-20250408-WA0021.jpg', title: 'Android Screen Design 2' },
                { src: 'Graphic Designs/Android_Screen_Images/IMG-20250408-WA0022.jpg', title: 'Android Screen Design 3' },
                { src: 'Graphic Designs/Android_Screen_Images/IMG-20250408-WA0024.jpg', title: 'Android Screen Design 4' },
                { src: 'Graphic Designs/Android_Screen_Images/IMG-20250408-WA0025.jpg', title: 'Android Screen Design 5' }
            ],
            web: [
                { src: 'Graphic Designs/Web_Screen_Images/Webpage Design_1.png', title: 'Web Screen Design 1' },
                { src: 'Graphic Designs/Web_Screen_Images/Webpage Design_2.png', title: 'Web Screen Design 2' },
                { src: 'Graphic Designs/Web_Screen_Images/Webpage Design_3.png', title: 'Web Screen Design 3' },
                { src: 'Graphic Designs/Web_Screen_Images/Webpage Design_4.png', title: 'Web Screen Design 4' },
                { src: 'Graphic Designs/Web_Screen_Images/Webpage Design_5.png', title: 'Web Screen Design 5' },
                { src: 'Graphic Designs/Web_Screen_Images/Webpage Design_6.png', title: 'Web Screen Design 6' },
                { src: 'Graphic Designs/Web_Screen_Images/Webpage Design_7.png', title: 'Web Screen Design 7' },
                { src: 'Graphic Designs/Web_Screen_Images/Webpage Design_8.png', title: 'Web Screen Design 8' }
            ],
            banners: [
                { src: 'Graphic Designs/Banner/Blood Donation E-Banner_.jpg', title: 'Banner Design 1' },
                { src: 'Graphic Designs/Banner/BOD Navrati Banner.png', title: 'Banner Design 2' },
                { src: 'Graphic Designs/Banner/Diploma Summer Result 2024 Banner.png', title: 'Banner Design 3' },
                { src: 'Graphic Designs/Banner/IMG-20250311-WA0023.jpg', title: 'Banner Design 4' },
                { src: 'Graphic Designs/Banner/Main Banner.png', title: 'Banner Design 5' },
                { src: 'Graphic Designs/Banner/Sec- Tec Banner Graphic Poster Final Day.jpg', title: 'Banner Design 6' },
                { src: 'Graphic Designs/Banner/Sec- Tec Game Banner.jpg', title: 'Banner Design 7' }
            ],
            certificates: [
                { src: 'Graphic Designs/Certificate/BOD Potery Certificate - 2.jpg', title: 'Certificate Design 1' },
                { src: 'Graphic Designs/Certificate/Certificate on Webinar.jpg', title: 'Certificate Design 2' },
                { src: 'Graphic Designs/Certificate/WordPrees Certificate_.jpg', title: 'Certificate Design 3' }
            ],
            logos: [
                { src: 'Graphic Designs/Logos/ABHAR Orange Resize Logo.png', title: 'Logo Design 1' },
                { src: 'Graphic Designs/Logos/BIttStock App Logo.png', title: 'Logo Design 2' },
                { src: 'Graphic Designs/Logos/Campus Cuisin Logo.jpg', title: 'Logo Design 3' },
                { src: 'Graphic Designs/Logos/Driving Licence App Logo.png', title: 'Logo Design 4' },
                { src: 'Graphic Designs/Logos/Netflix Unlock Creative Logo.png', title: 'Logo Design 5' },
                { src: 'Graphic Designs/Logos/Neural Grafix Logo.png', title: 'Logo Design 6' },
                { src: 'Graphic Designs/Logos/save_share_logo1.png', title: 'Logo Design 7' },
                { src: 'Graphic Designs/Logos/YASHODA Logo.png', title: 'Logo Design 8' }
            ],
            posters: [
                { src: 'Graphic Designs/Poster/BOD Blood Donation Poster.jpg', title: 'Poster Design 1' },
                { src: 'Graphic Designs/Poster/BOD Freshers Poster Beginning.jpg', title: 'Poster Design 2' },
                { src: 'Graphic Designs/Poster/BOD Ganesh Mahotsav Poster.jpg', title: 'Poster Design 3' },
                { src: 'Graphic Designs/Poster/BOD Independence Day.jpg', title: 'Poster Design 4' },
                { src: 'Graphic Designs/Poster/BOD Letter Exchange PanColombo.jpg', title: 'Poster Design 5' },
                { src: 'Graphic Designs/Poster/BOD National Cinema Day.jpg', title: 'Poster Design 6' },
                { src: 'Graphic Designs/Poster/BOD Physically Challenged Poster Page 3.jpg', title: 'Poster Design 7' },
                { src: 'Graphic Designs/Poster/BOD Raksha_Bandhan.jpg', title: 'Poster Design 8' },
                { src: 'Graphic Designs/Poster/BOD World Physo Day.jpg', title: 'Poster Design 9' },
                { src: 'Graphic Designs/Poster/BOD મિત્રતા - એક સંબંધ.jpg', title: 'Poster Design 10' }
            ]
        };

        // Show all designs or filter by category
        const designsToShow = category === 'all' 
            ? Object.values(designs).flat()
            : designs[category] || [];

        // Create and append design items
        designsToShow.forEach(design => {
            const designItem = document.createElement('div');
            designItem.className = 'design-item';
            designItem.innerHTML = `
                <img src="${design.src}" alt="${design.title}" onerror="this.src='img.png'; this.alt='Image not found'">
                <div class="design-item-overlay">
                    <h4>${design.title}</h4>
                </div>
            `;
            designGallery.appendChild(designItem);

            // Add click event to show full image
            designItem.addEventListener('click', function() {
                const fullImage = document.createElement('div');
                fullImage.className = 'full-image-modal';
                
                // Get all images in current category
                const currentCategory = document.querySelector('.category-btn.active').dataset.category;
                const categoryImages = currentCategory === 'all' 
                    ? Object.values(designs).flat()
                    : designs[currentCategory] || [];
                
                // Find current image index
                const currentIndex = categoryImages.findIndex(img => img.src === design.src);
                
                fullImage.innerHTML = `
                    <div class="full-image-content">
                        <button class="slider-nav prev-btn"><i class="fa-solid fa-chevron-left"></i></button>
                        <div class="slider-container">
                            ${categoryImages.map((img, index) => `
                                <div class="slider-item ${index === currentIndex ? 'active' : ''}" 
                                     style="transform: translateX(${(index - currentIndex) * 100}%)">
                                    <img src="${img.src}" alt="${img.title}">
                                    <div class="image-caption">${img.title}</div>
                                </div>
                            `).join('')}
                        </div>
                        <button class="slider-nav next-btn"><i class="fa-solid fa-chevron-right"></i></button>
                        <button class="close-full-image">&times;</button>
                    </div>
                `;
                document.body.appendChild(fullImage);
                
                const sliderContainer = fullImage.querySelector('.slider-container');
                const sliderItems = fullImage.querySelectorAll('.slider-item');
                let currentSlide = currentIndex;
                
                // Navigation functions
                function goToSlide(index) {
                    sliderItems.forEach((item, i) => {
                        item.style.transform = `translateX(${(i - index) * 100}%)`;
                        item.classList.toggle('active', i === index);
                    });
                    currentSlide = index;
                }
                
                // Event listeners for navigation
                fullImage.querySelector('.prev-btn').addEventListener('click', () => {
                    const newIndex = (currentSlide - 1 + sliderItems.length) % sliderItems.length;
                    goToSlide(newIndex);
                });
                
                fullImage.querySelector('.next-btn').addEventListener('click', () => {
                    const newIndex = (currentSlide + 1) % sliderItems.length;
                    goToSlide(newIndex);
                });
                
                // Keyboard navigation
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'ArrowLeft') {
                        const newIndex = (currentSlide - 1 + sliderItems.length) % sliderItems.length;
                        goToSlide(newIndex);
                    } else if (e.key === 'ArrowRight') {
                        const newIndex = (currentSlide + 1) % sliderItems.length;
                        goToSlide(newIndex);
                    } else if (e.key === 'Escape') {
                        fullImage.remove();
                    }
                });
                
                // Close full image view
                fullImage.querySelector('.close-full-image').addEventListener('click', function() {
                    fullImage.remove();
                });
                
                // Close on outside click
                fullImage.addEventListener('click', function(e) {
                    if (e.target === fullImage) {
                        fullImage.remove();
                    }
                });
            });
        });
    }
});