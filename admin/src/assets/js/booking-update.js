$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMTE4ZjY5My04NzIyLTQ0NjEtYTc5ZC1kNzY5OTFiOTZhOWUiLCJpYXQiOjE2Njk5NTc5NTMsImV4cCI6MTY3NTk1Nzg5MywidHlwZSI6ImFjY2VzcyJ9.-sfClJOg9Ef9r8vW3H4pVq-EyAQBgdTtZUlsowKn6rU';
  $.ajax({
    url: `http://localhost:3000/v1/admin/booking/${id}`,
    type: 'GET',
    dataType: 'json',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    success: function (booking) {
      $('#email').val(booking.users.email);
      $('#name').val(booking.name);
      $('#phone').val(booking.phone);
      $('#seat').val(booking.seat);
      $('#status').val(booking.status);
      // startpoint, endpint
      $('#start_point').val(
        booking.buses.bus_stations_bus_stationsTobuses_start_point.name
      );
      $('#end_point').val(
        booking.buses.bus_stations_bus_stationsTobuses_end_point.name
      );
    },
    error: function (error) {
      console.log('error', error);
    },
  });

  $('#update-booking').submit(function (e) {
    e.preventDefault();
    const name = $('#name').val();
    const phone = $('#phone').val();
    const seat = $('#seat').val();
    const status = $('#status').val();
    $.ajax({
      url: `http://localhost:3000/v1/admin/booking/${id}`,
      type: 'POST',
      dataType: 'json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: {
        name: name,
        phone: phone,
        seat: seat,
        status: status,
      },
      success: function (data) {
        console.log('data', data);
        window.location.href = '/pages/booking';
      },
      error: function (error) {
        console.log('error', error);
      },
    });
  });
});
