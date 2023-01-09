$(document).ready(function () {
  const MAX_LIMIT = 100;
  const OFFSET = 0;

  let userInfo = localStorage.getItem("userInfo");
  userInfo = JSON.parse(userInfo);
  let token = userInfo.token.token;

  let typeOfBusList = [
    { value: 0, type: "Limousine" },
    { value: 1, type: "Normal Seat" },
    { value: 2, type: "Sleeper Bus" },
  ];

  // $.ajax(`http://localhost:3000/v1/admin/bus/${id}`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json;charset=utf-8",
  //     Authorization: "Bearer " + token,
  //   },
  //   success: function (bus) {
  //     $("#Bus-Operator").html(
  //       `<option value = ${bus.bo_id}>${bus.bus_operators.name}</option>`
  //     );
  //     $("#Start-Point").html(
  //       `<option value = ${bus.start_point}>${bus.bus_stations_bus_stationsTobuses_start_point.name}</option>`
  //     );
  //     $("#End-Point").html(
  //       `<option value = ${bus.end_point}>${bus.bus_stations_bus_stationsTobuses_end_point.name}</option>`
  //     );
  //     let busType = "";
  //     typeOfBusList.forEach((item) => {
  //       if (item.value == bus.type) busType = item.type;
  //     });

  //     $("#Type").html(`<option value = ${bus.type}>${busType} </option>`);
  //     $("#Start-Time").val(bus.start_time);
  //     $("#End-Time").val(bus.end_time);
  //     $("#Policy").val(bus.policy);
  //     $("#Number-Of-Seats").val(bus.num_of_seats);
  //     $("#Price").val(bus.price);
  //   },
  //   error: function (error) {
  //     console.log(error);
  //   },
  // });

  /**
   * Show list bus operator from db
   */

  $.ajax(`${HOST_NAME}/v1/bus-operator/list/${OFFSET}/${MAX_LIMIT}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: "Bearer " + token,
    },
    success: function (data) {
      let boList = data.data;
      let boListString = `<select class="form-select" id="Bus-Operator">
      <option>Select Bus Operator</option>`;
      boList.forEach((item) => {
        if (userInfo.user.role === 1 && item.id != userInfo.user.boid) return;
        boListString += `<option value='${item.id}'>${item.name}</option>`;
      });
      boListString += "</select>";
      $("#Bus-Operator").html(boListString);
    },
    error: function (error) {
      console.log(error);
    },
  });
  $("#Bus-Operator").click(function () {
    console.log($("#Bus-Operator").val());
  });

  /**
   * Show list of Start Point from db
   */
  $.ajax(`${HOST_NAME}/v1/bus-station/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: "Bearer " + token,
    },
    success: function (data) {
      let startPointList = data.data;
      console.log("station ", startPointList);
      let startPointListHtml = `<select class="form-select" id="Start-Point"><option selected>Select Start Point</option>`;
      startPointList.forEach((startPoint) => {
        startPointListHtml += `<option value='${startPoint.id}'>${startPoint.name}, ${startPoint.location}</option>`;
      });
      startPointListHtml += "</select>";

      $("#Start-Point").html(startPointListHtml);
    },
  });
  $("#Start-Point").click(function () {
    console.log("Start-Point: ", $("#Start-Point").val());
  });

  /**
   * Show End Point List from DB
   */
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
        endPointListHtml += `<option value='${endPoint.id}'>${endPoint.name}, ${endPoint.location}</option>`;
      });
      endPointListHtml += "</select>";
      $("#End-Point").html(endPointListHtml);
    },
  });
  $("#End-Point").click(function () {
    console.log("End Point", $("#End-Point").val());
  });

  /**
   * Show list type of bus from DB
   */
  $("#Type").replaceWith(`<select class="form-select" id="Type">
   <option selected>Select Type</option>
   <option value="0">Limousine</option>
   <option value="1">Normal Seat</option>
   <option value="2">Sleeper Seat</option>
 </select>`);

  $("#Type").click(function () {
    console.log($("#Type").val());
  });

  /**
   * Update bus
   */

  $("#Create-Button").click(function (e) {
    e.preventDefault();

    console.log("Hello");
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

    $.ajax(`${HOST_NAME}/v1/admin/bus/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer " + token,
      },
      data: data,
      success: function (data) {
        window.location.href = `/pages/bus`;
      },
      error: function (error) {
        console.log("error", error);
      },
    });
  });
});
