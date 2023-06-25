import { POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
import { dislikePost, likePost } from "../api.js";
import { formatDistanceToNow } from "date-fns";
let date = formatDistanceToNow(new Date);
console.log(date)

function renderPostsComponent () {
  const newPosts = posts.map((post) => {
    return `
      <li class="post">
    <div class="post-header" data-user-id="${post.user.id}" data-img="${post.user.imageUrl}" data-name="${post.user.name}">
        <img src="${post.user.imageUrl}" class="post-header__user-image" >
        <p class="post-header__user-name">${post.user.name}</p>
    </div>
    <div class="post-image-container">
      <img class="post-image" src="${post.imageUrl}">
    </div>
    <div class="post-likes">
    <button data-postid="${post.id}" class="like-button" data-toggle = ${post.isLiked}>
            <img ${post.isLiked ? `src="./assets/images/like-active.svg"` : `src="./assets/images/like-not-active.svg"`}>
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${post.likes.length}</strong>
          </p>
    </div>
    <p class="post-text">
      <span class="user-name">${post.user.name}</span>
      ${typeof post.description === 'object' ? '' : post.description
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")}
    </p>
    <p class="post-date">
      ${post.createdAt}
    </p>
  </li>`
  }).join("");
    return newPosts;
}

export function renderPostsPageComponent({ appEl, token }) { 
  let postsHTML = renderPostsComponent();
  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = `
              <div class="page-container">
                <div class="header-container">
                </div>
                <ul class="posts">
                 ${postsHTML}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
        userName: userEl.dataset.name,
        userImg: userEl.dataset.img,
      });
    });
  }

  // renderLikeComponent()
  for (let likeEl of document.querySelectorAll(".like-button")) {
    likeEl.addEventListener("click", () => {
      let postId = likeEl.dataset.postid
      if (likeEl.dataset.toggle == "true") {
        console.log("here1")
        dislikePost(postId, token)
        .then(() => {
          goToPage(POSTS_PAGE);
        })

      } else {
        console.log("here2")
        likePost(postId, token)
        .then(()=> {
          goToPage(POSTS_PAGE);
        })

      }
    })
  }
}
