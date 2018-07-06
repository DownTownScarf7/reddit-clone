'use strict';

const un = document.querySelector('#username'),
  pw = document.querySelector('#password'),
  show = document.querySelector('img');

document.querySelector('form').addEventListener('click', event => {
  switch (event.target) {
    case document.querySelector('#submit'):
      if (un.value && pw.value) {
        event.preventDefault();
        window.location = `http://localhost:3000/${un.value}`;
      }
      break;
    case show:
      if (pw.type === 'password') {
        pw.type = 'text';
        show.src = 'https://cdn3.iconfinder.com/data/icons/show-and-hide-password/100/show_hide_password-08-512.png';
      } else {
        pw.type = 'password';
        show.src = 'https://cdn3.iconfinder.com/data/icons/show-and-hide-password/100/show_hide_password-07-512.png';
      }
      break;
  }
});
