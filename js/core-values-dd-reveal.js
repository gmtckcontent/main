(function () {
  var nodes = document.querySelectorAll("[data-cv-dd-reveal]");
  if (!nodes.length) return;
  if (!("IntersectionObserver" in window)) {
    nodes.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  nodes.forEach(function (el) {
    io.observe(el);
  });
})();
