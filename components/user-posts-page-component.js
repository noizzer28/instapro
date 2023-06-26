import {renderHeaderComponent} from './header-component.js';
import { posts, userImage, userName, renderApp} from "../index.js";
import { likePost, dislikePost } from '../api.js';

function renderUserPosts() {
    const userPosts = posts.map((post, index) => {
            return `
              <li class="post">
            <div class="post-image-container">
              <img class="post-image" src="${post.imageUrl}">
            </div>
            <div class="post-likes">
              <button data-postid="${post.id}" class="like-button" data-toggle = "${post.isLiked}" data-index="${index}">
                <img  class="like-icon" ${post.isLiked ? `src="./assets/images/like-active.svg"` : `src="./assets/images/like-not-active.svg"`}>
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
            return userPosts;
}


export function renderUserPostsComponent({ appEl, token }) {
    const userPostsHTML = renderUserPosts();
      const appHtml = `
      <div class="page-container">
        <div class="header-container">
        </div>    
        <div class="posts-user-header">
                    <img src='${userImage}' class="posts-user-header__user-image">
                    <p class="posts-user-header__user-name">${userName}</p>
                </div>
        <ul class="posts">
        ${userPostsHTML}
        </ul>
      </div>  
    `;
  
      appEl.innerHTML = appHtml;

      
      renderHeaderComponent({
        element: document.querySelector(".header-container"),
      }); 
      

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