function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : 'h') : '';
  var mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : 'm') : '';
  var sDisplay = s > 0 ? s + (s == 1 ? ' second' : 's') : '';
  return hDisplay + mDisplay + sDisplay;
}

var userInfo = JSON.parse(localStorage.getItem('userInfo'));
var token = userInfo?.token?.token;

$(document).ready(async function () {
  commentPage = 0;
  commentLimit = 2;
  userRating = 1;
  maxCommentNum = null;

  const isAuthenticated = async () => {
    let userInfo = await localStorage.getItem('userInfo');
    if (typeof userInfo !== 'undefined' && userInfo !== null) {
      userInfo = (await userInfo) ? JSON.parse(userInfo) : {};
      if (!userInfo?.token?.token) {
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
  const breadcrumbTemplate = await `
    <li class='breadcrumb-item pb-0'><a href='/'>Home</a></li>
    <li class='breadcrumb-item active' aria-current='page'>List</li>
    `;

  $('#breadcrumb-container').html(breadcrumbTemplate);
  /**
   * Get parameter from URL
   */
  function getUrlParameter(name) {
    let results = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
      return null;
    }
    return decodeURI(results[1]) || 0;
  }
  let page = 0;

  $('#filter-pricing').on('input', function () {
    const price = $('#filter-pricing').val();
    $('#current-pricing').text(numberWithThoundsand(price));
  });

  function numberWithThoundsand(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  async function loadMore(reset = false) {
    const checkAuthen = await isAuthenticated();
    console.log(checkAuthen);
    const template = await `<div class='mb-4 card bus-ticket'>
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
              <h5 class='fw-bold text-primary'>{{price}} đ</h5>
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
              <button type='button' class='btn btn-primary book-bus book-btn' bid='{{id}}' ${checkAuthen ? '' : 'disabled'} >
                Book
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
    const templateScript = Handlebars.compile(template);
    let html = '';
    //  (0 - Limousine, 1 - Normal Seat, 2 - Sleeper Bus)
    const busTypeText = ['Limousine', 'Normal Seat', 'Sleeper Bus'];
    const busOperator = $('#filter-bus-operator').val();
    const busType = $('[name="typeOfSeat"]:checked').val();
    const price = $('#filter-pricing').val();
    const deparature = getUrlParameter('startPoint');
    const destination = getUrlParameter('endPoint');
    const date = getUrlParameter('startTime');

    if (page == 0) {
      $('#load-more').show();
    }

    $.post(
      `${BACKEND_URL}/bus/search`,
      {
        startPoint: deparature,
        endPoint: destination,
        page,
        limit: 10,
        boId: busOperator === '' ? undefined : busOperator,
        type: parseInt(busType),
        price: parseInt(price),
        startTime: date,
      },
      function (data) {
        loadingContent = false;
        if (data.data.length === 0 && reset === false) {
          $('#load-more').hide();
          return;
        }
        for (const item of data.data) {
          let duration = (new Date(item.end_time) - new Date(item.start_time)) / 1000;
          html += templateScript({
            id: item.id,
            image_url: item.image_url,
            bus_operator_name: item.bus_operators.name,
            bus_operator_rating: Math.round(item.averageReviews * 100) / 100,
            start_point_time: new Date(item.start_time).getHours() + ':' + new Date(item.start_time).getSeconds(),
            start_point_date: new Date(item.start_time).toISOString().split('T')[0],
            start_point_name: item.start_point.name,
            end_point_time: new Date(item.end_time).getHours() + ':' + new Date(item.end_time).getSeconds(),
            end_point_date: new Date(item.end_time).toISOString().split('T')[0],
            end_point_name: item.end_point.name,
            left_seats: item.left_seats,
            price: numberWithThoundsand(item.price),
            duration: secondsToHms(duration),
            type: busTypeText[item.type],
          });
        }

        if (page === 0) {
          $('#list-of-buses-div').html(html);
        } else {
          $('#list-of-buses-div').append(html);
        }
      }
    );
  }

  await loadMore();

  // if (!(await isAuthenticated())) {
  //   console.log('1');
  //   // $('.book-btn').prop('disabled', true);
  //   $("#list-of-buses-div").find(".book-btn").prop('disabled', true);
  // }
  // else {
  //   console.log('2');
  //   // $('.book-btn').prop('disabled', false);
  //   $("#list-of-buses-div").find(".book-btn").prop('disabled', true);
  // }

  $('#list-of-buses-div').on('click', '.book-bus', function () {
    const bid = $(this).attr('bid');
    window.location.href = '/fill-form/' + bid;
  });

  // $('#load-more').click(function () {
  //   page++;
  //   loadMore();
  // });

  // $(window).scroll(function () {
  //   if ($(window).scrollTop() + $(window).height() > $(document).height()) {
  //     // alert("near bottom!");

  //   }
  // });
  let loadingContent = false;
  $(window).on('scroll', function () {
    if (
      $(window).scrollTop() >=
      $('#list-of-buses-div').offset().top + $('#list-of-buses-div').outerHeight() - window.innerHeight
    ) {
      if (loadingContent) return;
      loadingContent = true;
      page++;
      loadMore();
    }
  });

  $('#filter').click(function () {
    page = 0;
    loadMore(true);
  });
  loadFilter();
  function loadFilter() {
    $.get(`${BACKEND_URL}/bus-operator/list/0/1000`, function (data) {
      if (data.data.length > 0) {
        data.data.forEach((item) => {
          $('#filter-bus-operator').append($('<option></option>').attr('value', item.id).text(item.name));
        });
      }
    });
  }
});
function viewDetail(id, averRating) {
  maxCommentNum = null;
  commentPage = 0;
  function generateStart(num) {
    star = '';
    for (let i = 0; i < num; ++i) star += "<i class='text-warning bi bi-star-fill'></i>";
    for (let i = num; i < 5; ++i) star += "<i class='text-warning bi bi-star'></i>";
    return star;
  }
  function generateComment(bo_id) {
    commentHTMLTemplate = `<hr />
    <div class='clearfix'>
      <i class='float-start fs-1 bi bi-person-fill fa-5x me-1'></i>
      <div class='float-start'>
        <div class='fw-bolder'>{{email}}</div>
        <div>
          {{{star}}}
        </div>
        <p class='fw-light fst-italic'>{{comment}}</p>
      </div>
    </div>`;
    commentContent = '';
    commentScript = Handlebars.compile(commentHTMLTemplate);
    $.ajax({
      url: `${BACKEND_URL}/bus-operator/review/${bo_id}/${commentPage}/${commentLimit}`,
      type: 'GET',
      async: false,
      headers: {
        Authorization: `Bearer`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      success: function (data) {
        if (maxCommentNum == null || maxCommentNum < data.count) maxCommentNum = data.count;
        if (data.data.length > 0) {
          data.data.forEach((item) => {
            commentContent += commentScript({
              email: item.users.email,
              comment: item.comment,
              star: generateStart(item.rate),
            });
          });
        }
      },
      error: function (result) {
        alert('Error', JSON.stringify(result));
      },
    });
    return commentContent;
  }

  const typeName = ['Limousine', 'Normal Seat', 'Sleeper Bus'];
  template = `<div class='tab-pane fade show active' id='pills-bus-operator' role='tabpanel'
  aria-labelledby='pills-bus-operator-tab' tabindex='0'>
  <div class='p-4 col'>
    <div class='h3 text-center mw-50'>Nhà xe {{bo_name}}</div>

    <div class='d-flex justify-content-center'>
      <img 
        class= 'img-fluid'
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
    <div id ="user_comment">
    {{{user_comment}}}
    </div>

    <nav class='mt-5' aria-label='Page navigation example'>
      <ul class='pagination justify-content-center'>
        <li class='page-item'>
          <a class='page-link' href='#' id='Previous'>Previous</a>
        </li>
        <li class='page-item'>
          <a class='page-link' href='#' id='Next'>Next</a>
        </li>
      </ul>
    </nav>
    <hr />
    <form class='row g-3' id = "user_review">
      <div class='form-floating'>
        <textarea class='form-control' placeholder='Leave a comment here' id='floatingTextarea2'
          style='height: 150px; resize: none' required></textarea>
        <label class='text-muted' for='floatingTextarea2'>Your
          Comments.</label>
      </div>
      <div>
        <span class='float-start' id="rating">
          <i class='btn text-warning bi bi-star-fill' id = '1' onclick = "displayAndStoreUserRating(1)"></i>
          <i class='btn text-warning bi bi-star' id = '2' onclick = "displayAndStoreUserRating(2)"></i>
          <i class='btn text-warning bi bi-star' id = '3' onclick = "displayAndStoreUserRating(3)"></i>
          <i class='btn text-warning bi bi-star' id = '4' onclick = "displayAndStoreUserRating(4)"></i>
          <i class='btn text-warning bi bi-star' id = '5' onclick = "displayAndStoreUserRating(5)"></i>
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
    <div class='d-flex justify-content-center'>
      <img class='img-fluid' src='{{image_url}}'
        alt='Xe' />
    </div>
  </div>
</div>`;
  const templateScript = Handlebars.compile(template);
  html = '';
  $.get(`${BACKEND_URL}/bus/${id}`, {}, function (data) {
    let duration = (new Date(data.end_time) - new Date(data.start_time)) / 1000;
    if (data) {
      Policy = data.policy
        ?.replaceAll('&amp;', '&')
        .replaceAll('&gt;', '>')
        .replaceAll('&lt;', '<')
        .replaceAll('&quot;', '"')
        .replaceAll('&apos;', "'");
      html += templateScript({
        bo_name: data.bus_operators.name,
        phone_num: data.bus_operators.phone,
        rating: averRating,
        start_point: data.bus_stations_bus_stationsTobuses_start_point.name,
        end_point: data.bus_stations_bus_stationsTobuses_end_point.name,
        start_time: data.start_time,
        end_time: data.end_time,
        duration: secondsToHms(duration),
        policy: Policy,
        num_seat: data.num_of_seats,
        type: typeName[data.type],
        price: data.price,
        image_url: data.image_url,
        image_bo: data.bus_operators.image_url,
        user_comment: generateComment(data.bus_operators.id),
      });
      //generateComment();
      $('#pills-bus-operator-tab').addClass('active');
      $('#pills-bus-information-tab').removeClass('active');
      $('#pills-tabContent').children().remove();
      $('#pills-tabContent').append(html);
      $('#policy').children().addClass('ps-0');
      $('#policy').children().css('list-style-type', 'none');
      $('#Previous').click(() => {
        if (commentPage > 0) {
          commentPage--;
          $('#user_comment').children().remove();
          $('#user_comment').append(generateComment(data.bus_operators.id));
        }
      });
      $('#Next').click(() => {
        if (commentPage < Math.floor(maxCommentNum / commentLimit) - 1) {
          commentPage++;
          $('#user_comment').children().remove();
          $('#user_comment').append(generateComment(data.bus_operators.id));
        }
      });
      $('#user_review').on('submit', (e) => {
        e.preventDefault();
        $.ajax({
          url: `${BACKEND_URL}/bus-operator/review/create/${data.bus_operators.id}`,
          type: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          data: JSON.stringify({
            comment: $('#floatingTextarea2').val(),
            rate: userRating,
          }),
          success: function (data) {
            $('#floatingTextarea2').val('');
            alert('Success');
          },
          error: function (result) {
            alert('Error', JSON.stringify(result));
          },
        });
      });
    }
  });
}
function displayAndStoreUserRating(starID) {
  userRating = starID;
  for (let i = 1; i <= 5; ++i) {
    $(`#rating #${i}`).removeClass('bi-star-fill');
    $(`#rating #${i}`).removeClass('bi-star');
  }
  for (let i = 1; i <= starID; ++i) {
    $(`#rating #${i}`).addClass('bi bi-star-fill');
  }
  for (let i = starID + 1; i <= 5; ++i) {
    $(`#rating #${i}`).addClass('bi bi-star');
  }
}
