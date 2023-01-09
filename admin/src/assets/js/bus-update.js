$(document).ready(function () {
  const MAX_LIMIT = 100;
  const OFFSET = 0;

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  let userInfo = localStorage.getItem("userInfo");
  userInfo = JSON.parse(userInfo);
  let token = userInfo.token.token;

  let typeOfBusList = [
    { value: 0, type: "Limousine" },
    { value: 1, type: "Normal Seat" },
    { value: 2, type: "Sleeper Bus" },
  ];

  $.ajax(`${HOST_NAME}/v1/admin/bus/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: "Bearer " + token,
    },
    success: function (bus) {
      $("#Bus-Operator").html(
        `<option value = ${bus.bo_id}>${bus.bus_operators.name}</option>`
      );
      $("#Start-Point").html(
        `<option value = ${bus.start_point}>${bus.bus_stations_bus_stationsTobuses_start_point.name}</option>`
      );
      $("#End-Point").html(
        `<option value = ${bus.end_point}>${bus.bus_stations_bus_stationsTobuses_end_point.name}</option>`
      );
      let busType = "";
      typeOfBusList.forEach((item) => {
        if (item.value == bus.type) busType = item.type;
      });

      $("#Type").html(`<option value = ${bus.type}>${busType} </option>`);
      $("#Start-Time").val(bus.start_time);
      $("#End-Time").val(bus.end_time);
      $("#Policy").val(bus.policy);
      $("#Number-Of-Seats").val(bus.num_of_seats);
      $("#Price").val(bus.price);
      $("#Image-Bus").val(bus.image_url);
    },
    error: function (error) {
      console.log(error);
    },
  });

  /**
   * Show list bus operator from db
   */

  $("#Bus-Operator").click(function () {
    $.ajax(`${HOST_NAME}/v1/bus-operator/list/${OFFSET}/${MAX_LIMIT}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer " + token,
      },
      success: function (data) {
        let boList = data.data;
        console.log("bosList", boList);
        let boListString = `<select class="form-select" id="Bus-Operator">`;
        boList.forEach((item) => {
          if (userInfo.user.role === 1 && item.id != userInfo.user.boid) return;
          boListString += `<option value=${item.id}>${item.name}</option>`;
        });
        boListString += "</select>";
        $("#Bus-Operator").replaceWith(boListString);
      },
      error: function (error) {
        console.log(error);
      },
    });
  });

  /**
   * Show list of Start Point from db
   */
  $("#Start-Point").click(function () {
    $.ajax(`${HOST_NAME}/v1/bus-station/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer " + token,
      },
      success: function (data) {
        let startPointList = data.data;
        let startPointListHtml = `<select class="form-select" id="Start-Point"><option selected>Select Start Point</option>`;
        startPointList.forEach((startPoint) => {
          startPointListHtml += `<option value=${startPoint.id}>${startPoint.name}, ${startPoint.location}</option>`;
        });
        startPointListHtml += "</select>";

        $("#Start-Point").replaceWith(startPointListHtml);
      },
    });
  });

  /**
   * Show End Point List from DB
   */
  $("#End-Point").click(function () {
    $.ajax(`${HOST_NAME}/v1/bus-station/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer " + token,
      },
      success: function (data) {
        let endPointList = data.data;
        let endPointListHtml = `<select class="form-select" id="End-Point"><option selected>Select End Point</option>`;
        endPointList.forEach((endPoint) => {
          endPointListHtml += `<option value=${endPoint.id}>${endPoint.name}, ${endPoint.location}</option>`;
        });
        endPointListHtml += "</select>";
        $("#End-Point").replaceWith(endPointListHtml);
      },
    });
    // let endPointList = await fetch(
    //   `${HOST_NAME}/v1/bus-station/list`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json;charset=utf-8",
    //       Authorization: "Bearer " + token,
    //     },
    //   }
    // );

    // endPointList = await endPointList.json();
    // endPointList = endPointList.data;
    // let endPointListHtml = "<option selected>Select End Point</option>";
    // endPointList.forEach((endPoint) => {
    //   endPointListHtml += `<option value=${endPoint.id}>${endPoint.name}, ${endPoint.location}</option>`;
    // });
    // $("#End-Point").html(endPointListHtml);
  });

  /**
   * Show list type of bus from DB
   */

  $("#Type").click(function () {
    $("#Type").replaceWith(`<select class="form-select" id="Type">
    <option selected>Select Type</option>
    <option value="0">Limousine</option>
    <option value="1">Normal Seat</option>
    <option value="2">Sleeper Seat</option>
  </select>`);
  });

  /**
   * Update bus
   */

  $("#Update-Button").click(function (e) {
    e.preventDefault();

    console.log("Hello");
    const busId = id;
    const bo_id = $("#Bus-Operator").val();
    const start_point = $("#Start-Point").val();
    const end_point = $("#End-Point").val();
    const type = $("#Type").val();
    const start_time = $("#Start-Time").val();
    const end_time = $("#End-Time").val();
    const image_url = $("#Image-Bus").val();
    const policy = $("#Policy").val();
    const num_of_seats = $("#Number-Of-Seats").val();
    const price = $("#Price").val();

    const data = JSON.stringify({
      bo_id: bo_id,
      start_point: start_point,
      end_point: end_point,
      type: type,
      start_time: start_time,
      end_time: end_time,
      image_url: image_url,
      policy: policy,
      num_of_seats: num_of_seats,
      price: price,
    });

    $.ajax(`${HOST_NAME}/v1/admin/bus/update/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer " + token,
      },
      data: data,
      success: function (data) {
        console.log("data", data);
        window.location.href = "/pages/bus";
      },
      error: function (error) {
        console.log("error", error);
      },
    });
  });

  $("#Delete-Button").click(function (e) {
    e.preventDefault();
    $.ajax(`${HOST_NAME}/v1/admin/bus/delete/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer " + token,
      },
      success: function (data) {
        console.log("data", data);
        window.location.href = "/pages/bus";
      },
      error: function (error) {
        console.log("error", error);
      },
    });
  });
});
