// Restrained on-load motion + count-up stats.
// Mirrors the small touches used across the dashboards this site documents:
// soft fade-in-up on cards, and a count-up animation on stat tiles.

document.addEventListener('DOMContentLoaded', function () {
  var targets = document.querySelectorAll('.card, .project, .callout, .diagram, .table-wrap, .stat-tile');
  targets.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.animationDelay = (Math.min(i, 8) * 0.06) + 's';
  });

  var counters = document.querySelectorAll('[data-count]');
  counters.forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 900;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
});
