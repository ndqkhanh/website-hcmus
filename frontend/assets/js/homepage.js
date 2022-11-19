$(document).ready(function () {
  /**
   * Login
   */
  $("#btnContinueLogin").click(async function () {
    let email = $("#inputEmail").val();
    let password = $("#inputPassword").val();

    let response = await fetch("http://localhost:3000/v1/auth/signin", {
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
      localStorage.setItem("token", response.tokens.access.token);
      $(location).attr("href", "http://localhost:4000");
    }
  });

  /**
   * Register
   */
  $("#btnContinueRegister").click(async function () {
    let email = $("#inputEmailRegister").val();
    let password = $("#inputPasswordRegister").val();
    let repassword = $("#inputRePasswordRegister").val();

    let response = await fetch("http://localhost:3000/v1/auth/signup", {
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
      console.log("response: ", response);
      localStorage.setItem("token", response.tokens.access.token);
      alert("You have succesfully registered an account");
      $(location).attr("href", "http://localhost:4000");
    }
  });

  /**
   * Reset password
   */

  $("#btnContinueReset").click(async function () {
    let email = $("#inputEmailRestore").val();
    let newPassword = $("#inputPasswordRestore").val();
    let repassword = $("#inputRePasswordRestore").val();

    console.log("email", email);
    console.log("newPassword", newPassword);
    console.log("repassword", repassword);
    let response = await fetch("http://localhost:3000/v1/auth/reset-password", {
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
      console.log("response: ", response);
      alert("You have succesfully restore an account");

      /**
       * After successfully reset password, fetch signin to get user token
       */
      response = await fetch("http://localhost:3000/v1/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          email,
          password: newPassword,
        }),
      });

      response = await response.json();
      localStorage.setItem("token", response.tokens.access.token);
      let token = localStorage.getItem("token");
      console.log("token: ", token);

      $(location).attr("href", "http://localhost:4000");
    }
  });

  /**
   * Search
   */
});
