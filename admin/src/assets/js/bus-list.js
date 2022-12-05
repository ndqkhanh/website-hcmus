$(document).ready(function () {
  let page = 0;
  const loadListBookings = (limit = 2) => {
    let token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyYjU1ZTdhMC02NmNkLTQ5ZjMtOTE2OS0xZjBkZjIzMzVmNjIiLCJpYXQiOjE2NzAyNTE1ODQsImV4cCI6MTY3MDI1MzM4NCwidHlwZSI6ImFjY2VzcyJ9.T_s1z9-cQpbxPKQvV-QbxaSSHMyUQQhqogyUbCURg9o";

    const typeOfBus = {
      0: "Limousine",
      1: "Normal Seat",
      2: "Sleeper Bus",
    };
    $.ajax({
      url: `http://localhost:3000/v1/admin/bus/list/${page}/${limit}`,
      type: "GET",
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token,
      },
      success: function (data) {
        var buses = data.data;
        console.log("buses", buses);
        if (buses.length === 0) {
          $("#next").attr("disabled", true);
          $("#booking-list").html(
            `<tr><td colspan="6" class="text-center">No data</td></tr>`
          );
          return;
        } else {
          $("#next").attr("disabled", false);
        }

        var html = "";
        $.each(buses, function (index, bus) {
          console.log(bus);
          html += "<tr>";
          // html += '<td>' + booking.id + '</td>';

          html += `<td class="align-middle">
          <div class="d-flex align-items-center">
            <div>
              <div
                class="icon-shape icon-md border p-4 rounded-1"
              >
                <img
                  src="${bus.bus_operators.image_url}"
                  style="width: 50px; height: 50px"
                  alt=""
                />
              </div>
            </div>
            <div class="ms-3 lh-1">
              <h5 class="mb-1">
                <a href="#" class="text-inherit"
                  >${bus.bus_operators.name}</a
                >
              </h5>
            </div>
          </div>
        </td>`;
          html +=
            '<td class="align-middle">' +
            bus.bus_stations_bus_stationsTobuses_start_point.name +
            "</td>";

          html +=
            '<td class="align-middle">' +
            bus.bus_stations_bus_stationsTobuses_end_point.name +
            "</td>";
          html += '<td class="align-middle">' + typeOfBus[bus.type] + "</td>";
          // html += `
          // <td class="align-middle">
          //                   <span class="badge bg-warning">${
          //                     statusText[booking.status]
          //                   }</span>
          //                 </td>
          // `;
          html += '<td class="align-middle">' + bus.start_time + "</td>";
          html += '<td class="align-middle">' + bus.end_time + "</td>";
          html += '<td class="align-middle">' + bus.policy + "</td>";
          html += '<td class="align-middle">' + bus.num_of_seats + "</td>";
          html += '<td class="align-middle">' + bus.price + "</td>";
          html += `<td class="align-middle"><a href="/pages/bus/update.html?id=${bus.id}" class="btn btn-primary">Edit</a></td>`;
          html += "</tr>";
        });
        $("#bus-list").html(html);
      },
      error: function (data) {
        console.log(data);
      },
    });
  };

  loadListBookings();
  // handle pagination next and prev
  $("#next").click(function () {
    page++;
    loadListBookings();

    if (page > 0) {
      $("#prev").attr("disabled", false);
    } else {
      $("#prev").attr("disabled", true);
    }
  });
  $("#prev").click(function () {
    page--;
    loadListBookings();

    if (page === 0) {
      $("#prev").attr("disabled", true);
    } else {
      $("#prev").attr("disabled", false);
    }
  });
});
