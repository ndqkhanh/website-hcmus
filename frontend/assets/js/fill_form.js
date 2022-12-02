$(document).ready(function () {
  $("#cancel-btn").click(function () {
    $(location).attr("href", "/list");
  });

  $("#submit-btn").click(function () {
    $("#form").submit(function (e) {
      e.preventDefault();
      const template = `<div id="table">
    <table class='table table-hover table-striped'>
      <tbody>
        <tr style='height: 80px'>
          <th class='quarter-width align-middle ps-4'>Full name</th>
          <td class='quarter-width align-middle'>Nguyễn Đinh Quang Khánh</td>
          <th class='quarter-width align-middle ps-4'>Seat positions</th>
          <td class='quarter-width align-middle'>
            1, 2, 3, 4, 5
          </td>
        </tr>
        <tr style='height: 80px'>
          <th class='quarter-width align-middle ps-4'>Ticker id</th>
          <td class='quarter-width align-middle'>
            <ul class='disc-list-style-type px-3'>
              <li>f05deee2-432a-4f61-8a5a-ec70eb4c725f</li>
              <li>f5900233-37bb-4c79-b146-eab74c41608e</li>
              <li>9b8149ea-2855-4d6d-bdf5-12feef8f6385</li>
              <li>90ce6ebe-f4bd-43bb-ac2f-a27c496f1f71</li>
              <li>12369511-9491-4a58-a5b7-d3b09cd16eb4</li>
            </ul>
          </td>
          <th class='quarter-width align-middle ps-4'>Bus operator</th>
          <td class='quarter-width align-middle'>Phương Trang</td>
        </tr>
        <tr style='height: 80px'>
          <th class='quarter-width align-middle ps-4'>Start point</th>
          <td class='quarter-width align-middle'>Miền Nam bus stop</td>
          <th class='quarter-width align-middle ps-4'>End point</th>
          <td class='quarter-width align-middle'>Miền Hoa bus stop</td>
        </tr>
        <tr style='height: 80px'>
          <th class='quarter-width align-middle ps-4'>Start time</th>
          <td class='quarter-width align-middle'>
            February 11th, 2022 15:00
          </td>
          <th class='quarter-width align-middle ps-4'>End time</th>
          <td class='quarter-width align-middle'>
            February 11th, 2022 20:00
          </td>
        </tr>
        <tr style='height: 80px'>
          <th class='quarter-width align-middle ps-4'>Duration</th>
          <td class='quarter-width align-middle'>5 hours</td>
          <th class='quarter-width align-middle ps-4'>Policy</th>
          <td class='quarter-width align-middle'>
            <ul class='none-list-style-type ps-0'>
              <li>
                <b>WHILE ON BOARD</b>
                <ul class='disc-list-style-type'>
                  <li>Holding your ticket</li>
                  <li>Be silent</li>
                </ul>
              </li>
              <li>
                <b>YOUR PACKAGE</b>
                <ul class='disc-list-style-type'>
                  <li>Not over 10kg</li>
                </ul>
              </li>
            </ul>
          </td>
        </tr>
        <tr style='height: 80px'>
          <th class='quarter-width align-middle ps-4'>Number of seats</th>
          <td class='quarter-width align-middle'>5</td>
          <th class='quarter-width align-middle ps-4'>Type of bus</th>
          <td class='quarter-width align-middle'>Vilahouse</td>
        </tr>
        <tr style='height: 80px'>
          <th class='quarter-width align-middle ps-4'>Ticket cost</th>
          <td class='quarter-width align-middle'>50k vnđ</td>
          <th class='quarter-width align-middle ps-4'>Total cost</th>
          <td class='quarter-width align-middle'>250k vnđ</td>
        </tr>
        <tr style='height: 80px'>
          <th class='quarter-width align-middle ps-4'>Status</th>
          <td class='quarter-width align-middle'>Booked</td>
          <th class='quarter-width align-middle ps-4'>&nbsp;</th>
          <td class='quarter-width align-middle'>
            &nbsp;
          </td>
        </tr>
      </tbody>
    </table>
    <div class='mt-5 d-flex justify-content-center align-items-center'>
      <button type='button' class='btn btn-primary py-3 px-4 home-btn' style='margin-right: 300px;width: 110px'>
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
    });
  });
});
