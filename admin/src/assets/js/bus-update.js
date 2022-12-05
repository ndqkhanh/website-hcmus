$(document).ready(async function () {
  const MAX_LIMIT = 100;
  const OFFSET = 0;

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyYjU1ZTdhMC02NmNkLTQ5ZjMtOTE2OS0xZjBkZjIzMzVmNjIiLCJpYXQiOjE2NzAyNDk3NDcsImV4cCI6MTY3MDI1MTU0NywidHlwZSI6ImFjY2VzcyJ9.sS6o3TBpZ447rpBmS8NmNNwX17CdPWt5f6ekQl2KFAw";
  $.ajax({
    url: `http://localhost:3000/v1/admin/booking/${id}`,
    type: "GET",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function (booking) {
      $("#email").val(booking.users.email);
      $("#name").val(booking.name);
      $("#phone").val(booking.phone);
      $("#seat").val(booking.seat);
      $("#status").val(booking.status);
      $("#start_point").val(
        booking.buses.bus_stations_bus_stationsTobuses_start_point.name
      );
      $("#end_point").val(
        booking.buses.bus_stations_bus_stationsTobuses_end_point.name
      );
    },
    error: function (error) {
      console.log("error", error);
    },
  });

  $("#update-booking").submit(function (e) {
    e.preventDefault();
    const name = $("#name").val();
    const phone = $("#phone").val();
    const seat = $("#seat").val();
    const status = $("#status").val();
    $.ajax({
      url: `http://localhost:3000/v1/admin/booking/${id}`,
      type: "POST",
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: {
        name: name,
        phone: phone,
        seat: seat,
        status: status,
      },
      success: function (data) {
        console.log("data", data);
        window.location.href = "/pages/booking";
      },
      error: function (error) {
        console.log("error", error);
      },
    });
  });

  /**
   * Show list bus operator from db
   */
  let boList = await fetch(
    `http://localhost:3000/v1/bus-operator/list/${OFFSET}/${MAX_LIMIT}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer " + token,
      },
    }
  );

  boList = await boList.json();
  boList = boList.data;
  let boListString = "<option selected>Select Bus Operator</option>";
  boList.forEach((item) => {
    boListString += `<option value=${item.id}>${item.name}</option>`;
  });
  $("#Bus-Operator").html(boListString);

  /**
   * Show list of Start Point from db
   */
  let startPointList = await fetch(
    `http://localhost:3000/v1/bus-station/list`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer " + token,
      },
    }
  );

  startPointList = await startPointList.json();
  startPointList = startPointList.data;
  let startPointListHtml = "<option selected>Select Start Point</option>";
  startPointList.forEach((startPoint) => {
    startPointListHtml += `<option value=${startPoint.id}>${startPoint.name}, ${startPoint.location}</option>`;
  });

  $("#Start-Point").html(startPointListHtml);

  /**
   * Show End Point List from DB
   */
  let endPointList = await fetch(`http://localhost:3000/v1/bus-station/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: "Bearer " + token,
    },
  });

  endPointList = await endPointList.json();
  endPointList = endPointList.data;
  let endPointListHtml = "<option selected>Select End Point</option>";
  endPointList.forEach((endPoint) => {
    endPointListHtml += `<option value=${endPoint.id}>${endPoint.name}, ${endPoint.location}</option>`;
  });
  $("#End-Point").html(endPointListHtml);

  /**
   * Show list type of bus from DB
   */
  let typeOfBusList = [
    { value: 0, type: "Limousine" },
    { value: 1, type: "Normal Seat" },
    { value: 2, type: "Sleeper Bus" },
  ];
  let typeOfBusListHtml = "<option selected>Select Type</option>";
  typeOfBusList.forEach((typeOfBus) => {
    typeOfBusListHtml += `<option value = ${typeOfBus.value}>${typeOfBus.type}</option>`;
  });
  $("#Type").html(typeOfBusListHtml);

  /**
   * Update bus
   */
  $("Update-Button").click(function () {});
  $("#Bus-Operator").click(function () {});
});
