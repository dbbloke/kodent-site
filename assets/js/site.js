(function () {
  function clamp(n, max) {
    return (n + max) % max;
  }

  function initGallery() {
    var root = document.querySelector("[data-gallery]");
    var lightbox = document.querySelector("[data-lightbox]");
    if (!root || !lightbox) return;
    var track = root.querySelector(".gallery-track");
    var opens = Array.prototype.slice.call(root.querySelectorAll("[data-open]"));
    var thumbs = Array.prototype.slice.call(root.querySelectorAll("[data-thumb]"));
    var img = lightbox.querySelector("img");
    var index = 0;

    function slideAt(i) {
      return opens[i] ? opens[i].querySelector("img") : null;
    }

    function show(i) {
      index = clamp(i, opens.length);
      track.style.transform = "translateX(" + -index * 100 + "%)";
      thumbs.forEach(function (thumb, n) {
        if (n === index) thumb.setAttribute("aria-current", "true");
        else thumb.removeAttribute("aria-current");
      });
      var current = slideAt(index);
      if (current && lightbox.open) {
        img.src = current.currentSrc || current.src;
        img.alt = current.alt || "";
      }
    }

    function openLightbox(i) {
      show(i);
      var current = slideAt(index);
      if (!current) return;
      img.src = current.currentSrc || current.src;
      img.alt = current.alt || "";
      if (typeof lightbox.showModal === "function") lightbox.showModal();
    }

    function closeLightbox() {
      if (lightbox.open) lightbox.close();
    }

    root.querySelector("[data-prev]").addEventListener("click", function () { show(index - 1); });
    root.querySelector("[data-next]").addEventListener("click", function () { show(index + 1); });
    thumbs.forEach(function (thumb) {
      thumb.addEventListener("click", function () { show(Number(thumb.getAttribute("data-thumb"))); });
    });
    opens.forEach(function (btn) {
      btn.addEventListener("click", function () { openLightbox(Number(btn.getAttribute("data-open"))); });
    });
    lightbox.querySelector("[data-lightbox-close]").addEventListener("click", closeLightbox);
    lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", function () { show(index - 1); });
    lightbox.querySelector("[data-lightbox-next]").addEventListener("click", function () { show(index + 1); });
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (event) {
      if (!lightbox.open) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") show(index - 1);
      if (event.key === "ArrowRight") show(index + 1);
    });
    show(0);
  }

  function initReviews() {
    var root = document.querySelector("[data-reviews]");
    if (!root) return;
    var track = root.querySelector(".review-track");
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-rev-dot]"));
    var total = root.querySelectorAll("[data-rev-slide]").length;
    var index = 0;

    function show(i) {
      index = clamp(i, total);
      track.style.transform = "translateX(" + -index * 100 + "%)";
      dots.forEach(function (dot, n) {
        if (n === index) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    }

    root.querySelector("[data-rev-prev]").addEventListener("click", function () { show(index - 1); });
    root.querySelector("[data-rev-next]").addEventListener("click", function () { show(index + 1); });
    dots.forEach(function (dot, n) {
      dot.addEventListener("click", function () { show(n); });
    });
    show(0);
  }

  function initTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.service-tabs [role="tab"]'));
    if (!tabs.length) return;

    function activate(tab, focus) {
      tabs.forEach(function (item) {
        var selected = item === tab;
        item.setAttribute("aria-selected", selected ? "true" : "false");
        var panel = document.getElementById(item.getAttribute("aria-controls"));
        if (panel) panel.hidden = !selected;
        if (selected && focus) item.focus();
      });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () { activate(tab, false); });
      tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
        if (event.key === "ArrowLeft") next = tabs[(index - 1 + tabs.length) % tabs.length];
        if (next) {
          event.preventDefault();
          activate(next, true);
        }
      });
    });
  }

  initGallery();
  initReviews();
  initTabs();
})();
