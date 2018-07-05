'use strict';

const http = new XMLHttpRequest();

document.querySelector('#post-btn').onclick = () => {
  const titleElem = document.querySelector('#post-title'),
    urlElem = document.querySelector('#post-content'),
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
  let res = null;
  try {
    res = JSON.parse(http.responseText).posts;
  }
  catch (err) {
    console.error(err);
    return;
  }
  console.log(res);  // DEBUG
  if (res) {
    const clickDel = event => {
      event.target.parentNode.remove();
      http.open('DELETE', `http://localhost:3000/api/posts/${event.target.parentNode.dataset.id}`, true);
      http.send();
    }

    const upDoot = event => {
      http.open('PUT', `http://localhost:3000/api/posts/${event.target.parentNode.dataset.id}/upvote`, true);
      http.send();
    }

    const downDoot = event => {
      http.open('PUT', `http://localhost:3000/api/posts/${event.target.parentNode.dataset.id}/downvote`, true);
      http.send();
    }
    const postElemets = res.map(elem => (
      <div id={'post_' + elem.id} data-id={elem.id} className="post" key={elem.id}>
        <p className='post-title'>{elem.title}</p>
        <p className='post-owner'>{elem.owner}</p>
        <p className='post-timestamp'>{elem.timestamp}</p>
        <h3 className='post-score'>{elem.score}</h3>
        <p className='post-url'>{elem.url}</p>
        <button className='post-btn up' onClick={upDoot}>UP</button>
        <button className='post-btn down' onClick={downDoot}>DOWN</button>
        <button className='post-btn edit'>edit</button>
        <button className='post-btn delete' onClick={clickDel}>delete</button>
      </div>
    ));
    ReactDOM.render(postElemets, document.querySelector('#posts'));
  }
}
http.send();
