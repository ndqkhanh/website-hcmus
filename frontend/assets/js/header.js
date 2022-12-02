$(document).ready(function () {
  $("#logOutBtn").click(() => {
    $(location).attr("href", "/");
  });

  $("#goToHistory").click(() => {
    $(location).attr("href", "/history");
  });
});
