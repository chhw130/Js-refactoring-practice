export const BASE_URL = "http://localhost:3000/api";

/**API METHOD */
const HTTP_METHOD = {
  POST(data) {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  },
  PUT(data) {
    return {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  },
  TOGGLE(data) {
    return {
      method: "PUT",
    };
  },
  DELETE(data) {
    return {
      method: "DELETE",
    };
  },
};

/**fetch */
const request = async (url, option) => {
  const response = await fetch(url, option);
  if (!response.ok) {
    alert("에러 발생");
  }
  return response.json();
};

const requestWithoutJson = async (url, option) => {
  const response = await fetch(url, option);
  if (!response.ok) {
    alert("에러 발생");
  }
  return response;
};

/**API Function */
export const MenuApi = {
  /**메뉴 불러오기 */
  getAllMenuByCategory(category) {
    return request(`${BASE_URL}/category/${category}/menu`);
  },

  /* 메뉴 추가하기 **/
  createMenu(name, category) {
    return request(
      `${BASE_URL}/category/${category}/menu`,
      HTTP_METHOD.POST({ name })
    );
  },
  /** 메뉴 수정하기 */
  async updateMenu(category, name, menuId) {
    return request(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      HTTP_METHOD.PUT({ name })
    );
  },
  /**품절 처리하기 */
  async toggleMenu(category, menuId) {
    return request(
      `${BASE_URL}/category/${category}/menu/${menuId}/soldout`,
      HTTP_METHOD.TOGGLE()
    );
  },
  /**메뉴 삭제하기 */
  async deleteMenu(category, menuId) {
    return requestWithoutJson(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      HTTP_METHOD.DELETE()
    );
  },
};
