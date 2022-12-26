$(document).ready(function () {
  let page = 0;
  const loadListBookings = async (limit = 10) => {
    let userInfo = localStorage.getItem("userInfo");
    userInfo = JSON.parse(userInfo);
    let token = userInfo.token.token;

    const statusText = {
      0: "Booked",
      1: "Paid",
      2: "Canceled",
    };

    $.ajax({
      url: `${HOST_NAME}/v1/admin/booking/list/${page}/${limit}`,
      type: "GET",
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token,
      },
      success: function (data) {
        var bookings = data.data;
        if (bookings.length === 0) {
          $("#next").attr("disabled", true);
          $("#booking-list").html(
            `<tr><td colspan="6" class="text-center">No data</td></tr>`
          );
          return;
        } else {
          $("#next").attr("disabled", false);
        }

        var html = "";
        $.each(bookings, function (index, booking) {
          html += "<tr>";
          // html += '<td>' + booking.id + '</td>';

          html += `<td class="align-middle">
        <div class="d-flex align-items-center">
          <div>
            <div
              class="icon-shape icon-md border p-4 rounded-1"
            >
              <img
                src="${booking.buses.image_url}"
                style="width: 50px; height: 50px"
                alt=""
              />
            </div>
          </div>
          <div class="ms-3 lh-1">
            <h5 class="mb-1">
              <a href="#" class="text-inherit"
                >${booking.buses.bus_operators.name}</a
              >
            </h5>
          </div>
        </div>
      </td>`;
          html += '<td class="align-middle">' + booking.name + "</td>";

          html += '<td class="align-middle">' + booking.phone + "</td>";
          html += '<td class="align-middle">' + booking.seat + "</td>";
          html += `
        <td class="align-middle">
                          <span class="badge bg-warning">${
                            statusText[booking.status]
                          }</span>
                        </td>
        `;

          html += `<td class="align-middle"><a href="/pages/booking/update.html?id=${booking.id}" class="btn btn-primary">Edit</a></td>`;
          html += "</tr>";
        });
        $("#booking-list").html(html);
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
