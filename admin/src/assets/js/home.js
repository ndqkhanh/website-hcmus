'use strict';
(async function () {
  const isAuthenticated = async () => {
    let userInfo = localStorage.getItem('userInfo');
    if (typeof userInfo !== 'undefined' && userInfo !== null) {
      userInfo = userInfo ? JSON.parse(userInfo) : {};
      console.log('userInfo', userInfo);
      if (!userInfo?.token?.token) {
        alert('You are not authorized to access this page');
        return false;
      } else {
        try {
          let response = await fetch(`${HOST_NAME}/v1/admin/booking/list/0/1`, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo?.token?.token}`,
            },
          });
          response = await response.json();
          console.log('response', response);
          if (!response) return false;
          if (typeof response.data === 'undefined' || response.data === null) {
            return false;
          }
          return true;
        } catch (error) {
          return false;
        }
      }
    } else return false;
  };
  if (window.location.pathname.indexOf('/pages/sign-in.html') >= 0) return;

  const check = await isAuthenticated();
  if (!check) {
    window.location.href = `/pages/sign-in.html`;
  }
})();
