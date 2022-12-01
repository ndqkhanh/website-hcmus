$(document).ready(async function () {
  let bus_station = await fetch(`${BACKEND_URL}/bus-station/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  bus_station = await bus_station.json();
  let departureContent = `  <div class="col d-flex">
      <i class="fa-solid fa-location-dot flex-fill p-2 fa-2x me-2"></i>
      <select class="custom-select form-control flex-fill p-" id="departure">`;

  let destinationContent = `
      <div class="col d-flex">
      <i class="fa-solid fa-location-dot flex-fill p-2 fa-2x me-2"></i>
      <select class="custom-select form-control flex-fill p-" id="destination">`;

  bus_station.data.forEach((item) => {
    {
      departureContent += `<option value=${item.id}>${item.name},${item.location}</option>`;
      destinationContent += `<option value=${item.id}>${item.name},${item.location}</option>`;
    }
  });
  departureContent += `</select>
      </div>`;
  destinationContent += `</select>
      </div>`;

  $("#departure-destination").prepend(destinationContent + departureContent);

  $("#btnSearch").click(async function () {
    let deparature = $("#departure").find(":selected").val();
    let destination = $("#destination").find(":selected").val();
    let date = $("#datepicker").datepicker("getDate");

    date = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();

    let url = `http://localhost:4000/list?startPoint=${deparature}&endPoint=${destination}&startTime=${date}`;
    $(location).attr("href", url);

    let data = await fetch(`${BACKEND_URL}/bus/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        startPoint: deparature,
        endPoint: destination,
        page: 0,
        limit: 100,
        startTime: date,
      }),
    });

    data = await data.json();
  });
});
