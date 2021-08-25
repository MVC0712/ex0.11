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
  let fileName;
  let sendData = new Object();
  // read ng list and fill option
  fileName = "./php/Packing/SelNgCode.php";
  sendData = {
    dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  $("#ng-code__select").empty();
  ajaxReturnData.forEach(function (value) {
    $("<option>")
      .val(value["id"])
      .html(value["description"])
      .appendTo("#ng-code__select");
  });
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
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo("#remain-rack__table tbody:nth-child(2)");
  });
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ======== Under LEFT AgingRack                      ======================
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "table tr", function (e) {
  let id_name;
  id_name = $(this).parent().parent().attr("id");
  id_name = id_name + "_selected__tr";
  if (!$(this).hasClass("selected-record")) {
    // tr に class を付与し、選択状態の background colorを付ける
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    // tr に id を付与する
    $("#" + id_name).removeAttr("id");
    $(this).attr("id", id_name);
    // Make Ng table
    makeNgTable();
  } else {
    // 選択レコードを再度クリックした時
    // 削除問い合わせダイアログ
    // deleteDialog.showModal();
  }
});

function makeNgTable() {
  let fileName = "./php/Packing/SelSelRackNgInformation.php";
  let sendData = {
    process_id: 4,
    using_aging_rack_id: $("#remain-rack__table_selected__tr td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#ng__table tbody:nth-child(2)").empty();
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo("#ng__table tbody:nth-child(2)");
  });
}
// ======================================================
// ======== Under Middle (NG CODE) ======================
// ======================================================
$(document).on("keyup", "#ng-qty__input", function () {
  if (Number($(this).val()) >= 1 && $(this).val() != "") {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }

  if (ngCheckInputComp()) $("#ng-qty__button").prop("disabled", false);
  else $("#ng-qty__button").prop("disabled", true);
});

$(document).on("change", "#ng-code__select", function () {
  console.log(ngCheckInputComp());
  if ($(this) >= 1) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  if (ngCheckInputComp()) $("#ng-qty__button").prop("disabled", false);
  else $("#ng-qty__button").prop("disabled", true);
});

function ngCheckInputComp() {
  let flag = true;
  let ngQty = $("#ng-qty__input").val();
  let ngCode = $("#ng-code__select").val();
  if (ngQty == "" || isNaN(ngQty) || Number(ngQty) <= 0) flag = false;
  if (ngCode == "" || Number(ngCode) <= 0) flag = false;

  return flag;
}

function getToday() {
  // 本日の日付をyy-mm-dd形式で返す
  let dt = new Date();
  return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
}

$(document).on("click", "#ng-qty__button", function () {
  let fileName = "./php/QualityReport/InsQalityInformation.php";
  let sendData = {
    process_id: 4,
    using_aging_rack_id: $("#remain-rack__table_selected__tr td").eq(0).html(),
    quality_code_id: $("#ng-code__select").val(),
    ng_quantities: $("#ng-qty__input").val(),
    created_at: getToday(),
  };
  myAjax.myAjax(fileName, sendData);
  // ReMake Ng table
  makeNgTable();
});

// ++++++++++++++++++++++   TEST  BUTTON ++++++++++++++++++++++++++
// ++++++++++++++++++++++   TEST  BUTTON ++++++++++++++++++++++++++
// ++++++++++++++++++++++   TEST  BUTTON ++++++++++++++++++++++++++
$(document).on("click", "#test__button", function () {
  let fileName = "./php/Packing/SelSelRackNgInformation.php";
  let sendData = {
    process_id: 4,
    using_aging_rack_id: $("#remain-rack__table_selected__tr td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  console.log(ajaxReturnData);
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo("#ng__table tbody:nth-child(2)");
  });
});
