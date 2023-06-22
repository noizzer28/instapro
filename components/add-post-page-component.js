import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { uploadPost } from "../api.js";
import { goToPage } from "../index.js";
import { POSTS_PAGE } from "../routes.js";


export function renderAddPostPageComponent({ appEl, token }) {
  let imageUrl;
  const render = () => {
    const appHtml = `
    <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
            <h3 class="form-title">
              Добавить пост
              </h3>
            <div class="form-inputs">
                    <div class="upload-image-container"></div>
                    Опишите фотографию:
                <input type="textarea" rows="4" id="text-input" class="input" placeholder=""/>
                <div class="form-error"></div>
                
                <button class="button" id="add-button">Добавить</button>
            </div>
        </div>
    </div>    
`;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    }); 

    const uploadImageContainer = appEl.querySelector(".upload-image-container");

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }



    document.getElementById("add-button").addEventListener("click", () => {
      const newToken = token
      const description = document.getElementById("text-input").value;
      if (!description) {
        alert("Введите описание");
        return;
      }
      if (!imageUrl) {
        alert("Не выбрана фотография");
        return;
      }
      uploadPost({
        description, 
        imageUrl,
        newToken,
      }).then(() => {
        goToPage(POSTS_PAGE);
      })
    });
  };

  render();
}
