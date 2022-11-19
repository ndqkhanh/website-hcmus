$(document).ready(function () {
  $("#btnSearch").click(function () {
    let deparature = $("#departure").find(":selected").val();
    let destination = $("#destination").find(":selected").val();
    let date = $("#datepicker").datepicker("getDate");

    alert("Hello");
    $(location).attr("href", "http://localhost:4000/list");
  });
});
