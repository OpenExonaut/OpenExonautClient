'use strict';

window.addEventListener('load', () => {
  const browser = document.getElementById('content');

  browser.focus();
  browser.loadURI(window.arguments[0], null, null);

  // tailored to the OpenExonaut page, do this to all external links
  browser.addEventListener("DOMContentLoaded", () => {
    let buttons = browser.contentDocument.getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].innerHTML == "Discord Chat") {
        buttons[i].onclick = null;
        buttons[i].outerHTML = "<p>Discord:<br>discord.com/invite/ze3VczKHfZ</p>";
        i--;
      }
      else if (buttons[i].innerHTML == "Github Issues") {
        buttons[i].onclick = null;
        buttons[i].outerHTML = "<p>GitHub Issues:<br>github.com/OpenExonaut<wbr>/OpenExonaut/issues</p>";
        i--;
      }
    }
  });
}, { once: true });
