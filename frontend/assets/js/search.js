$(document).ready(async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const startPoint = urlParams.get('startPoint');
  const endPoint = urlParams.get('endPoint');
  const startTime = urlParams.get('startTime');

  // let bus_station = await fetch(`${BACKEND_URL}/bus-station/list`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json;charset=utf-8",
  //   },
  // });

  $.ajax(`${BACKEND_URL}/bus-station/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    success: function (bus_station) {
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

      $('#departure').replaceWith(departureContent);
      $('#destination').replaceWith(destinationContent);

      bus_station.data.forEach((item) => {
        if (startPoint === item.id) $('#departure').val(item.id);
        if (endPoint === item.id) $('#destination').val(item.id);
        if (startTime) $('#datepicker').val(startTime);
      });
    },
  });

  $('#btnSearch').click(async function () {
    let deparature = $('#departure').find(':selected').val();
    let destination = $('#destination').find(':selected').val();
    let date = $('#datepicker').datepicker('getDate');

    date = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();

    let url = `/list?startPoint=${deparature}&endPoint=${destination}&startTime=${date}`;

    $.ajax(`${BACKEND_URL}/bus/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      data: JSON.stringify({
        startPoint: deparature,
        endPoint: destination,
        page: 0,
        limit: 100,
        startTime: date,
      }),
      success: function (data) {
        console.log('data ', data);
      },
    });
    $(location).attr('href', url);
  });
});
