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

  var tsi = 0;
  var tDots = [];
  var step = 0;
  var teamSlider = document.querySelector(".team-slider");
  var teamTrack = document.querySelector(".team-slider .team-track");
  var teamCards = document.querySelectorAll(".team-slider .member-card");
  var teamPrev = document.querySelector(".team .slider-controls .prev");
  var teamNext = document.querySelector(".team .slider-controls .next");
  var teamDotsContainer = document.querySelector(".team .dots");
  function getGap() {
    var v = getComputedStyle(teamTrack).gap;
    return v ? Math.round(parseFloat(v)) : 24;
  }
  function getCenterOffset() {
    var sliderW = teamSlider ? teamSlider.clientWidth : 0;
    var cardW = teamCards.length ? Math.round(teamCards[0].getBoundingClientRect().width) : 0;
    return Math.round((sliderW - cardW) / 2);
  }
  function calcStep() {
    if (!teamCards.length) return;
    var gap = getGap();
    var w = Math.round(teamCards[0].getBoundingClientRect().width);
    step = w + gap;
  }
  function showTeamSlide(i) {
    if (!teamTrack) return;
    tsi = Math.max(0, Math.min(i, teamCards.length - 1));
    var centerOffset = getCenterOffset();
    teamTrack.style.transform = "translateX(" + (centerOffset - tsi * step) + "px)";
    tDots.forEach(function (d, idx) { d.classList.toggle("active", idx === tsi); });
    teamCards.forEach(function (c, idx) { c.classList.toggle("active", idx === tsi); });
  }
  function nextTeam() { showTeamSlide(tsi + 1); }
  function prevTeam() { showTeamSlide(tsi - 1); }
  function initTeamDots() {
    if (!teamDotsContainer) return;
    tDots = [];
    teamDotsContainer.innerHTML = "";
    teamCards.forEach(function (_, idx) {
      var b = document.createElement("button");
      if (idx === 0) b.classList.add("active");
      b.addEventListener("click", function () { showTeamSlide(idx); });
      teamDotsContainer.appendChild(b);
      tDots.push(b);
    });
  }
  function initTeamSlider() {
    if (!teamSlider || !teamTrack || !teamCards.length) return;
    calcStep();
    initTeamDots();
    showTeamSlide(Math.floor(teamCards.length / 2));
    if (teamNext) teamNext.addEventListener("click", nextTeam);
    if (teamPrev) teamPrev.addEventListener("click", prevTeam);
    teamSlider.setAttribute("tabindex", "0");
    teamSlider.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") nextTeam();
      else if (e.key === "ArrowLeft") prevTeam();
    });
    var auto = setInterval(nextTeam, 6000);
    teamSlider.addEventListener("mouseenter", function () { clearInterval(auto); });
    teamSlider.addEventListener("mouseleave", function () { auto = setInterval(nextTeam, 6000); });
    
    window.addEventListener("resize", function () { calcStep(); showTeamSlide(tsi); });
  }
  initTeamSlider();

  faqQuestions.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.parentElement;
      var open = item.classList.contains("open");
      item.classList.toggle("open", !open);
      btn.setAttribute("aria-expanded", String(!open));
    });
  });

  function composeMailto(form) {
    var to = form.getAttribute("data-mailto") || "futureforge82@gmail.com";
    var name = form.querySelector('[name="from_name"]').value.trim();
    var email = form.querySelector('[name="reply_to"]').value.trim();
    var message = form.querySelector('[name="message"]').value.trim();
    if (!name || !email || !message) { alert("Please fill in all fields."); return null; }
    var subject = "Website Contact: " + name;
    var body = "Name: " + name + "\nEmail: " + email + "\n\n" + message;
    var url = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    return url;
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var mailto = composeMailto(contactForm);
      if (mailto) window.location.href = mailto;
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
});
