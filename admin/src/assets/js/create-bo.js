$(document).ready(function () {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMTE4ZjY5My04NzIyLTQ0NjEtYTc5ZC1kNzY5OTFiOTZhOWUiLCJpYXQiOjE2Njk5NjA1MDgsImV4cCI6MTY3NTk2MDQ0OCwidHlwZSI6ImFjY2VzcyJ9.zM6x2letxSr4LniOGR1yDXeNMMh0DkfMZlZWMLI6ujQ";

  $("#create-bo").submit(function (e) {
    e.preventDefault();
    console.log("2");
    const name = $("#name").val();
    const phone = $("#phone").val();
    const image_url = $("#image-url").val();
    $.ajax({
      url: `${HOST_NAME}/v1/bus-operator/create`,
      type: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        name,
        phone,
        image_url,
      },
      success: function (data) {
        console.log("data", data);
      },
      error: function (error) {
        console.log("error", error);
      },
    });
  });
});
