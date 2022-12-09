"use strict";
(async function () {
  const isAuthenticated = async () => {
    let userInfo = await localStorage.getItem("userInfo");
    if (typeof userInfo !== "undefined" && userInfo !== null) {
      userInfo = (await userInfo) ? JSON.parse(userInfo) : {};
      if (!userInfo.token.token) {
        alert("You are not authorized to access this page");
        return false;
      } else {
        let response = await fetch(
          `http://localhost:3000/v1/admin/booking/list/0/1`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo.token.token}`,
            },
          }
        );
        response = await response.json();
        if (!response) return false;
        if (typeof response.data === "undefined" || response.data === null) {
          return false;
        }
        return true;
      }
    } else return false;
  };

  const check = await isAuthenticated();
  if (!check) {
    window.location.href = "http://localhost:5000/pages/sign-in.html";
  }
})();
