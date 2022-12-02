$(document).ready(function () {
  /**
   * Login
   */
  $("#btnContinueLogin").click(async function () {
    let email = $("#inputEmail").val();
    let password = $("#inputPassword").val();

    let response = await fetch(`${BACKEND_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    response = await response.json();

    if (!response) console.log("fetch del duoc");
    else if (response.message) alert(response.message);
    else {
      alert("You have successfully login!");
      localStorage.setItem("userInfo", JSON.stringify(response));
      $("#right-side-header").html(`      <span
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
      $("#loginModal").modal("toggle");

      $("#logOutBtn").click(() => {
        $(location).attr("href", "/");
      });

      $("#goToHistory").click(() => {
        $(location).attr("href", "/history");
      });
    }
  });

  /**
   * Register
   */
  $("#btnContinueRegister").click(async function () {
    let email = $("#inputEmailRegister").val();
    let password = $("#inputPasswordRegister").val();
    let repassword = $("#inputRePasswordRegister").val();

    let response = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        email,
        password,
        repassword,
      }),
    });

    response = await response.json();

    if (!response) alert("Registerd failed");
    else if (response.message) alert(response.message);
    {
      localStorage.setItem("userInfo", JSON.stringify(response));
      alert("You have succesfully registered an account");
      $("#right-side-header").html(`      <span
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
      $("#registerModal").modal("toggle");

      $("#logOutBtn").click(() => {
        $(location).attr("href", "/");
      });

      $("#goToHistory").click(() => {
        $(location).attr("href", "/history");
      });
    }
  });

  /**
   * Reset password
   */

  $("#btnContinueReset").click(async function () {
    let email = $("#inputEmailRestore").val();
    let newPassword = $("#inputPasswordRestore").val();
    let repassword = $("#inputRePasswordRestore").val();

    let response = await fetch(`${BACKEND_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        email,
        newPassword,
        repassword,
      }),
    });

    response = await response.json();

    if (!response) alert("Reset-password failed");
    else if (response.message) alert(response.message);
    {
      alert("You have succesfully restore an account");

      $("#right-side-header").html(`      <span
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
      localStorage.setItem("userInfo", JSON.stringify(response));
      $("#enterEmail").modal("toggle");

      $("#logOutBtn").click(() => {
        $(location).attr("href", "/");
      });

      $("#goToHistory").click(() => {
        $(location).attr("href", "/history");
      });
    }
  });

  /**
   * Search
   */
});
