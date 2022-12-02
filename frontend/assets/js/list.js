$(document).ready(function () {
  /**
   * Get parameter from URL
   */
  function getUrlParameter(name) {
    let results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
      window.location.href
    );
    if (results == null) {
      return null;
    }
    return decodeURI(results[1]) || 0;
  }
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
                onclick="viewDetail(\'{{id}}\', {{bus_operator_rating}})"
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
    const deparature = getUrlParameter("startPoint");
    const destination = getUrlParameter("endPoint");
    const date = getUrlParameter("startTime");

    if (page == 0) {
      $("#load-more").show();
    }

    $.post(
      `${BACKEND_URL}/bus/search`,
      {
        startPoint: deparature,
        endPoint: destination,
        page,
        limit: 1,
        boId: busOperator === "" ? undefined : busOperator,
        type: parseInt(busType),
        price: parseInt(price),
        startTime: date,
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
    $.get(`${BACKEND_URL}/bus-operator/list/0/1000`, function (data) {
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
  function viewDetail(id, averRating) {
    function generateComment() {
      commentHTMLTemplate = `<hr />
      <div class='clearfix'>
        <i class='float-start fs-1 bi bi-person-fill fa-5x me-1'></i>
        <div class='float-start'>
          <div class='fw-bolder'>{{name}}</div>
          <div>
            <i class='text-warning bi bi-star-fill'></i>
            <i class='text-warning bi bi-star-fill'></i>
            <i class='text-warning bi bi-star-fill'></i>
            <i class='text-warning bi bi-star-fill'></i>
            <i class='text-warning bi bi-star-fill'></i>
          </div>
          <p class='fw-light fst-italic'>Xe đi rất high !!!</p>
        </div>
      </div>`;
      comentContent = "";
      commentScript = Handlebars.compile(commentHTMLTemplate);
      $.ajax({
        url: `${BACKEND_URL}/bus-operator/review/${id}/${page}/${limit}`,
        type: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        success: function (data) {
          if (data.data.length > 0) {
            comentContent += commentScript({
              name: data.
            })
          }
        },
        error: function (result) {
          console.log("Error", JSON.stringify(result));
        },
      });
      page++;
    }
    const typeName = ["Limousine", "Normal Seat", "Sleeper Bus"];
    template = `<div class='tab-pane fade show active' id='pills-bus-operator' role='tabpanel'
    aria-labelledby='pills-bus-operator-tab' tabindex='0'>
    <div class='p-4 col'>
      <div class='h3 text-center mw-50'>Nhà xe {{bo_name}}</div>
  
      <div>
        <img class='img-fluid'
          src={{image_bo}}
          alt='Nhà xe' />
      </div>
      <div>
        <span class='fst-italic fw-lighter'> Phone number: </span>
        <span class='fw-bolder'> {{phone_num}} </span>
        <span class='float-end'>
          <span class='badge rounded-pill bg-warning text-dark'>
            <i class='bi bi-star-fill'></i>
            {{rating}}
          </span>
        </span>
      </div>
      
      <hr />
      <div class='clearfix'>
        <i class='float-start fs-1 bi bi-person-fill fa-5x me-1'></i>
        <div class='float-start'>
          <div class='fw-bolder'>Nguyễn Đinh Quang Khánh</div>
          <div>
            <i class='text-warning bi bi-star-fill'></i>
            <i class='text-warning bi bi-star-fill'></i>
            <i class='text-warning bi bi-star-fill'></i>
            <i class='text-warning bi bi-star-fill'></i>
            <i class='text-warning bi bi-star-fill'></i>
          </div>
          <p class='fw-light fst-italic'>Xe đi rất high !!!</p>
        </div>
      </div>
  
      <nav class='mt-5' aria-label='Page navigation example'>
        <ul class='pagination justify-content-center'>
          <li class='page-item'>
            <a class='page-link' href='#'>Previous</a>
          </li>
          <li class='page-item'>
            <a class='page-link' href='#'>1</a>
          </li>
          <li class='page-item'>
            <a class='page-link' href='#'>2</a>
          </li>
          <li class='page-item'>
            <a class='page-link' href='#'>3</a>
          </li>
          <li class='page-item'>
            <a class='page-link' href='#'>Next</a>
          </li>
        </ul>
      </nav>
      <hr />
      <form class='row g-3'>
        <div class='form-floating'>
          <textarea class='form-control' placeholder='Leave a comment here' id='floatingTextarea2'
            style='height: 150px; resize: none'></textarea>
          <label class='text-muted' for='floatingTextarea2'>Your
            Comments.</label>
        </div>
        <div>
          <span class='float-start'>
            <i class='text-warning bi bi-star'></i>
            <i class='text-warning bi bi-star'></i>
            <i class='text-warning bi bi-star'></i>
            <i class='text-warning bi bi-star'></i>
            <i class='text-warning bi bi-star'></i>
          </span>
          <span class='float-end'>
            <button type='submit' class='btn btn-primary mb-3'>
              Submit
            </button>
          </span>
        </div>
      </form>
    </div>
  </div>
  <div class='tab-pane fade' id='pills-bus-information' role='tabpanel'
    aria-labelledby='pills-bus-information-tab' tabindex='0'>
    <div class='p-4 col'>
      <table class='table table-borderless'>
        <tr>
          <td class='fst-italic' style='width: 60%'>
            Bus operator
          </td>
          <td class='text-primary'>{{bo_name}}</td>
        </tr>
        <tr>
          <td class='fst-italic'>Start point</td>
          <td class='text-primary'>{{start_point}}</td>
        </tr>
        <tr>
          <td class='fst-italic'>End point</td>
          <td class='text-primary'>{{end_point}}</td>
        </tr>
        <tr>
          <td class='fst-italic'>Start time</td>
          <td class='text-primary'>{{start_time}}</td>
        </tr>
        <tr>
          <td class='fst-italic'>End time</td>
          <td class='text-primary'>{{end_time}}</td>
        </tr>
        <tr>
          <td class='fst-italic'>Duration</td>
          <td class='text-primary'>{{duration}}</td>
        </tr>
        <tr>
          <td class='fst-italic'>Policy</td>
          <td class='text-primary' id="policy">
            {{{policy}}}
          </td>
        </tr>
        <tr>
          <td class='fst-italic'>Number of seats</td>
          <td class='text-primary'>{{num_seat}}</td>
        </tr>
        <tr>
          <td class='fst-italic'>Type of bus</td>
          <td class='text-primary'>{{type}}</td>
        </tr>
        <tr>
          <td class='fst-italic'>Cost</td>
          <td class='text-primary'>{{price}} vnđ</td>
        </tr>
      </table>
      <hr />
      <div>
        <img class='img-fluid' src='{{image_url}}'
          alt='Xe' />
      </div>
    </div>
  </div>`;
    const templateScript = Handlebars.compile(template);
    html = "";
    $.get(`${BACKEND_URL}/bus/${id}`, {}, function (data) {
      let duration =
        (new Date(data.end_time) - new Date(data.start_time)) / 1000;
      if (data) {
        html += templateScript({
          bo_name: data.bus_operators.name,
          phone_num: data.bus_operators.phone,
          rating: averRating,
          start_point: data.bus_stations_bus_stationsTobuses_start_point.name,
          end_point: data.bus_stations_bus_stationsTobuses_end_point.name,
          start_time: data.start_time,
          end_time: data.end_time,
          duration: secondsToHms(duration),
          policy: data.policy,
          num_seat: data.num_of_seats,
          type: typeName[data.type],
          price: data.price,
          image_url: data.image_url,
          image_bo: data.bus_operators.image_url,
        });
        $("#pills-bus-operator-tab").addClass("active");
        $("#pills-bus-information-tab").removeClass("active");
        $("#pills-tabContent").children().remove();
        $("#pills-tabContent").append(html);
        $("#policy").children().addClass("ps-0");
        $("#policy").children().css("list-style-type", "none");
      }
    });
  }
});
