console.log("before method");

const targetNode = document.body;

const config = { attributes: false, childList: true, subtree: true}

const callback = function(mutationList, observer) {
  for(let mutation of mutationList) {
    let posts = mutation.target.querySelectorAll('[data-urn^="urn:li:activity"]');

    for(let post of posts) {
      if(post.getAttribute("thumbsdown-fulfilled")) {
        continue;
      }

      post.setAttribute("thumbsdown-fulfilled", true);
      let banner = document.createElement("div");
      banner.className = "banner-content";
      let info = document.createElement("span");
      info.innerHTML = "Post hidden due to low approval rating.";
      info.className = "info-text";
      banner.appendChild(info);
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

        thumbsDownButton.onclick = () => {
          console.log('trying to hide element');
          console.log(post);
          post.style.maxHeight = '0px';
          post.style.overflow = 'hidden';

          let parent = post.parentElement;
          if(parent) {
            parent.appendChild(banner);
            banner.style.visibility = "visible";
          }
        }

        actionbar.appendChild(thumbsDownButton);
      }

      let options = post.querySelector('.social-details-social-counts__reactions--animated');
      if(options) {
        let thumbsDownCount = document.createElement('span');
        thumbsDownCount.className = "thumbs-down-count t-12";
        thumbsDownCount.innerHTML = "0 dislikes";
        options.appendChild(thumbsDownCount);
      }
    }
  }
}

const observer = new MutationObserver(callback);

observer.observe(targetNode, config);

console.log("after method");