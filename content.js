const targetNode = document.body;
// const targetNode = document.body.querySelector('[aria-label^="Main Feed');

const config = { attributes: false, childList: true, subtree: true}

const checkDislikeUrl = "https://k6lplf5k2zzz3ufa7wxi3unrze0bhslw.lambda-url.us-west-2.on.aws";
const postDislikeUrl = "https://nf7ngejn5icfqe5rszetdz3mtm0rgvyk.lambda-url.us-west-2.on.aws";

const hideOrDislikeAction = async (post, banner, activityId) => {
  post.style.maxHeight = '0px';
  post.style.overflow = 'hidden';

  let parent = post.parentElement;
  if(parent) {
    parent.appendChild(banner);
    banner.style.visibility = "visible";
    banner.onclick = () => {
      post.style.maxHeight = 'inherit';
      post.style.overflow = 'inherit';
      parent.removeChild(banner);
    }
  }
  if(activityId) fetch(postDislikeUrl, {method: 'POST', body: JSON.stringify({activityId: activityId})})
}

const callback = async function(mutationList, observer) {
  observer.disconnect();
  setTimeout(() => {}, 3000);

  for(let mutation of mutationList) {
    let posts = mutation.target.querySelectorAll('[data-urn^="urn:li:activity"]');

    for(let post of posts) {
      if(post.getAttribute("thumbsdown-fulfilled")) {
        console.log("this one is already enriched")
        continue;
      }

      const activityId = post.getAttribute("data-urn").split(":").slice(-1)[0];
      const activityResponse = await fetch(checkDislikeUrl, {method: 'POST', body: JSON.stringify({activityId: activityId})});

      const activeDislikeCount = activityResponse.ok ? await activityResponse.json()['dislikeCount'] : 0;

      post.setAttribute("thumbsdown-fulfilled", true);
      let banner = document.createElement("div");
      banner.className = "banner-content";
      let info = document.createElement("span");
      info.innerHTML = "Post hidden due to low approval rating.";
      info.className = "info-text";
      let dislikeCount = document.createElement("span");
      dislikeCount.innerHTML = activeDislikeCount > 1 ? `${activeDislikeCount} Dislikes` : "1 Dislike";
      dislikeCount.className = "dislike-text";
      banner.appendChild(info);
      banner.appendChild(dislikeCount);
      banner.style.visibility = "hidden";

      let actionbar = post.querySelector('.feed-shared-social-action-bar'); 

      if(actionbar) {
        let thumbsDownButton = document.createElement('button');
        thumbsDownButton.className = "thumbs-down-button";
        let image = document.createElement('img');
        image.src = chrome.runtime.getURL("thumbsdown-removebg-preview.png");
        image.setAttribute('height', '28');
        image.setAttribute('width', '28');
        let text = document.createElement('span');
        text.innerHTML = 'Dislike';
        thumbsDownButton.appendChild(image);
        thumbsDownButton.appendChild(text);

        thumbsDownButton.onclick = () => {hideOrDislikeAction(post, banner, activityId)};

        actionbar.appendChild(thumbsDownButton);
      }

      let options = post.querySelector('.social-details-social-counts__reactions--animated');
      if(options) {
        let thumbsDownCount = document.createElement('span');
        thumbsDownCount.className = "thumbs-down-count t-12";
        thumbsDownCount.innerHTML = "0 dislikes";
        options.appendChild(thumbsDownCount);
      }

      if(activeDislikeCount > 0) {
        hideOrDislikeAction(post, banner, null); // hide the post but don't actively dislike it.
      }
    }
  }

  observer.observe(targetNode, config);
}

const observer = new MutationObserver(callback);

observer.observe(targetNode, config);