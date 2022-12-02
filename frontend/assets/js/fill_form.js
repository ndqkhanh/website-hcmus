$(document).ready(function () {
  const windowSplit = window.location.href.split("/");
  const busId = windowSplit[windowSplit.length - 1].split("[?#]")[0];
  const email = "khanhndq2002@gmail.com";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMTE4ZjY5My04NzIyLTQ0NjEtYTc5ZC1kNzY5OTFiOTZiY2QiLCJpYXQiOjE2Njk5NDkzMjUsImV4cCI6MTY2OTk1MTEyNSwidHlwZSI6ImFjY2VzcyJ9.UXO55nuCXkQIOazX3l8LwPyABzqknZFXdwkrfscHsiw";

  $.ajax({
    url: `${BACKEND_URL}/bus/${busId}`,
    type: "GET",
    success: function (response) {
      if (typeof response === undefined || response === null) {
        alert("[ERROR]: Cannot get response from server");
      } else if (response.error) {
        alert("[ERROR]: " + response.error);
      } else {
        $("#disabledEmail").val(email);
        $("#disabledStartTime").val(
          new Date(response.start_time).toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })
        );
        $("#disabledEndTime").val(
          new Date(response.end_time).toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })
        );
        $("#destination").val(
          response.bus_stations_bus_stationsTobuses_end_point.location
        );
      }
    },
    error: function (error) {
      console.log("[ERROR]", error);
    },
  });

  $("#cancel-btn").click(function () {
    $(location).attr("href", "/list");
  });

  // $("#submit-btn").click(function () {
  $("#form").submit(function (e) {
    e.preventDefault();
    const name = $("#inputFullName").val();
    const phone = $("#inputPhone").val();
    const numOfSeats = Number($("#inputNumberOfSeat").val());
    $.ajax({
      url: `${BACKEND_URL}/ticket/create/${busId}`,
      type: "POST",
      dataType: "json",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify({
        name,
        phone,
        numOfSeats,
      }),
      success: function (response) {
        if (typeof response === undefined || response === null) {
          alert("[ERROR]: Cannot get response from server");
        } else if (response.error) {
          alert(
            "The number of seats you booked exceed the maximum number of seats\nPlease try again!!!"
          );
        } else {
          console.log(JSON.stringify(response));
          $("#title div h3").text("Booking details");
          const msToTime = (ms) => {
            let seconds = (ms / 1000).toFixed(1);
            let minutes = (ms / (1000 * 60)).toFixed(1);
            let hours = (ms / (1000 * 60 * 60)).toFixed(1);
            let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
            if (seconds < 60) return seconds + " Seconds";
            else if (minutes < 60) return minutes + " Minutes";
            else if (hours < 24) return hours + " Hours";
            else return days + " Days";
          };
          const ticketIds = response.ticket_ids.map((tid) => `<li>${tid}</li>`);
          const template = `<div id="table">
    <table class='table table-hover table-striped'>
      <tbody>
        <tr style='height: 80px'>
          <th class='quarter-width align-middle ps-4'>Full name</th>
          <td class='quarter-width align-middle'>${response.name}</td>
          <th class='quarter-width align-middle ps-4'>Seat positions</th>
          <td class='quarter-width align-middle'>
            ${response.seat_positions.join(", ")}
          </td>
        </tr>
        <tr style='height: 80px'>
          <th class='quarter-width align-middle ps-4'>Ticker id</th>
          <td class='quarter-width align-middle'>
            <ul class='disc-list-style-type px-3'>
              ${ticketIds.join("")}
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
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </td>
          <th class='quarter-width align-middle ps-4'>End time</th>
          <td class='quarter-width align-middle'>
            ${new Date(response.end_time).toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </td>
        </tr>
        <tr style='height: 80px'>
          <th class='quarter-width align-middle ps-4'>Duration</th>
          <td class='quarter-width align-middle'>${msToTime(
            response.duration
          )}</td>
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
            response.type === 0
              ? "Limousine"
              : response.type === 1
              ? "Normal Seat"
              : "Sleeper Bus"
          }</td>
        </tr>
        <tr style='height: 80px'>
          <th class='quarter-width align-middle ps-4'>Ticket cost</th>
          <td class='quarter-width align-middle'>${
            response.ticket_cost
          } VND</td>
          <th class='quarter-width align-middle ps-4'>Total cost</th>
          <td class='quarter-width align-middle'>${response.total_cost} VND</td>
        </tr>
        <tr style='height: 80px'>
          <th class='quarter-width align-middle ps-4'>Status</th>
          <td class='quarter-width align-middle'>${
            response.status === 0
              ? "Booked"
              : response.status === 1
              ? "Paid"
              : "Canceled"
          }</td>
          <th class='quarter-width align-middle ps-4'>&nbsp;</th>
          <td class='quarter-width align-middle'>
            &nbsp;
          </td>
        </tr>
      </tbody>
    </table>
    <div class='mt-5 d-flex justify-content-center align-items-center'>
      <button type='button' class='home-btn btn btn-primary py-3 px-4' style='margin-right: 300px;width: 110px'>
        Home
      </button>
      <button type='button' class='btn btn-primary py-3 px-4' style='width: 110px' data-bs-toggle='modal'
        data-bs-target='#exampleModal'>
        Pay
      </button>
    </div>
  </div>`;
          $("#form-container").html(template);
          $(".home-btn").click(function () {
            $(location).attr("href", `/`);
          });
        }
      },
      error: function (error) {
        console.log("[ERROR]", error);
      },
    });
  });
});
// });
