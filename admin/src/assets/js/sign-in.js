"use strict";
(function () {
  $("#sign-in").click(function () {
    $("#sign-in-form").submit(function (e) {
      e.preventDefault();
    });
  });
})();
