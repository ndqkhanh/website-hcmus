$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  let userInfo = localStorage.getItem('userInfo');
  userInfo = JSON.parse(userInfo);
  let token = userInfo.token.token;

  $.ajax({
    url: `${HOST_NAME}/v1/bus-operator/${id}`,
    type: 'GET',
    dataType: 'json',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    success: function (booking) {
      $('#phone').val(booking.phone);
      $('#name').val(booking.name);
      $('#image-url').val(booking.image_url);
    },
    error: function (error) {
      console.log('error', error);
    },
  });

  $('#update-bo').submit(function (e) {
    e.preventDefault();
    const name = $('#name').val();
    const phone = $('#phone').val();
    const image_url = $('#image-url').val();

    $.ajax({
      url: `${HOST_NAME}/v1/bus-operator/update`,
      type: 'POST',
      dataType: 'json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: {
        id: id,
        name: name,
        phone: phone,
        image_url: image_url,
      },
      success: function (data) {
        console.log('data', data);
        window.location.href = `/pages/bus-operator`;
      },
      error: function (error) {
        console.log('error', error);
      },
    });
  });
});
