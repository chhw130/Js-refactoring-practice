const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStorage(menu) {
    return localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));
  },
};

function App() {
  let menu = [];
  /**갯수 고쳐주는 함수 */

  const init = () => {
    if (store.getLocalStorage().length > 1) {
      const data = store.getLocalStorage();
      //   console.log(data);
      menu = data;
    }
    render();
  };

  const render = () => {
    const template = menu
      .map((item, index) => {
        return `
        <li data-menu-id=${index} class="menu-list-item d-flex items-center py-2">  
          <span class="w-100 pl-2 menu-name">${item.name}</span>
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

    $("#espresso-menu-list").innerHTML = template;
    UpdateMenuCount();
  };

  const UpdateMenuCount = () => {
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $("#espresso-menu-name").value = "";
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  /** 메뉴추가 함수 */
  const addMenuName = () => {
    const espressoMenuName = $("#espresso-menu-name").value;

    if (espressoMenuName === "") {
      return alert("값을 입력해주세요");
    }
    menu.push({ name: espressoMenuName });
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
    menu[menuId].name = updatedMenuName;
    store.setLocalStorage(menu);
    $menuName.innerText = updatedMenuName;
  };
  /** 메뉴삭제 함수 */
  const removeMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    menu.splice(menuId, 1);
    store.setLocalStorage(menu);
    e.target.closest("li").remove();
    UpdateMenuCount();
  };

  /** 수정 버튼 & 삭제 버튼 */
  $("#espresso-menu-list").addEventListener("click", (e) => {
    const className = e.target.className;

    if (className.includes("menu-edit-button")) {
      updateMenuName(e);
    } else if (className.includes("menu-remove-button")) {
      if (confirm("정말 삭제하겠습니까?")) {
        removeMenuName(e);
      }
    }
  });

  /** 제출 새로고침 막기 */
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#espresso-menu-submit-button").addEventListener("click", addMenuName);

  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addMenuName();
    }
  });

  init();
}

// const app = new App();

App();
// app.init();
