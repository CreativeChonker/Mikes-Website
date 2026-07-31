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

// Pages without a drawer (e.g. graphic-design.html) skip the whole block below.
if (drawer) {

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

}

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

  const sectionIds = ["skills", "sites", "automations", "certifications"];
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

// Fade sections up as they enter the viewport
const revealTargets = document.querySelectorAll(
  ".section-head, .rule-item, .skill-group, .subsection-head, .project-card, .cert-card, .band-inner"
);

if (revealTargets.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealTargets.forEach(el => el.classList.add("reveal"));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });

  revealTargets.forEach(el => revealObserver.observe(el));

  // Safety net: content must never stay invisible. If the observer has not
  // fired by the time the page settles (backgrounded tab, blocked callback),
  // drop the hidden state entirely.
  window.setTimeout(() => {
    if (document.querySelector(".reveal.in")) return;
    revealObserver.disconnect();
    revealTargets.forEach(el => el.classList.remove("reveal"));
  }, 2000);
}
