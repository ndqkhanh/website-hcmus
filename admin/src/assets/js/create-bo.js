$(document).ready(function () {
  let userInfo = localStorage.getItem('userInfo');
  userInfo = JSON.parse(userInfo);
  let token = userInfo.token.token;

  $('#create-bo').submit(function (e) {
    e.preventDefault();
    const name = $('#name').val();
    const phone = $('#phone').val();
    const image_url = $('#image-url').val();
    console.log(name, phone, image_url);
    $.ajax({
      url: `${HOST_NAME}/v1/bus-operator/create`,
      type: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      dataType: 'json',
      data: JSON.stringify({
        name,
        phone,
        image_url,
      }),
      success: function (data) {
        window.location.href = `${HOST_NAME}/pages/bus-operator`;
        console.log('data', data);
      },
      error: function (error) {
        console.log('error', error);
      },
    });
  });
});
