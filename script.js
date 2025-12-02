if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

document.addEventListener("DOMContentLoaded", function () {
  var themeButton = document.querySelector(".theme-toggle");
  var menuButton = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  var links = nav ? nav.querySelectorAll("a[href^='#']") : [];
  var rotator = document.getElementById("rotator");
  var slides = document.querySelectorAll(".testimonials .slide");
  var prev = document.querySelector(".testimonials .prev");
  var next = document.querySelector(".testimonials .next");
  var dotsContainer = document.querySelector(".testimonials .dots");
  var counters = document.querySelectorAll(".impact .count");
  var faqQuestions = document.querySelectorAll(".faq-question");
  var contactForm = document.getElementById("contact-form");
  var hero = document.querySelector(".hero");
  var phone = document.querySelector(".phone-mock");

  var storedTheme = localStorage.getItem("theme");
  if (storedTheme) document.documentElement.setAttribute("data-theme", storedTheme);

  function toggleTheme() {
    var current = document.documentElement.getAttribute("data-theme") || "light";
    var next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }
  if (themeButton) themeButton.addEventListener("click", toggleTheme);

  function toggleMenu() {
    var open = nav.classList.contains("open");
    nav.classList.toggle("open", !open);
    menuButton.setAttribute("aria-expanded", String(!open));
  }
  if (menuButton && nav) menuButton.addEventListener("click", toggleMenu);

  function smoothScroll(e) {
    var href = this.getAttribute("href");
    if (!href || href.charAt(0) !== "#") return;
    var target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
      if (nav.classList.contains("open")) toggleMenu();
    }
  }
  links.forEach(function (a) { a.addEventListener("click", smoothScroll); });

  var spySections = document.querySelectorAll("section[id]");
  var spy = new IntersectionObserver(function (entries) {
    // Get all sections and find the one currently in view
    let current = "";
    const pageYOffset = window.pageYOffset;
    
    spySections.forEach((section) => {
      const sectionTop = section.offsetTop - 100; // 100px offset from top
      const sectionHeight = section.offsetHeight;
      
      if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    // Update active state for all nav links
    nav.querySelectorAll("a").forEach((link) => {
      link.classList.toggle("active", 
        link.getAttribute("href") === `#${current}`
      );
    });
  }, { 
    threshold: 0.1,  // Lower threshold for better detection
    rootMargin: "0px 0px -80% 0px"  // Consider element in view when it's 80% from bottom
  });
  spySections.forEach(function (s) { spy.observe(s); });

  var revealItems = document.querySelectorAll(".reveal");
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.15 });
  revealItems.forEach(function (el) { revealObs.observe(el); });

  var words = ["Delivery","Management","Insights","Coordination","Analytics"];
  var wi = 0;
  function typeWord() {
    var w = words[wi];
    var i = 0;
    rotator.textContent = "";
    var t = setInterval(function () {
      rotator.textContent = w.slice(0, i++);
      if (i > w.length) {
        clearInterval(t);
        setTimeout(function () {
          var d = setInterval(function () {
            rotator.textContent = rotator.textContent.slice(0, -1);
            if (rotator.textContent.length === 0) {
              clearInterval(d);
              wi = (wi + 1) % words.length;
              typeWord();
            }
          }, 50);
        }, 800);
      }
    }, 70);
  }
  if (rotator) typeWord();

  var countersStarted = false;
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-target"), 10) || 0;
    var start = 0;
    var startTs;
    function step(ts) {
      if (!startTs) startTs = ts;
      var progress = ts - startTs;
      var val = Math.min(target, Math.floor(progress / 15));
      el.textContent = String(val);
      if (val < target) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var impactSection = document.getElementById("impact");
  if (impactSection) {
    var impactObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          counters.forEach(animateCounter);
        }
      });
    }, { threshold: 0.3 });
    impactObs.observe(impactSection);
  }

  var si = 0;
  var dots = [];
  function showSlide(i) {
    slides.forEach(function (s, idx) { s.classList.toggle("active", idx === i); });
    dots.forEach(function (d, idx) { d.classList.toggle("active", idx === i); });
    si = i;
  }
  function nextSlide() { showSlide((si + 1) % slides.length); }
  function prevSlide() { showSlide((si - 1 + slides.length) % slides.length); }
  if (slides.length && dotsContainer) {
    slides.forEach(function (_, idx) {
      var b = document.createElement("button");
      if (idx === 0) b.classList.add("active");
      b.addEventListener("click", function () { showSlide(idx); });
      dotsContainer.appendChild(b);
      dots.push(b);
    });
    if (next) next.addEventListener("click", nextSlide);
    if (prev) prev.addEventListener("click", prevSlide);
    setInterval(nextSlide, 5000);
  }


  faqQuestions.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.parentElement;
      var open = item.classList.contains("open");
      item.classList.toggle("open", !open);
      btn.setAttribute("aria-expanded", String(!open));
    });
  });

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // these IDs from the previous steps
      emailjs.sendForm('service_6wy1ybx', 'template_kr9iiyk', this)
        .then(function() {
            alert('Your message has been sent successfully!');
            contactForm.reset(); // Reset form after successful submission
        }, function(error) {
            alert('Failed to send the message. Please try again later.');
        });
    });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function handleHeroMove(e) {
    if (reduceMotion || !phone || !hero) return;
    var rect = hero.getBoundingClientRect();
    var x = (e.clientX - rect.left) / rect.width;
    var y = (e.clientY - rect.top) / rect.height;
    var dx = (x - 0.5) * 20;
    var dy = (y - 0.5) * 20;
    var rx = (0.5 - y) * 6;
    var ry = (x - 0.5) * 10;
    phone.style.transform = "translate3d(" + dx + "px," + dy + "px,0) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
  }
  function resetHeroMove() {
    if (!phone) return;
    phone.style.transform = "translate3d(0,0,0) rotateX(0) rotateY(0)";
  }
  if (hero) {
    hero.addEventListener("mousemove", handleHeroMove);
    hero.addEventListener("mouseleave", resetHeroMove);
  }

  // Team Slider Functionality
  var teamContainer = document.querySelector(".team-container");
  var teamCards = document.querySelectorAll(".team-card");
  var teamPrev = document.querySelector(".team-prev");
  var teamNext = document.querySelector(".team-next");
  var teamDots = document.querySelectorAll(".team-dot");
  
  if (teamContainer && teamCards.length > 0) {
    var currentSlide = 0;
    var cardWidth = 324; // 300px card + 24px gap
    var isDragging = false;
    var startX = 0;
    var currentTranslate = 0;
    var prevTranslate = 0;
    var animationID = null;
    
    function updateSlider() {
      teamContainer.style.transform = "translateX(-" + (currentSlide * cardWidth) + "px)";
      
      // Update dots
      teamDots.forEach(function(dot, index) {
        dot.classList.toggle("active", index === currentSlide);
      });
    }
    
    function goToSlide(slideIndex) {
      var maxSlide = Math.max(0, teamCards.length - Math.floor(teamContainer.parentElement.offsetWidth / cardWidth));
      currentSlide = Math.max(0, Math.min(slideIndex, maxSlide));
      updateSlider();
    }
    
    function nextSlide() {
      goToSlide(currentSlide + 1);
    }
    
    function prevSlide() {
      goToSlide(currentSlide - 1);
    }
    
    // Navigation buttons
    if (teamPrev) teamPrev.addEventListener("click", prevSlide);
    if (teamNext) teamNext.addEventListener("click", nextSlide);
    
    // Dot navigation
    teamDots.forEach(function(dot, index) {
      dot.addEventListener("click", function() {
        goToSlide(index);
      });
    });
    
    // Touch/swipe support
    function touchStart(e) {
      isDragging = true;
      teamContainer.style.transition = "none";
      startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
      animationID = requestAnimationFrame(animation);
    }
    
    function touchMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      var currentX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
      var diff = currentX - startX;
      currentTranslate = prevTranslate + diff;
      teamContainer.style.transform = "translateX(" + currentTranslate + "px)";
    }
    
    function touchEnd() {
      isDragging = false;
      cancelAnimationFrame(animationID);
      var movedBy = currentTranslate - prevTranslate;
      
      if (movedBy < -100 && currentSlide < teamCards.length - 1) {
        currentSlide++;
      } else if (movedBy > 100 && currentSlide > 0) {
        currentSlide--;
      }
      
      teamContainer.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
      updateSlider();
      prevTranslate = currentTranslate = -currentSlide * cardWidth;
    }
    
    function animation() {
      if (isDragging) requestAnimationFrame(animation);
      setSliderPosition();
    }
    
    function setSliderPosition() {
      teamContainer.style.transform = "translateX(" + currentTranslate + "px)";
    }
    
    // Mouse events
    teamContainer.addEventListener("mousedown", touchStart);
    teamContainer.addEventListener("mousemove", touchMove);
    teamContainer.addEventListener("mouseup", touchEnd);
    teamContainer.addEventListener("mouseleave", touchEnd);
    teamContainer.addEventListener("transitionend", function() {
      teamContainer.style.transition = "";
    });
    
    // Touch events
    teamContainer.addEventListener("touchstart", touchStart);
    teamContainer.addEventListener("touchmove", touchMove);
    teamContainer.addEventListener("touchend", touchEnd);
    
    // Keyboard navigation
    document.addEventListener("keydown", function(e) {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    });
    
    // Auto-resize on window resize
    window.addEventListener("resize", function() {
      updateSlider();
    });
    
    // Initialize slider position
    updateSlider();
  }
});
