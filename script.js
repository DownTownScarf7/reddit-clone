'use strict';

const http = new XMLHttpRequest(),
  newElem = (tag) => { return document.createElement(tag); },
  select = (tag) => { return document.querySelector(tag) };

select('#post-btn').onclick = () => {
  const titleElem = select('#post-title'),
    urlElem = select('#post-content'),
    title = titleElem.value,
    url = urlElem.value,
    owner = 'Test User';
  if (title.replace(/\s/g,'') && url.replace(/\s/g,'') && owner) {
    http.open('POST', `http://localhost:3000/api/posts`, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify({
      title,
      url,
      owner,
    }));
  } else {
    alert(title.replace(/\s/g,'') ? 'No url given!' : (`No title given! ${url.replace(/\s/g,'') ? '' : '\nNo url given!'}`));
  }
  titleElem.value = url.replace(/\s/g,'') ? null : title;
  urlElem.value = title.replace(/\s/g,'') ? null : url;
}

http.open('GET', 'http://localhost:3000/api/posts', true);
http.setRequestHeader("Content-Type", "application/json");
http.onload = () => {
  const res = JSON.parse(http.responseText).posts;
  if (res) {
    res.forEach(elem => {
      const container = newElem('div'),
        title = newElem('h3'),
        content = newElem('p'),
        by = newElem('h5'),
        date = newElem('p'),
        karma = newElem('h3'),
        btn_up = newElem('button'),
        btn_down = newElem('button'),
        btn_del = newElem('button');

      container.classList.add('post');
      select('#main').appendChild(container).appendChild(title).innerHTML = elem.title;
      container.appendChild(by).innerHTML = elem.owner;
      container.appendChild(date).innerHTML = elem.timestamp;
      container.appendChild(karma).innerHTML = elem.score;
      container.appendChild(content).innerHTML = elem.url;
      container.appendChild(btn_up).innerHTML = 'UP';
      container.appendChild(btn_down).innerHTML = 'DOWN';
      container.appendChild(btn_del).innerHTML = 'delete';

      btn_del.onclick = () => {
        container.remove();
        http.open('DELETE', `http://localhost:3000/api/posts/${elem.id}`, true);
        http.send();
      }
    });
  }
}
http.send();
