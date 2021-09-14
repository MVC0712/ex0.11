let ajaxReturnData;

const myAjax = {
    myAjax: function(fileName, sendData) {
        $.ajax({
                type: "POST",
                url: fileName,
                dataType: "json",
                data: sendData,
                async: false,
            })
            .done(function(data) {
                ajaxReturnData = data;
            })
            .fail(function() {
                alert("DB connect error");
            });
    },
};

$(function() {
  var fileName = "./php/PackingSummary/SelSummary.php";
  var sendData = {
      die_number: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  console.log(ajaxReturnData);

  ajaxReturnData.forEach(function(trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function(tdVal) {
        $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo("#summary__table tbody");
  });
});

$(document).on("click", "#summary__table tbody tr", function(e) {
  $(this).parent().find("tr").removeClass("selected-record");
  $(this).addClass("selected-record");

  let temp;
  temp = $(".selected-record");
  console.log(temp);
  temp = $(".selected-record td:nth-child(1)");
  console.log(temp);
  temp = $(".selected-record td:nth-child(1)").text();
  console.log(temp);
  // temp = $(".selected-record td:nth-child(1)").innerText;
  // console.log(temp);
  // temp = $(".selected-record td:nth-child(1)").val();
  // console.log(temp);
  // temp = $(".selected-record td:nth-child(1)").html();
  // console.log(temp);
});
