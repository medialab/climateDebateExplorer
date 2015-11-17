(function() {
  var el,
      hash = (location.hash || '').replace(/^#/, '');

  if ((el = document.getElementById('section_' + hash)))
    window.setTimeout(function() {
      window.scrollTo(0, el.offsetTop);
      el.setAttribute('class', 'target');
    }, 0);
}).call(window);
