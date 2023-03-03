import { $ } from "./utils/dom.js";
// import store from "./store/store.js";
import { MenuApi } from "./api/api.js";
import { BASE_URL } from "./api/api.js";

function App() {
  let menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  let currentCategory = "espresso";

  /** 초기설정 하는 함수 */
  const init = () => {
    fetch(`${BASE_URL}/category/${currentCategory}/menu`)
      .then((response) => response.json())
      .then((data) => {
        menu[currentCategory] = data;
        render();
      });
    initEventListeners();
  };

  /**렌더링 함수 */
  const render = async () => {
    menu[currentCategory] = await MenuApi.getAllMenuByCategory(currentCategory);
    const template = menu[currentCategory]
      .map((item) => {
        return `
        <li data-menu-id=${
          item.id
        } class="menu-list-item d-flex items-center py-2">  
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
    // const menuCount = $("#menu-list").querySelectorAll("li").length;   /**html태그를 셀수 있음.*/
    $("#menu-name").value = "";
    $(".menu-count").innerText = `총 ${menu[currentCategory].length}개`;
  };

  /** 메뉴추가 함수 */
  const addMenuName = async () => {
    const MenuName = $("#menu-name").value;

    if (MenuName === "") {
      return alert("값을 입력해주세요");
    }
    console.log(MenuName);
    const duplicatedItem = menu[currentCategory].find(
      (menu) => menu.name === $("#menu-name").value
    );
    console.log(menu[currentCategory][0].name);

    if (duplicatedItem) {
      alert("이미 등록된 아이템입니다.");
    }

    console.log(duplicatedItem);

    await MenuApi.createMenu(MenuName, currentCategory);
    render();
  };

  /** 메뉴수정 함수 */
  const updateMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId; // dataSet🐯
    console.log(menuId);
    const $menuName = e.target.closest("li").querySelector(".menu-name"); //가까운 요소 찾고 querySelector로 찾기
    const menuName = $menuName.innerText;
    const updatedMenuName = prompt("메뉴명을 수정하세요", menuName);
    await MenuApi.updateMenu(currentCategory, updatedMenuName, menuId);
    // menu[currentCategory][menuId].name = updatedMenuName;
    // store.setLocalStorage(menu);
    render();
  };
  /** 메뉴삭제 함수 */
  const removeMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    // console.log(e.target.closest("li"));
    await MenuApi.deleteMenu(currentCategory, menuId);
    render();
    UpdateMenuCount();
  };

  /** 수정 버튼 & 삭제 버튼 */
  $("#menu-list").addEventListener("click", async (e) => {
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
      // menu[currentCategory][menuId].isSoldOut =
      //   !menu[currentCategory][menuId].isSoldOut; //로컬에 저장된다..?
      // store.setLocalStorage(menu);
      await MenuApi.toggleMenu(currentCategory, menuId);
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

    $("nav").addEventListener("click", async (e) => {
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
