'use strict';
(function () {
  $('#log-out-btn').click(function () {
    localStorage.removeItem('userInfo');
    window.location.href = `${HOST_NAME}/pages/sign-in.html`;
  });
})();
