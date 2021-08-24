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
  let fileName = "./php/Packing/SelOrderSheetList.php";
  let sendData = {
    m_ordersheet_id: $("#directive_input__select").val(),
  };
  // background color changing
  if ($(this).val() != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }

  myAjax.myAjax(fileName, sendData);
  $("#press-date__select").empty();
  ajaxReturnData.forEach(function (value) {
    $("<option>")
      .val(value["id"])
      .html(value["press_date_at"])
      .appendTo("#press-date__select");
  });
  if ($("#press-date__select option").length >= 1) {
    $("#press-date__select").removeClass("no-input").addClass("complete-input");
  } else {
    $("#press-date__select").removeClass("complete-input").addClass("no-input");
  }
});

$(document).on("change", "#press-date__select", function () {
  let fileName = "./php/Packing/SelUgingAgingRack.php";
  let sendData = {
    t_press_id: $(this).val(),
  };
  myAjax.myAjax(fileName, sendData);
  console.log(ajaxReturnData);
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo("#remain-rack__table tbody:nth-child(2)");
  });
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Table ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "table tr", function (e) {
  let id_name;
  id_name = $(this).parent().parent().attr("id");
  id_name = id_name + "_selected__tr";
  console.log(id_name);
  if (!$(this).hasClass("selected-record")) {
    // tr に class を付与し、選択状態の background colorを付ける
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    // tr に id を付与する
    $("#" + id_name).removeAttr("id");
    $(this).attr("id", id_name);
  } else {
    // 選択レコードを再度クリックした時
    // 削除問い合わせダイアログ
    // deleteDialog.showModal();
  }
});

// ++++++++++++++++++++++   TEST  BUTTON ++++++++++++++++++++++++++
// ++++++++++++++++++++++   TEST  BUTTON ++++++++++++++++++++++++++
// ++++++++++++++++++++++   TEST  BUTTON ++++++++++++++++++++++++++
$(document).on("click", "#test__button", function () {
  let fileName = "./php/Packing/SelOrderSheetList.php";
  let sendData = {
    m_ordersheet_id: $("#directive_input__select").val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#press-date__select").empty();
  ajaxReturnData.forEach(function (value) {
    $("<option>")
      .val(value["id"])
      .html(value["press_date_at"])
      .appendTo("#press-date__select");
  });
  if ($("#press-date__select option").length >= 1) {
    $("#press-date__select").removeClass("no-input").addClass("complete-input");
  } else {
    $("#press-date__select").removeClass("complete-input").addClass("no-input");
  }
});
