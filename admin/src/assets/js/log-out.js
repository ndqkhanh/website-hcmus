"use strict";
(function () {
  $("#log-out-btn").click(function () {
    localStorage.removeItem("userInfo");
    window.location.href = "http://localhost:5000/pages/sign-in.html";
  });
})();
