import { $ } from "./utils/dom.js";
import store from "./store/store.js";

function App() {
  let menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  let currentCategory = "espresso";

  const init = () => {
    if (store.getLocalStorage()) {
      const data = store.getLocalStorage();
      //   console.log(data);
      menu = data;
    }
    render();
    initEventListeners();
  };

  const render = () => {
    const template = menu[currentCategory]
      .map((item, index) => {
        return `
        <li data-menu-id=${index} class="menu-list-item d-flex items-center py-2">  
          <span class="w-100 pl-2 menu-name ${
            item.isSoldOut ? "sold-out" : ""
          }">${item.name}</span>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
          >
            품절
          </button>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
          >
            수정
          </button>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
          >
            삭제
          </button>
        </li>`;
      })
      .join("");

    $("#menu-list").innerHTML = template;
    UpdateMenuCount();
  };

  /**갯수 고쳐주는 함수 */
  const UpdateMenuCount = () => {
    const menuCount = $("#menu-list").querySelectorAll("li").length;
    $("#menu-name").value = "";
    $(".menu-count").innerText = `총 ${menu[currentCategory].length}개`;
  };

  /** 메뉴추가 함수 */
  const addMenuName = () => {
    const MenuName = $("#menu-name").value;

    if (MenuName === "") {
      return alert("값을 입력해주세요");
    }
    menu[currentCategory].push({ name: MenuName });
    store.setLocalStorage(menu);
    render();
  };

  /** 메뉴수정 함수 */
  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId; // dataSet🐯
    console.log(menuId);
    const $menuName = e.target.closest("li").querySelector(".menu-name"); //가까운 요소 찾고 querySelector로 찾기
    const menuName = $menuName.innerText;
    const updatedMenuName = prompt("메뉴명을 수정하세요", menuName);
    menu[currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(menu);
    render();
  };
  /** 메뉴삭제 함수 */
  const removeMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    // console.log(e.target.closest("li"));
    menu[currentCategory].splice(menuId, 1);
    store.setLocalStorage(menu);
    render();
    // console.log(menu);
    UpdateMenuCount();
  };

  /** 수정 버튼 & 삭제 버튼 */
  $("#menu-list").addEventListener("click", (e) => {
    const className = e.target.className;

    if (className.includes("menu-edit-button")) {
      updateMenuName(e);
    }
    if (className.includes("menu-remove-button")) {
      if (confirm("정말 삭제하겠습니까?")) {
        removeMenuName(e);
      }
    }
    if (className.includes("menu-sold-out-button")) {
      const menuId = e.target.closest("li").dataset.menuId;
      menu[currentCategory][menuId].isSoldOut =
        !menu[currentCategory][menuId].isSoldOut; //로컬에 저장된다..?

      store.setLocalStorage(menu);
      render();
    }
  });

  const initEventListeners = () => {
    /** 제출 새로고침 막기 */
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-submit-button").addEventListener("click", addMenuName);

    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        addMenuName();
      }
    });

    $("nav").addEventListener("click", (e) => {
      const isButton = e.target.classList.contains("cafe-category-name");
      if (isButton) {
        const categoryBtnName = e.target.dataset.categoryName;

        currentCategory = categoryBtnName;

        // console.log(categoryBtnName);
        $(".mt-1").innerText = `${e.target.innerText} 메뉴 관리`;
        render();
      }
    });
  };

  init();
}

// const app = new App();

App();
// app.init();
