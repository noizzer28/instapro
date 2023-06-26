import { POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, renderApp } from "../index.js";
import { dislikePost, likePost } from "../api.js";
import { formatDistanceToNow, format } from "date-fns";
import { locale } from 'date-fns/locale/ru'


function renderPostsComponent () {
  const newPosts = posts.map((post, index) => {
    const postDate = new Date(post.createdAt);
    const ruLocale = require("date-fns/locale/ru")
    const newPostDate = formatDistanceToNow(postDate, 
      {addSuffix: true},
      {locale: ruLocale})
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
    <button data-postid="${post.id}" class="like-button " data-toggle = "${post.isLiked}" data-index="${index}">
            <img  ${post.isLiked ? `src="./assets/images/like-active.svg"` : `src="./assets/images/like-not-active.svg"`}>
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
      ${newPostDate}
    </p>
  </li>`
  }).join("");
    return newPosts;
}

export function renderPostsPageComponent({ appEl, token }) { 
  let postsHTML = renderPostsComponent();
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
      if  (!token) {
        alert("Авторизуйтесь, чтобы ставить лайки")
        return
      }
      likeEl.classList.add("like-icon")
      let postId = likeEl.dataset.postid
      let index = likeEl.dataset.index
      if (likeEl.dataset.toggle == "true") {
        dislikePost(postId, token)
        .then((data) => {
          posts[index] = data;
          renderApp()
          likeEl.classList.remove("like-icon")
        })

      } else {
        likePost(postId, token)
        .then((data)=> {
          posts[index] = data;
          renderApp()
          likeEl.classList.remove("like-icon")
        })

      }
    })
  }
}
