$(document).ready(function () {
  let page = 0;

  $("#filter-pricing").on("input", function () {
    const price = $("#filter-pricing").val();
    $("#current-pricing").text(numberWithThoundsand(price));
  });

  function numberWithThoundsand(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  function loadMore(reset = false) {
    const template = `<div class='mb-4 card bus-ticket'>
    <div class='card-body'>
      <div class='row'>
        <div class='col-md-3'>
          <img
            src="{{image_url}}"
            class='img-fluid rounded'
            alt='...'
          />
        </div>
        <div class='col-md-9'>
          <div class='row'>
            <div class='col-md-9'>
              <h5 class='card-title fw-bold text-black-40'>
                {{bus_operator_name}}
                <span class='ml-2 badge text-bg-warning'>{{bus_operator_rating}}*</span>
              </h5>
  
              <div class='row'>
                <div class='col-md-6'>
                  <h5 class='text-success'>{{start_point_time}}</h5>
                  <p class='text-black-50 mb-0'>{{start_point_date}}</p>
                  <p class='text-black-50 fw-bold'>{{start_point_name}}</p>
                </div>
                <div class='col-md-6'>
                  <h5 class='text-success'>{{end_point_time}}</h5>
                  <p class='text-black-50 mb-0'>{{end_point_date}}</p>
                  <p class='text-black-50 fw-bold'>{{end_point_name}}</p>
                </div>
              </div>
            </div>
            <div class='col-md-3 text-end'>
              <h4 class='fw-bold text-primary'>{{price}}đ</h4>
              <p class='mb-0'>
                <small class='text-muted'>{{left_seats}} seats available</small>
              </p>
            </div>
          </div>
  
          <div
            class='mt-3 d-flex align-items-center justify-content-between'
          >
            <div>
              <button
                type='button'
                class='btn btn-success'
                data-bs-toggle='modal'
                data-bs-target='#exampleModal'
              >
                Details
              </button>
            </div>
            <div>
              <span class='text-primary fw-bold'>{{duration}}</span><span
                class='text-black-50'
              > | </span><span class='text-primary fw-bold'>{{type}}</span>
            </div>
            <div>
              <button type='button' class='btn btn-primary book-bus' bid='{{id}}'>
                Book
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
    const templateScript = Handlebars.compile(template);
    let html = "";
    //  (0 - Limousine, 1 - Normal Seat, 2 - Sleeper Bus)
    const busTypeText = ["Limousine", "Normal Seat", "Sleeper Bus"];
    const busOperator = $("#filter-bus-operator").val();
    const busType = $('[name="typeOfSeat"]:checked').val();
    const price = $("#filter-pricing").val();

    if (page == 0) {
      $("#load-more").show();
    }

    $.post(
      "http://localhost:3000/v1/bus/search",
      {
        startPoint: "08b4b02a-7fad-49f3-baba-df61c8f8240c",
        endPoint: "08b4b02a-7fad-49f3-baba-df61c8f8240c",
        page,
        limit: 1,
        boId: busOperator === "" ? undefined : busOperator,
        type: parseInt(busType),
        price: parseInt(price),
      },
      function (data) {
        if (data.data.length === 0 && reset === false) {
          $("#load-more").hide();
          return;
        }
        for (const item of data.data) {
          let duration =
            (new Date(item.end_time) - new Date(item.start_time)) / 1000;
          html += templateScript({
            id: item.id,
            image_url: item.image_url,
            bus_operator_name: item.bus_operators.name,
            bus_operator_rating: item.averageReviews,
            start_point_time:
              new Date(item.start_time).getHours() +
              ":" +
              new Date(item.start_time).getSeconds(),
            start_point_date: new Date(item.start_time)
              .toISOString()
              .split("T")[0],
            start_point_name: item.start_point.name,
            end_point_time:
              new Date(item.end_time).getHours() +
              ":" +
              new Date(item.end_time).getSeconds(),
            end_point_date: new Date(item.end_time).toISOString().split("T")[0],
            end_point_name: item.start_point.name,
            left_seats: item.left_seats,
            price: numberWithThoundsand(item.price),
            duration: secondsToHms(duration),
            type: busTypeText[item.type],
          });
        }

        if (page === 0) {
          $("#list-of-buses-div").html(html);
        } else {
          $("#list-of-buses-div").append(html);
        }
      }
    );
  }

  loadMore();

  $("#list-of-buses-div").on("click", ".book-bus", function () {
    const bid = $(this).attr("bid");
    window.location.href = "/fill-form/" + bid;
  });

  $("#load-more").click(function () {
    page++;
    loadMore();
  });

  $("#filter").click(function () {
    page = 0;
    loadMore(true);
  });
  loadFilter();
  function loadFilter() {
    $.get("http://localhost:3000/v1/bus-operator/list/0/1000", function (data) {
      if (data.data.length > 0) {
        data.data.forEach((item) => {
          $("#filter-bus-operator").append(
            $("<option></option>").attr("value", item.id).text(item.name)
          );
        });
      }
    });
  }

  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : "h") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : "m") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : "s") : "";
    return hDisplay + mDisplay + sDisplay;
  }
});
