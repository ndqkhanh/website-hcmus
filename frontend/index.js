const express = require("express");
const { create } = require("express-handlebars");

const app = express();
const port = 4000;
const path = require("path");
const hbs = create({
  partialsDir: [path.join(__dirname, "./views/partials")],
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "./views"));
app.use(express.static(path.join(__dirname, "./assets")));
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000/v1";


app.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
    BACKEND_URL,
  });
});

app.get("/list", (req, res) => {
  res.render("list", {
    title: "List of buses",
    BACKEND_URL,
  });
});

app.get("/fill-form/:busId", (req, res) => {
  res.render("fill-form", {
    title: "Fill form",
    BACKEND_URL,
  });
});

app.get("/booking", (req, res) => {
  res.render("booking", {
    title: "Booking",
    BACKEND_URL,
  });
});

app.get("/history", (req, res) => {
  res.render("history", {
    title: "History",
    BACKEND_URL,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

(async function checkToken() {
  const isAuthenticated = async () => {
    let userInfo = await localStorage.getItem("userInfo");
    if (typeof userInfo !== "undefined" && userInfo !== null) {
      userInfo = (await userInfo) ? JSON.parse(userInfo) : {};
      if (!userInfo.token.token) {
        alert("You are not authorized to access this page");
        return false;
      } else {
        let response = await fetch(
          `http://localhost:3000/v1/admin/booking/list/0/1`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo.token.token}`,
            },
          }
        );
        response = await response.json();
        if (!response) return false;
        if (typeof response.data === "undefined" || response.data === null) {
          return false;
        }
        return true;
      }
    } else return false;
  };

  const check = await isAuthenticated();
  if (!check) {
    window.location.href = "http://localhost:5000/pages/sign-in.html";
  }
})();

