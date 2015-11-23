// Fix chrome anchor bug
(function() {
  var el,
      hash = (location.hash || '').replace(/^#/, '');

  if ((el = document.getElementById('section_' + hash)))
    window.setTimeout(function() {
      window.scrollTo(0, el.offsetTop);
      el.setAttribute('class', 'target');
    }, 0);
}).call(window);

// Glossary
(function(){

  // glossarize('INC', 'http://www.google.com')

  function glossarize(a, b)
  {
    if(window.find)
    {
      while(window.find(a))
      {
        var node=document.createElement('b');
            node.appendChild(document.createTextNode(a));
        var rng=window.getSelection().getRangeAt(0);
            rng.collapse(false);
            rng.insertNode(node);
      }
    }
    else if(document.body.createTextRange)
    {
      var rng=document.body.createTextRange();
      while(rng.findText(a))
      {
        rng.collapse(false);
        rng.pasteHTML('<a href="' + b + '">'+a+'</a>');
      }
    }
  }
})();