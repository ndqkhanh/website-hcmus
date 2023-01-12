$(document).ready(function () {
  let userInfo = localStorage.getItem('userInfo');
  if (userInfo) userInfo = JSON.parse(userInfo);

  const nowDate = Date.now();
  if (userInfo && userInfo?.token?.token && Date.parse(userInfo.token.expires) > nowDate) {
    $('#right-side-header').html(`      <span
    class="dropdown-toggle"
    type="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
    style="margin-left: 5px"
  >
    <i class="fa-solid fa-circle-user fs-1 text-black-50"></i></span>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#" id="goToHistory">History</a></li>
    <li>
      <hr class="dropdown-divider" />
    </li>
    <li><a class="dropdown-item" href="#" id="logOutBtn">Logout</a></li>
  </ul>`);
  }

  /**
   * Login
   */
  $('#btnContinueLogin').click(async function () {
    let email = $('#inputEmail').val();
    let password = $('#inputPassword').val();

    let response = await fetch(`${BACKEND_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    response = await response.json();
    console.log('response ', response);
    if (!response) console.log('fetch khong duoc');
    else if (response.message) alert(response.message);
    else {
      if (!response.user.verification) {
        alert("You haven't verified your account yet. ");
        return;
      }
      alert('You have successfully logged in!');
      localStorage.setItem('userInfo', JSON.stringify(response));
      $('#right-side-header').html(`      <span
      class="dropdown-toggle"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      style="margin-left: 5px"
    >
      <i class="fa-solid fa-circle-user fs-1 text-black-50"></i></span>
    <ul class="dropdown-menu">
      <li><a class="dropdown-item" href="#" id="goToHistory">History</a></li>
      <li>
        <hr class="dropdown-divider" />
      </li>
      <li><a class="dropdown-item" href="#" id="logOutBtn">Logout</a></li>
    </ul>`);
      $('#loginModal').modal('toggle');

      $('#logOutBtn').click(() => {
        localStorage.setItem('userInfo', null);
        $(location).attr('href', '/');
      });

      $('#goToHistory').click(() => {
        $(location).attr('href', '/history');
      });
    }
  });

  /**
   * Register
   */
  $('#btnContinueRegister').click(async function () {
    let email = $('#inputEmailRegister').val();
    let password = $('#inputPasswordRegister').val();
    let repassword = $('#inputRePasswordRegister').val();

    // Signup
    let response = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        email,
        password,
        repassword,
      }),
    });
    response = await response.json();

    if (!response) alert('Registerd failed');
    else if (response.message) alert(response.message);
    else if (response.user && response.token) {
      alert('Please enter your otp code');
      $('#registerModal').modal('toggle');

      $('#otpModal').modal('show');

      let sendEmail = await fetch(`${BACKEND_URL}/auth/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          email,
        }),
      });

      $('#btnContinueOtp').click(async function () {
        let otp = $('#inputOTP').val();
        console.log('otp', otp);

        // Send Email

        // Verify email
        let verifyEmail = await fetch(`${BACKEND_URL}/auth/verify-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        });
        verifyEmail = await verifyEmail.json();
        console.log('verifyEmail ', verifyEmail.success);
        $('#otpModal').modal('toggle');
        if (verifyEmail.success === true) {
          $('#otpModal').modal('toggle');
          localStorage.setItem('userInfo', JSON.stringify(response));
          let userInfo = localStorage.getItem('userInfo');
          userInfo = JSON.parse(userInfo);
          if (userInfo && userInfo.token) {
            alert('You have succesfully registered an account');
            $('#right-side-header').html(`      <span
              class="dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style="margin-left: 5px"
            >
              <i class="fa-solid fa-circle-user fs-1 text-black-50"></i></span>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#" id="goToHistory">History</a></li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li><a class="dropdown-item" href="#" id="logOutBtn">Logout</a></li>
              </ul>`);
            // $("#registerModal").modal("toggle");

            $('#logOutBtn').click(() => {
              localStorage.setItem('userInfo', null);
              $(location).attr('href', '/');
            });

            $('#goToHistory').click(() => {
              $(location).attr('href', '/history');
            });
          }
        } else alert('You failed to verify-email');
      });
    }
  });

  /**
   * Reset password
   */

  $('#btnContinueReset').click(async function () {
    let email = $('#inputEmailRestore').val();
    let newPassword = $('#inputPasswordRestore').val();
    let repassword = $('#inputRePasswordRestore').val();

    let response = await fetch(`${BACKEND_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        email,
        newPassword,
        repassword,
      }),
    });

    response = await response.json();

    console.log(response);

    if (!response) alert('Reset-password failed');
    else if (response.message) alert(response.message);
    else if (response.success) {
      $('#enterEmail').modal('toggle');
      console.log('Hello');
      $('#otpModal').modal('show');

      let sendEmail = await fetch(`${BACKEND_URL}/auth/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          email,
        }),
      });

      $('#btnContinueOtp').click(async function () {
        let otp = $('#inputOTP').val();
        console.log(otp);
        let verifyEmail = await fetch(`${BACKEND_URL}/auth/verify-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        });
        verifyEmail = await verifyEmail.json();

        console.log('verifyEmail', verifyEmail);
        if (verifyEmail.success == true) {
          /**Sign in again */
          let data = await fetch(`${BACKEND_URL}/auth/signin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
              email,
              password: newPassword,
            }),
          });
          data = await data.json();
          localStorage.setItem('userInfo', JSON.stringify(data));
          let userInfo = data;
          console.log(userInfo);

          if (userInfo.token.token) {
            $('#otpModal').modal('toggle');
            alert('You have succesfully restored an account');

            $('#right-side-header').html(`      <span
            class="dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style="margin-left: 5px"
          >
            <i class="fa-solid fa-circle-user fs-1 text-black-50"></i></span>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#" id="goToHistory">History</a></li>
            <li>
              <hr class="dropdown-divider" />
            </li>
            <li><a class="dropdown-item" href="#" id="logOutBtn">Logout</a></li>
          </ul>`);
            // localStorage.setItem('userInfo', JSON.stringify(response));

            $('#logOutBtn').click(() => {
              localStorage.setItem('userInfo', null);
              $(location).attr('href', '/');
            });

            $('#goToHistory').click(() => {
              $(location).attr('href', '/history');
            });
          }
        }
      });
    }
  });

  $('#logOutBtn').click(() => {
    localStorage.setItem('userInfo', null);
    $(location).attr('href', '/');
  });

  $('#goToHistory').click(() => {
    $(location).attr('href', '/history');
  });
  /**
   * Change mouse when hover
   */
  $('#regiterLink').css({ cursor: 'pointer' });
  $('#restoreLink').css({ cursor: 'pointer' });
});
