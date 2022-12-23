'use strict';
(async function () {
  const isAuthenticated = async () => {
    let userInfo = localStorage.getItem('userInfo');
    if (typeof userInfo !== 'undefined' && userInfo !== null) {
      userInfo = userInfo ? JSON.parse(userInfo) : {};
      if (!userInfo.token) {
        alert('You are not authorized to access this page');
        return false;
      } else {
        try {
          let response = await fetch(
            `http://localhost:3000/v1/admin/booking/list/0/1`,
            {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
              },
            }
          );
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

  const check = await isAuthenticated();
  if (!check) {
    console.log('vui');
    // window.location.href = 'http://localhost:5000/pages/sign-in.html';
  }
})();
