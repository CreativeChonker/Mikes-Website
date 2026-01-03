// MODE TOGGLE (Developer / Designer)
const modeBtns = document.querySelectorAll(".pill-btn");
const pillContainer = document.querySelector(".pill-tabs");

modeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    modeBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    if (btn.dataset.mode === "design") {
      pillContainer.classList.add("design-active");
    } else {
      pillContainer.classList.remove("design-active");
    }
  });
});

// SECTION TABS (Skills / Portfolio)
const sectionTabs = document.querySelectorAll(".section-tab");
const sections = document.querySelectorAll(".section-content");

sectionTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    sectionTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    sections.forEach(sec => {
      sec.classList.remove("active");
      if (sec.id === tab.dataset.section) {
        sec.classList.add("active");
      }
    });
  });
});
