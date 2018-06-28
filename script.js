'use strict';

const http = new XMLHttpRequest(),
  newElem = (tag) => { return document.createElement(tag); },
  select = (tag) => { return document.querySelector(tag) };

http.open('GET', 'http://localhost:3000/api/post.json', true);
http.onload = () => {
  const res = JSON.parse(http.responseText).post_data;
  res.forEach(elem => {
    const data = [];
    const container = newElem('div'),
      title = newElem('h3'),
      content = newElem('p'),
      by = newElem('h5'),
      date = newElem('p'),
      karma = newElem('h3');
    container.classList.add('post');
    select('#main').appendChild(container).appendChild(title).innerHTML = elem.title;
    container.appendChild(by).innerHTML = elem.posted_by;
    container.appendChild(date).innerHTML = elem.date;
    container.appendChild(karma).innerHTML = elem.karma;
    container.appendChild(content).innerHTML = elem.content;
  });
}
http.send();
