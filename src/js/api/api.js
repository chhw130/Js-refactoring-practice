export const BASE_URL = "http://localhost:3000/api";

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
};

const request = async (url, option) => {
  const response = await fetch(url, option);
  if (!response.ok) {
    alert("에러 발생");
  }
  return response.json();
};

export const MenuApi = {
  getAllMenuByCategory(category) {
    return request(`${BASE_URL}/category/${category}/menu`);
  },
  async createMenu(name, category) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      console.error("에러 발생");
    }
  },
  async updateMenu(category, name, menuId) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      }
    );
    if (!response.ok) {
      console.error("PUT 에러 발생");
    }
    return response.json();
  },
  async toggleMenu(category, menuId) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${menuId}/soldout`,
      {
        method: "PUT",
      }
    );
    if (!response.ok) {
      console.error("Toggle 에러가 발생");
    }
  },
  async deleteMenu(category, menuId) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      console.error("DEL 에러가 발생");
    }
  },
};
