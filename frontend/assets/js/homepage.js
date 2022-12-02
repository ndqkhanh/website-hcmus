$(document).ready(function () {
  /**
   * Login
   */
  $("#btnContinueLogin").click(function () {
    $("#right-side-header").html(`<span
    class="dropdown-toggle"
    type="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
    style="margin-left: 5px"
  >
    <i class="fa-solid fa-circle-user fs-1 text-black-50"></i>
  </span>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#" id="goToHistory">History</a></li>
    <li>
      <hr class="dropdown-divider" />
    </li>
    <li><a class="dropdown-item" href="#" id="logOutBtn">Logout</a></li>
  </ul>`);
    $("#loginModal").modal("toggle");
    $("#logOutBtn").click(() => {
      $(location).attr("href", "/");
    });

    $("#goToHistory").click(() => {
      $(location).attr("href", "/history");
    });
  });

  /**
   * Register
   */
  $("#btnContinueRegister").click(function () {
    $("#right-side-header").html(`<span
    class="dropdown-toggle"
    type="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
    style="margin-left: 5px"
  >
    <i class="fa-solid fa-circle-user fs-1 text-black-50"></i>
  </span>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#" id="goToHistory">History</a></li>
    <li>
      <hr class="dropdown-divider" />
    </li>
    <li><a class="dropdown-item" href="#" id="logOutBtn">Logout</a></li>
  </ul>`);
    $("#registerModal").modal("toggle");
    $("#logOutBtn").click(() => {
      $(location).attr("href", "/");
    });

    $("#goToHistory").click(() => {
      $(location).attr("href", "/history");
    });
  });

  /**
   * Reset password
   */

  $("#btnContinueReset").click(function () {
    $("#right-side-header").html(`      <span
    class="dropdown-toggle"
    type="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
    style="margin-left: 5px"
  >
    <i class="fa-solid fa-circle-user fs-1 text-black-50"></i>
  </span>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#" id="goToHistory">History</a></li>
    <li>
      <hr class="dropdown-divider" />
    </li>
    <li><a class="dropdown-item" href="#" id="logOutBtn">Logout</a></li>
  </ul>`);
    $("#enterEmail").modal("toggle");
    $("#logOutBtn").click(() => {
      $(location).attr("href", "/");
    });

    $("#goToHistory").click(() => {
      $(location).attr("href", "/history");
    });
  });

  /**
   * Search
   */
  $("#logOutBtn").click(() => {
    $(location).attr("href", "/");
  });

  $("#goToHistory").click(() => {
    $(location).attr("href", "/history");
  });
});
