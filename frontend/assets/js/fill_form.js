const isAuthenticated = async () => {
  let userInfo = await localStorage.getItem('userInfo');
  if (typeof userInfo !== 'undefined' && userInfo !== null) {
    userInfo = (await userInfo) ? JSON.parse(userInfo) : {};
    if (!userInfo?.token?.token) {
      alert('You are not authorized to access this page');
      return false;
    } else {
      let response = await fetch(`${BACKEND_URL}/user/history/0/0`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token.token}`,
        },
      });
      response = await response.json();
      if (!response) return false;
      if (typeof response.history_list === 'undefined' || response.history_list === null) {
        return false;
      }
      return true;
    }
  } else return false;
};

$(document).ready(async function () {
  if (!(await isAuthenticated())) {
    $(location).attr('href', '/');
  } else {
    const windowSplit = await window.location.href.split('/');
    const busId = await windowSplit[windowSplit.length - 1].split('[?#]')[0];

    let userInfo = await JSON.parse(localStorage.getItem('userInfo'));
    const email = await userInfo.user.email;
    const token = await userInfo.token.token;

    const breadcrumbTemplate = `
    <li class='breadcrumb-item pb-0'><a href='/'>Home</a></li>
    <li class='breadcrumb-item pb-0'><a href='/list'>List</a></li>
    <li class='breadcrumb-item active' aria-current='page'>Fill form</li>
    `;

    $('#breadcrumb-container').html(breadcrumbTemplate);

    $.ajax({
      url: `${BACKEND_URL}/bus/${busId}`,
      type: 'GET',
      success: function (response) {
        if (typeof response === undefined || response === null) {
          alert('[ERROR]: Cannot get response from server');
        } else if (response.error) {
          alert('[ERROR]: ' + response.error);
        } else {
          $('#disabledEmail').val(email);
          $('#disabledStartTime').val(
            new Date(response.start_time).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })
          );
          $('#disabledEndTime').val(
            new Date(response.end_time).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })
          );
          $('#destination').val(response.bus_stations_bus_stationsTobuses_end_point.location);
        }
      },
      error: function (error) {
        console.log('[ERROR]', error);
      },
    });

    $('#cancel-btn').click(function () {
      $(location).attr('href', '/list');
    });

    // $("#submit-btn").click(function () {
    $('#form').submit(function (e) {
      e.preventDefault();
      const name = $('#inputFullName').val();
      const phone = $('#inputPhone').val();
      const numOfSeats = Number($('#inputNumberOfSeat').val());
      $.ajax({
        url: `${BACKEND_URL}/ticket/create/${busId}`,
        type: 'POST',
        dataType: 'json',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify({
          name,
          phone,
          numOfSeats,
        }),
        success: function (response) {
          if (typeof response === undefined || response === null) {
            alert('[ERROR]: Cannot get response from server');
          } else if (response.error) {
            alert('The number of seats you booked exceed the maximum number of seats\nPlease try again!!!');
          } else {
            console.log(JSON.stringify(response));
            $('#title div h3').text('Booking details');
            const msToTime = (ms) => {
              let seconds = (ms / 1000).toFixed(1);
              let minutes = (ms / (1000 * 60)).toFixed(1);
              let hours = (ms / (1000 * 60 * 60)).toFixed(1);
              let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
              if (seconds < 60) return seconds + ' Seconds';
              else if (minutes < 60) return minutes + ' Minutes';
              else if (hours < 24) return hours + ' Hours';
              else return days + ' Days';
            };
            const ticketIds = response.ticket_ids.map((tid) => `<li>${tid}</li>`);
            const template = `<div>
    <div id="table">
    <table class='table table-hover table-striped'>
      <tbody>
        <tr style='height: 80px'>
          <th class='quarter-width align-middle ps-4'>Full name</th>
          <td class='quarter-width align-middle'>${response.name}</td>
          <th class='quarter-width align-middle ps-4'>Email</th>
          <td class='quarter-width align-middle'>
            ${email}
          </td>
        </tr>
        <tr style='height: 80px'>
          <th class='quarter-width align-middle ps-4'>Ticket id</th>
          <td class='quarter-width align-middle'>
            <ul class='disc-list-style-type px-3'>
              ${ticketIds.join('')}
            </ul>
          </td>
          <th class='quarter-width align-middle ps-4'>Bus operator</th>
          <td class='quarter-width align-middle'>${response.bo_name}</td>
        </tr>
        <tr style='height: 80px'>
          <th class='quarter-width align-middle ps-4'>Start point</th>
          <td class='quarter-width align-middle'>${response.start_point}</td>
          <th class='quarter-width align-middle ps-4'>End point</th>
          <td class='quarter-width align-middle'>${response.end_point}</td>
        </tr>
        <tr style='height: 80px'>
          <th class='quarter-width align-middle ps-4'>Start time</th>
          <td class='quarter-width align-middle'>
            ${new Date(response.start_time).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </td>
          <th class='quarter-width align-middle ps-4'>End time</th>
          <td class='quarter-width align-middle'>
            ${new Date(response.end_time).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </td>
        </tr>
        <tr style='height: 80px'>
          <th class='quarter-width align-middle ps-4'>Duration</th>
          <td class='quarter-width align-middle'>${msToTime(response.duration)}</td>
          <th class='quarter-width align-middle ps-4'>Policy</th>
          <td class='quarter-width align-middle'>
            ${response.policy}
          </td>
        </tr>
        <tr style='height: 80px'>
          <th class='quarter-width align-middle ps-4'>Number of seats</th>
          <td class='quarter-width align-middle'>${response.num_of_seats}</td>
          <th class='quarter-width align-middle ps-4'>Type of bus</th>
          <td class='quarter-width align-middle'>${
            response.type === 0 ? 'Limousine' : response.type === 1 ? 'Normal Seat' : 'Sleeper Bus'
          }</td>
        </tr>
        <tr style='height: 80px'>
          <th class='quarter-width align-middle ps-4'>Ticket cost</th>
          <td class='quarter-width align-middle'>${response.ticket_cost} VND</td>
          <th class='quarter-width align-middle ps-4'>Total cost</th>
          <td class='quarter-width align-middle'>${response.total_cost} VND</td>
        </tr>
        <tr style='height: 80px'>
          <th class='quarter-width align-middle ps-4'>Seat positions</th>
          <td class='quarter-width align-middle'>
            ${response.seat_positions.join(', ')}
          </td>
          <th class='quarter-width align-middle ps-4'>Status</th>
          <td id="status-td" class='quarter-width align-middle'>${
            response.status === 0 ? 'Booked' : response.status === 1 ? 'Paid' : 'Canceled'
          }</td>
        </tr>
      </tbody>
    </table>
    </div>
    <div class='mt-5 d-flex justify-content-center align-items-center'>
      <button type='button' class='home-btn btn btn-primary py-3 px-4' style='margin-right: 300px;width: 110px'>
        Home
      </button>
      <button id="pay-btn" type='button' class='btn btn-primary py-3 px-4' style='width: 110px'>
        Pay
      </button>
    </div>
  </div>`;
            console.log(
              `response.ticket_ids`,
              JSON.stringify({
                ticket_ids: response.ticket_ids,
              })
            );
            $('#form-container').html(template);
            $('.home-btn').click(function () {
              $(location).attr('href', `/`);
            });
            $('#pay-btn').click(function () {
              $('#status-td').text('Paid');
              $.ajax({
                url: `${BACKEND_URL}/ticket/payment`,
                type: 'POST',
                dataType: 'json',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                data: JSON.stringify({
                  ticket_ids: response.ticket_ids,
                }),
                success: function (response) {
                  console.log('[SUCCESS]', response);
                  $('#exampleModal').modal('show');
                  $('#pdf-btn').click(function () {
                    const node = $('#table').html();
                    console.log(node);
                    printJS('table', 'html');
                  });
                },
                error: function (error) {
                  alert('[ERROR]', 'Payment failed');
                },
              });
            });
            $('#pay-btn').click(function () {
              $.ajax({
                url: `${BACKEND_URL}/ticket/payment`,
                type: 'POST',
                dataType: 'json',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                data: JSON.stringify({
                  ticket_ids: response.ticket_ids,
                }),
                success: function (response) {
                  console.log('[SUCCESS]', response);
                  $('#exampleModal').modal('show');
                  $('#pdf-btn').click(function () {
                    const node = $('#table').html();
                    console.log(node);
                    printJS('table', 'html');
                  });
                },
                error: function (error) {
                  alert('[ERROR]', 'Payment failed');
                },
              });
            });
          }
        },
        error: function (error) {
          console.log('[ERROR]', error);
        },
      });
    });
  }
});
// });
