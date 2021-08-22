let ajaxReturnData;
let originalValue;
// let deleteDialog = document.getElementById("delete_ng__dialog");
// let deleteRackDialog = document.getElementById("delete_rack__dialog");
let press_id;

const myAjax = {
  myAjax: function (fileName, sendData) {
    $.ajax({
      type: "POST",
      url: fileName,
      dataType: "json",
      data: sendData,
      async: false,
    })
      .done(function (data) {
        ajaxReturnData = data;
      })
      .fail(function () {
        alert("DB connect error");
      });
  },
};

$(function () {
  // $("#add__button").prop("disabled", true);
  // $("#test__button").remove();
});

// *****************************************************
// *****************************************************
// ************** input value check
// *****************************************************
// *****************************************************
// press directvie
$(document).on("click", "#directive__input", function () {
  window.open(
    "./DailiReport_OrderSheet.html",
    null,
    "width=830, height=500,toolbar=yes,menubar=yes,scrollbars=no"
  );
});
// press directive select
$(document).on("change", "#directive_input__select", function () {
  if ($(this).val() != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

// ++++++++++++++++++++++   TEST  BUTTON ++++++++++++++++++++++++++
// ++++++++++++++++++++++   TEST  BUTTON ++++++++++++++++++++++++++
// ++++++++++++++++++++++   TEST  BUTTON ++++++++++++++++++++++++++
$(document).on("click", "#test__button", function () {
  let fileName = "./php/Packing/SelOrderSheetData.php";
  let sendData = {
    stop_code: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  console.log(ajaxReturnData);
});
