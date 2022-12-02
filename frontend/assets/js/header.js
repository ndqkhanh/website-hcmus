$(document).ready(function () {
  $("#logOutBtn").click(() => {
    $(location).attr("href", "http://localhost:4000/");
  });

  $("#goToHistory").click(() => {
    $(location).attr("href", "http://localhost:4000/history");
  });
});
