document.addEventListener("DOMContentLoaded", function() {
  // ===== NAVIGATION PRINCIPALE =====
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");
  const indicator = document.querySelector(".tab-indicator");
  const heroSection = document.querySelector(".hero-section");
  const nav = document.querySelector(".tabs.ultra-nav");
  const mainContent = document.querySelector("main");

  // Fonction pour déplacer l'indicateur de navigation
  function moveIndicator(tab) {
    const tabRect = tab.getBoundingClientRect();
    const parentRect = tab.parentNode.getBoundingClientRect();
    const tabWidth = tabRect.width;
    const offsetLeft = tabRect.left - parentRect.left;
    indicator.style.width = tabWidth + "px";
    indicator.style.transform = `translateX(${offsetLeft}px)`;
  }

  // Mettre l'indicateur sous l'onglet actif au chargement
  const activeTab = document.querySelector(".tab.active");
  if (activeTab) {
    moveIndicator(activeTab);
  }

  // Gestion du clic sur les onglets
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      tab.classList.add("active");
      const tabTarget = tab.getAttribute("data-tab");
      const targetContent = document.getElementById(tabTarget);
      targetContent.classList.add("active");

      moveIndicator(tab);

      // Gestion du repli de la section hero et de la remontée de la barre de navigation
      if (tabTarget !== "overview") {
        heroSection.classList.add("collapsed");
        nav.classList.add("collapsed");
        mainContent.classList.add("collapsed");
      } else {
        heroSection.classList.remove("collapsed");
        nav.classList.remove("collapsed");
        mainContent.classList.remove("collapsed");
      }

      // Réinitialiser les animations pour les éléments spécifiques
      if (tabTarget === "arme") {
        document.querySelectorAll(".weapon-card").forEach((card, index) => {
          card.style.transitionDelay = `${0.1 * index}s`;
        });
      }

      if (tabTarget === "sequences") {
        document.querySelectorAll(".res-card").forEach((card, index) => {
          card.style.transitionDelay = `${0.1 * index}s`;
        });
      }

      if (tabTarget === "echos") {
        document.querySelectorAll(".echo-set, .echo-set-header, .echo-set-description, .echo-main-slot").forEach((element, index) => {
          element.style.transitionDelay = `${0.1 * index}s`;
        });
      }

      if (tabTarget === "stat-endgame") {
        document.querySelectorAll(".stat-card").forEach((card, index) => {
          card.style.transitionDelay = `${0.1 * index}s`;
        });
      }

      // Initialisation de la section Teammates si elle est sélectionnée
      if (tabTarget === "teammates") {
        // Initialiser les fonctionnalités Teammates
        initSynergyFilter();
        initTeamCarousel();
        initFlexibleTeamOptions();
      }
    });
  });

  // ===== SECTION TEAMMATES =====

  // Initialiser les fonctionnalités Teammates si la section est déjà active au chargement
  if (document.getElementById("teammates") && document.getElementById("teammates").classList.contains("active")) {
    initSynergyFilter();
    initTeamCarousel();
    initFlexibleTeamOptions();
  }

  // Fonction pour initialiser le filtre de synergies
  function initSynergyFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const synergyCards = document.querySelectorAll('.synergy-showcase-card');
    const filterIndicator = document.querySelector('.filter-indicator');
    
    // Initialisation de l'indicateur
    if (filterButtons.length > 0 && filterIndicator) {
      const activeButton = document.querySelector('.filter-btn.active');
      if (activeButton) {
        updateFilterIndicator(activeButton);
      }
    }
    
    // Fonction pour mettre à jour l'indicateur
    function updateFilterIndicator(button) {
      const buttonWidth = button.offsetWidth;
      const buttonLeft = button.offsetLeft;
      filterIndicator.style.width = buttonWidth + 'px';
      filterIndicator.style.left = buttonLeft + 'px';
    }
    
    // Attacher les gestionnaires d'événements aux boutons de filtre
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Mettre à jour les classes actives
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Mettre à jour l'indicateur
        updateFilterIndicator(button);
        
        // Filtrer les cartes
        const filterType = button.getAttribute('data-filter');
        filterSynergyCards(filterType);
      });
    });
    
    // Fonction pour filtrer les cartes
    function filterSynergyCards(filterType) {
      synergyCards.forEach(card => {
        // Récupérer le type de la carte
        const cardType = card.getAttribute('data-type');
        
        if (filterType === 'all' || cardType === filterType) {
          // Afficher la carte avec animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          card.style.display = 'flex';
          
          // Déclencher l'animation après un court délai
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          // Masquer la carte avec animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          
          // Masquer complètement après la fin de l'animation
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    }
    
    // Réinitialiser le filtre lors du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
      const activeButton = document.querySelector('.filter-btn.active');
      if (activeButton && filterIndicator) {
        updateFilterIndicator(activeButton);
      }
    });
  }

  // Fonction pour initialiser le carousel d'équipes
  function initTeamCarousel() {
    const slider = document.querySelector('.team-slider');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const cards = document.querySelectorAll('.team-comp-card');
    
    if (!slider || cards.length === 0) return;
    
    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let autoScrollInterval;
    
    // Fonction pour faire défiler le carousel
    function scrollToIndex(index) {
      if (index < 0) index = cards.length - 1;
      if (index >= cards.length) index = 0;
      
      currentIndex = index;
      
      // Calcul de la position de défilement
      const cardWidth = slider.offsetWidth;
      const scrollPosition = index * cardWidth;
      
      // Animation de défilement fluide
      slider.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
      
      // Mise à jour des points d'indication
      updateDots();
    }
    
    // Mise à jour des points d'indication
    function updateDots() {
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }
    
    // Event listeners pour les flèches du carousel
    if (prevArrow) {
      prevArrow.addEventListener('click', () => {
        scrollToIndex(currentIndex - 1);
        stopAutoScroll();
        startAutoScroll();
      });
    }
    
    if (nextArrow) {
      nextArrow.addEventListener('click', () => {
        scrollToIndex(currentIndex + 1);
        stopAutoScroll();
        startAutoScroll();
      });
    }
    
    // Event listeners pour les points d'indication
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        scrollToIndex(i);
        stopAutoScroll();
        startAutoScroll();
      });
    });
    
    // Support des gestes tactiles
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoScroll();
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoScroll();
    }, { passive: true });
    
    // Fonction pour gérer le balayage
    function handleSwipe() {
      const swipeThreshold = 50;
      
      if (touchEndX < touchStartX - swipeThreshold) {
        // Balayage vers la gauche -> carte suivante
        scrollToIndex(currentIndex + 1);
      } else if (touchEndX > touchStartX + swipeThreshold) {
        // Balayage vers la droite -> carte précédente
        scrollToIndex(currentIndex - 1);
      }
    }
    
    // Défilement automatique
    function startAutoScroll() {
      autoScrollInterval = setInterval(() => {
        scrollToIndex(currentIndex + 1);
      }, 5000);
    }
    
    function stopAutoScroll() {
      clearInterval(autoScrollInterval);
    }
    
    // Arrêter le défilement automatique lors de l'interaction
    slider.addEventListener('mouseenter', stopAutoScroll);
    if (prevArrow) prevArrow.addEventListener('mouseenter', stopAutoScroll);
    if (nextArrow) nextArrow.addEventListener('mouseenter', stopAutoScroll);
    dots.forEach(dot => dot.addEventListener('mouseenter', stopAutoScroll));
    
    // Reprendre le défilement automatique après l'interaction
    slider.addEventListener('mouseleave', startAutoScroll);
    if (prevArrow) prevArrow.addEventListener('mouseleave', startAutoScroll);
    if (nextArrow) nextArrow.addEventListener('mouseleave', startAutoScroll);
    dots.forEach(dot => dot.addEventListener('mouseleave', startAutoScroll));
    
    // Démarrer le défilement automatique
    startAutoScroll();
  }

  // Fonction pour initialiser les options flexibles d'équipe
  function initFlexibleTeamOptions() {
    const flexOptions = document.querySelectorAll('.flex-option');
    
    flexOptions.forEach(option => {
      option.addEventListener('click', function() {
        // Trouver l'élément parent flexible-container
        const container = this.closest('.flexible-container');
        
        // Désactiver toutes les options dans ce conteneur
        const siblings = container.querySelectorAll('.flex-option');
        siblings.forEach(sib => sib.classList.remove('active'));
        
        // Activer l'option cliquée
        this.classList.add('active');
        
        // Effet visuel pour montrer la sélection
        const memberImage = this.querySelector('.member-image');
        
        // Animation flash
        memberImage.style.transition = 'all 0.2s';
        memberImage.style.transform = 'scale(1.2)';
        memberImage.style.borderColor = '#ffd700';
        memberImage.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
        
        // Revenir à la normale après l'animation
        setTimeout(() => {
          memberImage.style.transform = '';
          memberImage.style.boxShadow = '';
        }, 300);
      });
    });
    
    // Effets au survol pour les options flexibles
    flexOptions.forEach(option => {
      option.addEventListener('mouseenter', function() {
        if (!this.classList.contains('active')) {
          const memberImage = this.querySelector('.member-image');
          memberImage.style.borderColor = 'rgba(255, 215, 0, 0.8)';
          memberImage.style.transform = 'scale(1.05)';
        }
      });
      
      option.addEventListener('mouseleave', function() {
        if (!this.classList.contains('active')) {
          const memberImage = this.querySelector('.member-image');
          memberImage.style.borderColor = 'rgba(255, 215, 0, 0.5)';
          memberImage.style.transform = '';
        }
      });
    });
  }

  // ===== ANIMATIONS PARALLAX =====
  
  // Animation parallax pour la section hero (si présente)
  const parallaxBg = document.querySelector('.parallax-bg');
  if (parallaxBg) {
    window.addEventListener('scroll', function() {
      const scrollY = window.scrollY;
      parallaxBg.style.transform = `translateY(${scrollY * 0.4}px) scale(1.2)`;
    });
  }

  // ===== RESPONSIVE DESIGN =====
  
  // Ajustements pour le mode mobile
  function handleResponsiveLayout() {
    const windowWidth = window.innerWidth;
    
    // Ajustements spécifiques pour mobile
    if (windowWidth < 768) {
      // Ajustements pour la navigation
      if (nav) {
        nav.classList.add('mobile-mode');
      }
      
      // Ajustements pour les cartes d'équipe
      document.querySelectorAll('.team-member').forEach(member => {
        member.style.width = '100%';
      });
    } else {
      // Restaurer le layout desktop
      if (nav) {
        nav.classList.remove('mobile-mode');
      }
      
      // Restaurer la largeur des membres d'équipe
      document.querySelectorAll('.team-member').forEach(member => {
        if (member.classList.contains('flexible')) {
          member.style.width = '36%';
        } else {
          member.style.width = '33.33%';
        }
      });
    }
  }
  
  // Appeler la fonction au chargement et au redimensionnement
  handleResponsiveLayout();
  window.addEventListener('resize', handleResponsiveLayout);

  // ===== INTERSECTION OBSERVER POUR ANIMATIONS AU DÉFILEMENT =====
  
  // Observer pour déclencher les animations au scroll
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    // Observer les sections avec animations
    const animatedSections = document.querySelectorAll('.synergy-showcase, .team-compositions, .weapon-list, .stats-grid, .res-card');
    animatedSections.forEach(section => {
      observer.observe(section);
    });
  }
});