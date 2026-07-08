const rotatorTrack = document.querySelector("#rotatorTrack");
const rotatingWords = ["codes", "builds", "ships", "scales"];

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
  const { title, tag, status, statusLabel, desc, skills, imgs, url, actionLabel } = card.dataset;

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
    const ctaLabel = actionLabel || "View Live Site";
    drawerActions.innerHTML = `<a href="${url}" target="_blank" rel="noopener" class="project-link">
      ${ctaLabel}
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

document.querySelectorAll(".project-card, .cert-card").forEach(card => {
  if (!card.dataset.title) return;
  card.addEventListener("click", () => openDrawer(card));
  card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") openDrawer(card); });
});

if (drawerClose)   drawerClose.addEventListener("click", closeDrawer);
if (drawerOverlay) drawerOverlay.addEventListener("click", closeDrawer);
drawer.addEventListener("click", e => { if (e.target === drawer) closeDrawer(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });

// Block right-click and drag on all images
document.addEventListener("contextmenu", e => {
  if (e.target.tagName === "IMG") e.preventDefault();
});
document.addEventListener("dragstart", e => {
  if (e.target.tagName === "IMG") e.preventDefault();
});

// Left rail TOC active state
const tocLinks = Array.from(document.querySelectorAll(".toc-rail-link"));
if (tocLinks.length) {
  const setActiveToc = (targetId) => {
    tocLinks.forEach(link => {
      link.classList.toggle("active", link.dataset.target === targetId);
    });
  };

  tocLinks.forEach(link => {
    link.addEventListener("click", () => {
      setActiveToc(link.dataset.target);
    });
  });

  const sectionIds = ["skills", "portfolio", "certifications"];
  const observedSections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (observedSections.length) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        setActiveToc(visible.target.id);
      } else if (window.scrollY < 120) {
        setActiveToc("top");
      }
    }, {
      root: null,
      rootMargin: "-35% 0px -45% 0px",
      threshold: [0.15, 0.35, 0.6],
    });

    observedSections.forEach(section => observer.observe(section));
  }

  window.addEventListener("scroll", () => {
    if (window.scrollY < 120) {
      setActiveToc("top");
    }
  }, { passive: true });
}

// Draggable TOC rail (keeps links clickable)
const tocRail = document.querySelector(".toc-rail");
if (tocRail) {
  const railStorageKey = "tocRailPosition";
  let dragging = false;
  let activePointerId = null;
  let pointerOffsetX = 0;
  let pointerOffsetY = 0;
  let usingCustomPosition = false;

  const clampToViewport = (left, top) => {
    const rect = tocRail.getBoundingClientRect();
    const margin = 8;
    const maxLeft = Math.max(margin, window.innerWidth - rect.width - margin);
    const maxTop = Math.max(margin, window.innerHeight - rect.height - margin);

    return {
      left: Math.min(Math.max(left, margin), maxLeft),
      top: Math.min(Math.max(top, margin), maxTop),
    };
  };

  const applyPosition = (left, top) => {
    tocRail.style.left = `${left}px`;
    tocRail.style.top = `${top}px`;
    tocRail.style.transform = "none";
  };

  const savePosition = (left, top) => {
    try {
      localStorage.setItem(railStorageKey, JSON.stringify({ left, top }));
    } catch {
      // Ignore storage failures silently.
    }
  };

  const readSavedPosition = () => {
    try {
      const raw = localStorage.getItem(railStorageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (typeof parsed.left !== "number" || typeof parsed.top !== "number") return null;
      return parsed;
    } catch {
      return null;
    }
  };

  const saved = readSavedPosition();
  if (saved) {
    const clamped = clampToViewport(saved.left, saved.top);
    applyPosition(clamped.left, clamped.top);
    usingCustomPosition = true;
  }

  const startDrag = (event) => {
    if (event.button !== 0) return;
    if (event.target.closest(".toc-rail-link")) return;

    const rect = tocRail.getBoundingClientRect();

    if (!usingCustomPosition) {
      applyPosition(rect.left, rect.top);
      usingCustomPosition = true;
    }

    dragging = true;
    activePointerId = event.pointerId;
    pointerOffsetX = event.clientX - rect.left;
    pointerOffsetY = event.clientY - rect.top;

    tocRail.classList.add("dragging");
    tocRail.setPointerCapture(activePointerId);
  };

  const onDrag = (event) => {
    if (!dragging || event.pointerId !== activePointerId) return;

    const rawLeft = event.clientX - pointerOffsetX;
    const rawTop = event.clientY - pointerOffsetY;
    const clamped = clampToViewport(rawLeft, rawTop);
    applyPosition(clamped.left, clamped.top);
  };

  const endDrag = (event) => {
    if (!dragging || event.pointerId !== activePointerId) return;

    dragging = false;
    tocRail.classList.remove("dragging");
    tocRail.releasePointerCapture(activePointerId);
    activePointerId = null;

    const rect = tocRail.getBoundingClientRect();
    savePosition(rect.left, rect.top);

    tocRail.classList.remove("dropped");
    window.requestAnimationFrame(() => {
      tocRail.classList.add("dropped");
      window.setTimeout(() => tocRail.classList.remove("dropped"), 520);
    });
  };

  tocRail.addEventListener("pointerdown", startDrag);
  window.addEventListener("pointermove", onDrag);
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);

  window.addEventListener("resize", () => {
    if (!usingCustomPosition) return;
    const rect = tocRail.getBoundingClientRect();
    const clamped = clampToViewport(rect.left, rect.top);
    applyPosition(clamped.left, clamped.top);
    savePosition(clamped.left, clamped.top);
  });
}
