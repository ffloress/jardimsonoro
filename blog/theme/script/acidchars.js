console.log('hello acid');

(function applyAcidToPunctuation() {
const punctuationRegex = /[.,<>\/;()*!@#$%^&*_\-+=\[\]{}:'"?~`|\\]/g;


  function wrapPunctuationInTextNode(textNode) {
    const parent = textNode.parentNode;
    const frag = document.createDocumentFragment();
    const text = textNode.nodeValue;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (punctuationRegex.test(char)) {
        const span = document.createElement('span');
        span.className = 'acid';
        span.textContent = char;
        frag.appendChild(span);
      } else {
        frag.appendChild(document.createTextNode(char));
      }
    }

    parent.replaceChild(frag, textNode);
  }

  function traverse(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.nodeValue.trim() !== '') {
        wrapPunctuationInTextNode(node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
      for (let i = node.childNodes.length - 1; i >= 0; i--) {
        traverse(node.childNodes[i]);
      }
    }
  }

  traverse(document.body);
})();
