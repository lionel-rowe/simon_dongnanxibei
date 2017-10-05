document.addEventListener('DOMContentLoaded', function() {


  document.querySelectorAll('.gloss').forEach(function(el) {

    const gloss = document.createElement('div');
    gloss.classList.add('tooltip');

    const glossText = document.createTextNode(el.getAttribute('data-gloss'));

    gloss.appendChild(glossText);

    el.appendChild(gloss);

    el.setAttribute('aria-label', el.getAttribute('data-gloss'));

  });


});