'use strict';
(function () {
  $('#log-out-btn').click(function () {
    localStorage.removeItem('userInfo');
    window.location.href = `/pages/sign-in.html`;
  });
})();
