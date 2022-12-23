$(document).ready(function () {
  let userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const nowDate = Date.now();
  if (userInfo && userInfo.token && Date.parse(userInfo.token.expires) > nowDate) {
    $('#right-side-header').html(`      <span
    class="dropdown-toggle"
    type="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
    style="margin-left: 5px"
  >
    <i class="fa-solid fa-circle-user fs-1 text-black-50"></i></span>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="/history" id="goToHistory">History</a></li>
    <li>
      <hr class="dropdown-divider" />
    </li>
    <li><a class="dropdown-item" href="/" id="logOutBtn">Logout</a></li>
  </ul>`);
  } else $('#right-side-header').html(`<button type="button" class="btn btn-primary" id="loginBtn">Login</button> `);

  $('#loginBtn').click(() => {
    $(location).attr('href', '/');
  });
  $('#logOutBtn').click(() => {
    localStorage.setItem('userInfo', null);
    $(location).attr('href', '/');
  });

  $('#goToHistory').click(() => {
    $(location).attr('href', '/history');
  });
});
