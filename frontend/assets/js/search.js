$(document).ready(function () {
  console.log("Hello ngoai");
  $("#searchBtn").click(function () {
    console.log("Hello");
    $(location).attr("href", "http://localhost:4000/list");
  });
});
