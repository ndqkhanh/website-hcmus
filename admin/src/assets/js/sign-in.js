'use strict';
(function () {
  $('#sign-in-form').submit(function (e) {
    e.preventDefault();
    const email = $('#email').val();
    const password = $('#password').val();

    $.ajax({
      url: `${HOST_NAME}/v1/auth/signin`,
      type: 'POST',
      dataType: 'json',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        email,
        password,
      }),
      success: function (response) {
        if (!response) alert('Login failed');
        else if (response.message) alert(response.message);
        else {
          if (response.user.role === 0 || response.user.role === 1) {
            localStorage.setItem('userInfo', JSON.stringify(response));
            window.location.href = '/';
          } else {
            alert('You are not authorized to access this page');
          }
        }
      },
      error: function (error) {
        // console.log('[ERROR]', error);
        alert('Login failed');
      },
    });
  });
})();
