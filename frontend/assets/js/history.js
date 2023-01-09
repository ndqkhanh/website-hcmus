var page = 0;
var limit = 5;
var typeOfBus = ['Limousine', 'Normal Seat', 'Sleeper Bus'];
var statusBook = ['Just booked', 'Booked', 'Canceled payment'];
var userInfo = JSON.parse(localStorage.getItem('userInfo'));
var token = userInfo?.token?.token;
var uid = userInfo?.user?.id;

var currentHistoryData = [];
function loadMore() {
  $.ajax({
    url: `${BACKEND_URL}/user/history/${page}/${limit}`,
    type: 'POST',

    data: JSON.stringify({
      uid,
    }),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    success: function (data) {
      if (data.history_list[0]) {
        currentHistoryData = currentHistoryData.concat(data.history_list);
        content = `<thead><tr>
    <th scope='col'>#</th>
      <th scope='col'>id</th>
      <th scope='col'>House</th>
      <th scope='col'>Start point</th>
      <th scope='col'>End point</th>
      <th scope='col'>Start time</th>
      <th scope='col'>End time</th>
      <th scope='col'>Details</th>
    </tr></thead>
    <tbody>
    `;
        currentHistoryData.forEach((item, index) => {
          content += `<tr>
        <td scope='row' width ='2%'>${index + 1}</th>
        <td>${item.id}</td>
        <td>${item.buses.bus_operators.name}</td>
        <td>${item.buses.bus_stations_bus_stationsTobuses_start_point.name}</td>
        <td>${item.buses.bus_stations_bus_stationsTobuses_end_point.name}</td>
        <td>${item.buses.start_time}</td>
        <td>${item.buses.end_time}</td>
        <td><span class="text-primary"  onclick="viewDetail(${index})" role="button">View</span></td>
      </tr>`;
        });
        content += '</tbody>';
        $('#history-list').children().remove();
        $('#history-list').append(content);
      } else {
        alert('You reach the final history');
      }
    },
    error: function (result) {
      console.log('Error', JSON.stringify(result));
    },
  });
  page++;
}
function viewDetail(id) {
  detailTicket = currentHistoryData[id];
  $('#hList').addClass('d-none');
  $('#detail').removeClass('d-none');
  currentDate = new Date();
  if (Date.parse(currentDate) < Date.parse(detailTicket.buses.start_time) && detailTicket.status != 2) {
    if ($('#discard').hasClass('d-none') == true) $('#discard').removeClass('d-none');
    $('#discard').attr('tid', detailTicket.id);
  } else {
    if ($('#discard').hasClass('d-none') == false) $('#discard').addClass('d-none');
  }

  content = `<table class='table table-hover table-striped' id="detail-ticket">
  <tbody>
    <tr style='min-height: 50px'>
      <th class='quarter-width align-middle'>Ticker id</th>
      <td class='quarter-width align-middle'>
        ${detailTicket.seat}
      </td>
      <th class='quarter-width align-middle'>Bus operator</th>
      <td class='quarter-width align-middle'>${detailTicket.buses.bus_operators.name}</td>
    </tr>
    <tr style='min-height: 50px'>
      <th class='quarter-width align-middle'>Start point</th>
      <td class='quarter-width align-middle'>${detailTicket.buses.bus_stations_bus_stationsTobuses_start_point.name}</td>
      <th class='quarter-width align-middle'>End point</th>
      <td class='quarter-width align-middle'>${detailTicket.buses.bus_stations_bus_stationsTobuses_end_point.name}</td>
    </tr>
    <tr style='min-height: 50px'>
      <th class='quarter-width align-middle'>Start time</th>
      <td class='quarter-width align-middle'>
        ${detailTicket.buses.start_time}
      </td>
      <th class='quarter-width align-middle'>End time</th>
      <td class='quarter-width align-middle'>
        ${detailTicket.buses.end_time}
      </td>
    </tr>
    <tr style='min-height: 50px'>
      <th class='quarter-width align-middle'>Duration</th>
      <td class='quarter-width align-middle'>${
        (Date.parse(detailTicket.buses.end_time) - Date.parse(detailTicket.buses.start_time)) / (1000 * 60 * 60)
      } hours</td>
      <th class='quarter-width align-middle'>Policy</th>
      <td class='quarter-width align-middle'>
        ${detailTicket.buses.policy}
      </td>
    </tr>
    <tr style='min-height: 50px'>
      <th class='quarter-width align-middle'>Ticket cost</th>
      <td class='quarter-width align-middle'>${detailTicket.buses.price} vnđ</td>
      <th class='quarter-width align-middle'>Type of bus</th>
      <td class='quarter-width align-middle'>${typeOfBus[detailTicket.buses.type]}</td>
    </tr>
    <tr style='min-height: 50px'>
      <th class='quarter-width align-middle'>Status</th>
      <td class='quarter-width align-middle' id='status_num'> 
      ${statusBook[detailTicket.status]}
      </td>
      <th class='quarter-width align-middle'>Seat positions</th>
      <td class='quarter-width align-middle'>
        ${detailTicket.seat}
      </td>
    </tr>
  </tbody>
</table>`;
  previousView = $('#detail').children('#detail-ticket')[0];
  if (previousView) previousView.remove();
  $('#detail').prepend(content);
}
function backToList() {
  $('#hList').removeClass('d-none');
  $('#detail').addClass('d-none');
}
$(document).ready(async function () {
  const breadcrumbTemplate = `
    <li class='breadcrumb-item pb-0'><a href='/'>Home</a></li>
    <li class='breadcrumb-item active' aria-current='page'>History</li>
    `;

  $('#breadcrumb-container').html(breadcrumbTemplate);
  var checkT = await checkToken();
  if (checkT == true) {
    loadMore();
    $('#discard').click(() => {
      tid = $('#discard').attr('tid');
      $.ajax({
        url: `${BACKEND_URL}/ticket/discard-ticket`,
        type: 'POST',

        data: JSON.stringify({
          tid,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        success: function (data) {
          console.log(data);
          alert('Discard success');
          $('#discard').addClass('d-none');
          $('#status_num').text(statusBook[2]);
          currentHistoryData.forEach((item) => {
            if (item.id == tid) item.status = 2;
          });
        },
        error: function (result) {
          console.log('Error' + JSON.stringify(result));
        },
      });
    });
  } else window.location.href = '/';
});
async function checkToken() {
  if (!token) return false;
  var result = await fetch(`${BACKEND_URL}/user/history/0/0`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  result = await result.json();
  if (!result?.history_list) return false;
  return true;
}
