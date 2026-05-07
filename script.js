// MODE TOGGLE (Developer / Designer)
const modeBtns = document.querySelectorAll(".pill-btn");
const pillContainer = document.querySelector(".pill-tabs");
const body = document.body;
const rotatorTrack = document.querySelector("#rotatorTrack");
const heroEyebrow = document.querySelector("#heroEyebrow");
const heroTitle = document.querySelector("#heroTitle");
const heroCopy = document.querySelector("#heroCopy");
const calloutText = document.querySelector("#calloutText");
const heroPortrait = document.querySelector("#heroPortrait");
const metricOneValue = document.querySelector("#metricOneValue");
const metricOneLabel = document.querySelector("#metricOneLabel");
const metricTwoValue = document.querySelector("#metricTwoValue");
const metricTwoLabel = document.querySelector("#metricTwoLabel");
const metricThreeValue = document.querySelector("#metricThreeValue");
const metricThreeLabel = document.querySelector("#metricThreeLabel");
const sectionTabs = Array.from(document.querySelectorAll(".section-tab"));
const sections = Array.from(document.querySelectorAll(".section-content"));

const tabSets = {
  dev: [
    { label: "Skills", section: "skills" },
    { label: "Portfolio", section: "portfolio" }
  ],
  design: [
    { label: "Pixel Art", section: "pixel-art" },
    { label: "Traditional Art", section: "traditional-art" },
    { label: "Digital Art", section: "digital-art" }
  ]
};

const modeContent = {
  dev: {
    eyebrow: "Product-focused engineer and visual builder",
    title: "I design clear experiences and build fast, reliable products.",
    copy: "I am Mike, a 23-year-old developer from the Philippines and a Computer Science graduate. I help teams ship polished web apps, from architecture and APIs to the final animation pass.",
    callout: "You can hire me on Upwork too.",
    photo: "assets/self.jpg",
    metrics: [
      { value: "4+", label: "Years building products" },
      { value: "Quality", label: "Selective web projects shipped" },
      { value: "CS Graduate", label: "Computer Science background" }
    ]
  },
  design: {
    eyebrow: "Creative problem-solver and visual storyteller",
    title: "I craft visual experiences that feel clean, modern, and memorable.",
    copy: "As an artist, I work across pixel art, traditional drawing, and digital illustration. I focus on style consistency, strong composition, and visual storytelling that feels original.",
    callout: "Need strong visuals? Let's design your next project.",
    photo: "assets/pixel/pixel-char-sheet.png",
    metrics: [
      { value: "Pixel Art", label: "Sprites and retro environments" },
      { value: "Traditional", label: "Sketch and ink foundations" },
      { value: "Digital", label: "Illustration and visual storytelling" }
    ]
  }
};

const rotatingWords = ["creates", "codes", "draws", "builds", "ships"];

function activateSection(sectionId) {
  sections.forEach(sec => {
    sec.classList.toggle("active", sec.id === sectionId);
  });

  sectionTabs.forEach(tab => {
    tab.classList.toggle("active", tab.dataset.section === sectionId && !tab.classList.contains("is-hidden"));
  });
}

function configureTabs(mode) {
  const activeSet = tabSets[mode === "design" ? "design" : "dev"];

  sectionTabs.forEach((tab, index) => {
    const data = activeSet[index];

    if (data) {
      tab.classList.remove("is-hidden");
      tab.textContent = data.label;
      tab.dataset.section = data.section;
    } else {
      tab.classList.add("is-hidden");
      tab.classList.remove("active");
      tab.dataset.section = "";
    }
  });

  if (activeSet[0]) {
    activateSection(activeSet[0].section);
  }
}

if (rotatorTrack) {
  const loopWords = [...rotatingWords, rotatingWords[0]];
  rotatorTrack.innerHTML = loopWords
    .map(word => `<span class="rotator-word">${word}</span>`)
    .join("");

  let wordIndex = 0;

  window.setInterval(() => {
    wordIndex += 1;
    rotatorTrack.style.transition = "transform 520ms cubic-bezier(0.22, 1, 0.36, 1)";
    rotatorTrack.style.transform = `translateY(-${wordIndex * 1.2}em)`;

    if (wordIndex === rotatingWords.length) {
      window.setTimeout(() => {
        rotatorTrack.style.transition = "none";
        rotatorTrack.style.transform = "translateY(0)";
        wordIndex = 0;
      }, 560);
    }
  }, 2000);
}

function setMode(mode) {
  body.classList.remove("mode-dev", "mode-design");
  body.classList.add(mode === "design" ? "mode-design" : "mode-dev");
  configureTabs(mode);

  const content = modeContent[mode === "design" ? "design" : "dev"];
  if (!content) return;

  if (heroEyebrow) heroEyebrow.textContent = content.eyebrow;
  if (heroTitle) heroTitle.textContent = content.title;
  if (heroCopy) heroCopy.textContent = content.copy;
  if (calloutText) calloutText.textContent = content.callout;

  if (metricOneValue) metricOneValue.textContent = content.metrics[0].value;
  if (metricOneLabel) metricOneLabel.textContent = content.metrics[0].label;
  if (metricTwoValue) metricTwoValue.textContent = content.metrics[1].value;
  if (metricTwoLabel) metricTwoLabel.textContent = content.metrics[1].label;
  if (metricThreeValue) metricThreeValue.textContent = content.metrics[2].value;
  if (metricThreeLabel) metricThreeLabel.textContent = content.metrics[2].label;

  if (heroPortrait) {
    const testImage = new Image();
    testImage.onload = () => {
      heroPortrait.src = content.photo;
      heroPortrait.classList.remove("designer-variant");
    };
    testImage.onerror = () => {
      heroPortrait.src = "assets/self.jpg";
      if (mode === "design") {
        heroPortrait.classList.add("designer-variant");
      } else {
        heroPortrait.classList.remove("designer-variant");
      }
    };
    testImage.src = content.photo;
  }
}

// Pill indicator — tracks actual button position
const pillIndicator = document.querySelector("#pillIndicator");

function updateIndicator(activeBtn) {
  if (!pillIndicator || !activeBtn) return;
  const container = activeBtn.closest(".pill-tabs");
  const containerLeft = container.getBoundingClientRect().left;
  const btnRect = activeBtn.getBoundingClientRect();
  pillIndicator.style.width = btnRect.width + "px";
  pillIndicator.style.transform = `translateX(${btnRect.left - containerLeft - 5}px)`;
}

setMode("dev");
updateIndicator(document.querySelector(".pill-btn.active"));

// Back to top
const backToTopBtn = document.querySelector("#backToTop");
if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    backToTopBtn.classList.toggle("visible", window.scrollY > 300);
  }, { passive: true });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

modeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    modeBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    updateIndicator(btn);

    if (btn.dataset.mode === "design") {
      pillContainer.classList.add("design-active");
      setMode("design");
    } else {
      pillContainer.classList.remove("design-active");
      setMode("dev");
    }
  });
});

// Project Drawer
const drawer        = document.querySelector("#projectDrawer");
const drawerOverlay = document.querySelector("#projectDrawerOverlay");
const drawerClose   = document.querySelector("#drawerClose");
const drawerTitle   = document.querySelector("#drawerTitle");
const drawerTag     = document.querySelector("#drawerTag");
const drawerStatus  = document.querySelector("#drawerStatus");
const drawerDesc    = document.querySelector("#drawerDesc");
const drawerSkills  = document.querySelector("#drawerSkills");
const drawerGallery = document.querySelector("#drawerGallery");
const drawerActions = document.querySelector("#drawerActions");

const statusClasses = { done: "status-done", wip: "status-wip", live: "status-live" };

function openDrawer(card) {
  const { title, tag, status, statusLabel, desc, skills, imgs, url } = card.dataset;

  drawerTitle.textContent = title;
  drawerTag.textContent   = tag;

  drawerStatus.className = `project-status ${statusClasses[status] || "status-done"}`;
  if (status === "live") {
    drawerStatus.innerHTML = `<span class="live-dot"></span>${statusLabel}`;
  } else {
    drawerStatus.textContent = statusLabel;
  }

  drawerDesc.textContent = desc;

  drawerSkills.innerHTML = skills.split(",").map(s => `<span>${s.trim()}</span>`).join("");

  // Gallery carousel — purge any leftover dots from previous open
  document.querySelectorAll(".drawer-carousel-dots").forEach(el => el.remove());
  drawerGallery.innerHTML = "";
  const imgList = imgs ? imgs.split(",").filter(Boolean) : [];
  if (imgList.length) {
    let carouselIndex = 0;

    const track = document.createElement("div");
    track.className = "drawer-carousel-track";

    imgList.forEach((src, i) => {
      const slide = document.createElement("div");
      slide.className = "drawer-carousel-slide";
      const img = document.createElement("img");
      img.src = src.trim();
      img.alt = `${title} screenshot ${i + 1}`;
      slide.appendChild(img);
      slide.addEventListener("click", () => openLightbox(img.src, title));
      track.appendChild(slide);
    });

    drawerGallery.appendChild(track);

    // Arrows (only if >1 image)
    if (imgList.length > 1) {
      const btnPrev = document.createElement("button");
      btnPrev.className = "drawer-carousel-btn prev";
      btnPrev.setAttribute("aria-label", "Previous");
      btnPrev.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

      const btnNext = document.createElement("button");
      btnNext.className = "drawer-carousel-btn next";
      btnNext.setAttribute("aria-label", "Next");
      btnNext.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

      drawerGallery.appendChild(btnPrev);
      drawerGallery.appendChild(btnNext);

      // Dots
      const dotsEl = document.createElement("div");
      dotsEl.className = "drawer-carousel-dots";
      const dots = imgList.map((_, i) => {
        const dot = document.createElement("button");
        dot.className = "drawer-carousel-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", `Go to image ${i + 1}`);
        dot.addEventListener("click", () => goTo(i));
        dotsEl.appendChild(dot);
        return dot;
      });

      drawerGallery.closest(".drawer-col-left").appendChild(dotsEl);

      function goTo(idx) {
        carouselIndex = (idx + imgList.length) % imgList.length;
        track.style.transform = `translateX(-${carouselIndex * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle("active", i === carouselIndex));
      }

      btnPrev.addEventListener("click", (e) => { e.stopPropagation(); goTo(carouselIndex - 1); });
      btnNext.addEventListener("click", (e) => { e.stopPropagation(); goTo(carouselIndex + 1); });
    }

    drawerGallery.style.display = "";
  } else {
    drawerGallery.style.display = "none";
  }

  // Actions
  drawerActions.innerHTML = "";
  if (url) {
    drawerActions.innerHTML = `<a href="${url}" target="_blank" rel="noopener" class="project-link">
      View Live Site
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 12L12 2M12 2H6M12 2v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>`;
  }

  drawer.classList.add("open");
  drawerOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  drawer.classList.remove("open");
  drawerOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

document.querySelectorAll(".project-card").forEach(card => {
  if (!card.dataset.title) return;
  card.addEventListener("click", () => openDrawer(card));
  card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") openDrawer(card); });
});

if (drawerClose)   drawerClose.addEventListener("click", closeDrawer);
if (drawerOverlay) drawerOverlay.addEventListener("click", closeDrawer);
drawer.addEventListener("click", e => { if (e.target === drawer) closeDrawer(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });

// 3D tilt + shine on gallery cards
document.querySelectorAll(".pixel-item").forEach(card => {
  const MAX_TILT = 12;

  card.addEventListener("mouseenter", () => {
    card.style.transition = "box-shadow 0.18s ease";
    card.style.boxShadow = "0 20px 48px rgba(21, 32, 33, 0.2)";
  });

  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top)  / rect.height;
    const rotY =  (x - 0.5) * MAX_TILT;
    const rotX = -(y - 0.5) * MAX_TILT;
    card.style.transition = "box-shadow 0.18s ease";
    card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03)`;
    card.style.setProperty("--shine-x", `${x * 100}%`);
    card.style.setProperty("--shine-y", `${y * 100}%`);
  });

  card.addEventListener("mouseleave", () => {
    card.style.transition = "transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease";
    card.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    card.style.boxShadow = "";
  });
});

// Lightbox
const lightbox    = document.querySelector("#lightbox");
const lightboxImg = document.querySelector("#lightboxImg");
const lightboxClose = document.querySelector("#lightboxClose");

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || "";
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

document.querySelectorAll(".pixel-item").forEach(img => {
  img.addEventListener("click", () => {
    const src = img.querySelector("img");
    if (src) openLightbox(src.src, src.alt);
  });
});

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightbox) {
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeLightbox();
});

// Block right-click and drag on all images
document.addEventListener("contextmenu", e => {
  if (e.target.tagName === "IMG") e.preventDefault();
});
document.addEventListener("dragstart", e => {
  if (e.target.tagName === "IMG") e.preventDefault();
});

sectionTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    if (!tab.dataset.section || tab.classList.contains("is-hidden")) return;
    activateSection(tab.dataset.section);
  });
});
