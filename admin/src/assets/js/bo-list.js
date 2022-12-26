$(document).ready(function () {
  let page = 0;
  const loadListBO = async (limit = 10) => {
    let userInfo = localStorage.getItem("userInfo");
    userInfo = JSON.parse(userInfo);
    let token = userInfo?.token?.token;

    $.ajax({
      url: `${HOST_NAME}/v1/bus-operator/list/${page}/${limit}`,
      type: "GET",
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token,
      },
      success: function (data) {
        var bo = data.data;
        if (bo.length === 0) {
          $("#next").attr("disabled", true);
          $("#bo-list").html(
            `<tr><td colspan="6" class="text-center">No data</td></tr>`
          );
          return;
        } else {
          $("#next").attr("disabled", false);
        }

        var html = "";
        $.each(bo, function (index, bo_item) {
          html += "<tr>";
          // html += '<td>' + booking.id + '</td>';

          html += `<td class="align-middle">
          <div class="d-flex align-items-center">
            <div>
              <div
                class="icon-shape icon-md border p-4 rounded-1"
              >
                <img
                  src="${bo_item.image_url}"
                  style="width: 50px; height: 50px"
                  alt=""
                />
              </div>
            </div>
            <div class="ms-3 lh-1">
              <h5 class="mb-1">
                <a href="#" class="text-inherit"
                  >${bo_item.name}</a
                >
              </h5>
            </div>
          </div>
        </td>`;
          html += '<td class="align-middle">' + bo_item.phone + "</td>";

          html += `<td class="align-middle"><a href="/pages/bus-operator/update.html?id=${bo_item.id}" class="btn btn-primary">Edit</a></td>`;
          html += `<td class="align-middle"><a href="" class="btn btn-warning" id="removed" boid="${bo_item.id}" boname="${bo_item.name}">Remove</a></td>`;
          html += "</tr>";
        });
        $("#bo-list").html(html);
      },
      error: function (data) {
        console.log(data);
      },
    });
  };

  loadListBO();
  // handle pagination next and prev

  $("#next").click(function () {
    page++;
    loadListBO();

    if (page > 0) {
      $("#prev").attr("disabled", false);
    } else {
      $("#prev").attr("disabled", true);
    }
  });
  $("#prev").click(function () {
    page--;
    loadListBO();

    if (page === 0) {
      $("#prev").attr("disabled", true);
    } else {
      $("#prev").attr("disabled", false);
    }
  });
  //removed bo
  $("#bo-list").on("click", "#removed", function (e) {
    e.preventDefault();
    var boid = e.target.getAttribute("boid");
    var boname = e.target.getAttribute("boname");
    let text = "Remove " + boname;
    if(confirm(text) == true){
      let userInfo = localStorage.getItem("userInfo");
      userInfo = JSON.parse(userInfo);
      let token = userInfo?.token?.token;
      $.ajax({
        url: `${HOST_NAME}/v1/bus-operator/delete`,
        type: "POST",
        dataType: "json",
        headers: {
          Authorization: "Bearer " + token,
        },
        data:{
          id: boid
        },
        success: function (data) {
          loadListBO();
        },
        error: function (data) {
          console.log(data);
        },
      });
      
    }
  });
});
