$(document).ready(function () {
  $("#searchBtn").click(function () {
    console.log("Hello");
    $(location).attr("href", "/list");
  });
});
