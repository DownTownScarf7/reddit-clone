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
    const postElemets = res.map(elem => (
      <div id={'post_' + elem.id} className="post" key={elem.id}>
        <h3>{elem.title}</h3>
        <h5>{elem.owner}</h5>
        <p>{elem.timestamp}</p>
        <h3>{elem.score}</h3>
        <p>{elem.url}</p>
        <button>UP</button>
        <button>DOWN</button>
        <button>edit</button>
        <button onClick={clickDel}>delete</button>
      </div>
    ));
    ReactDOM.render(postElemets, document.querySelector('#posts'));
    const clickDel = event => {
      event.target.parentNode.remove();
      http.open('DELETE', `http://localhost:3000/api/posts/${elem.id}`, true);
      http.send();
    }

    // btn_up.onclick = () => {
    //   http.open('PUT', `http://localhost:3000/api/posts/${elem.id}/upvote`, true);
    //   http.send();
    
    // }
    // btn_down.onclick = () => {
    //   http.open('PUT', `http://localhost:3000/api/posts/${elem.id}/downvote`, true);
    //   http.send();
    // }
  }
}
http.send();
