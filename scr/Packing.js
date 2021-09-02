let ajaxReturnData;
let ng__table_edit_mode;
let packingHistoryTableSelectedId;
let workersTableSelectedId;
let boxTableSelectedId;
let originalValue;
let viewMode = false;

let ngTableDeleteDialog = document.getElementById("ng_table-delete__dialog");
let boxTableDeleteDialog = document.getElementById("box_table-delete__dialog");
let packingHisotryDeleteDialog = document.getElementById(
  "packing-hisotry__dialog"
);
let workersDeleteDialog = document.getElementById("workers__dialog");
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
  // BoxNumberOption list
  setBoxNumberOption();
  // staff list option list
  setStaffList();
  // packing work history table
  setPackingHistoryTable();
});

function setPackingHistoryTable() {
  let fileName;
  let sendData = new Object();
  fileName = "./php/Packing/SelPackingHistory.php";
  sendData = {
    limit: 20,
  };
  myAjax.myAjax(fileName, sendData);
  $("#packing-history__table tbody").empty();
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo("#packing-history__table tbody");
  });
}

function setStaffList() {
  let fileName;
  let sendData = new Object();
  fileName = "./php/Packing/SelStaffList.php";
  sendData = {
    limit: 20,
  };
  myAjax.myAjax(fileName, sendData);
  // return false;
  $("#worker__select").empty().append($("<option>").val("0").html("no"));
  ajaxReturnData.forEach(function (value) {
    $("<option>")
      .val(value["id"])
      .html(value["staff_name"])
      .appendTo("#worker__select");
  });
}

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
// press date select
$(document).on("change", "#directive_input__select", function () {
  let fileName;
  let sendData = new Object();
  fileName = "./php/Packing/SelOrderSheetList.php";
  sendData = {
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
  // set aging rack table
  setAgingRack();
  // set packing complete date
  setPackingDate();
  // set dienumber and production number
  setDieNumberAndPN();
});

function setDieNumberAndPN() {
  fileName = "./php/Packing/SelDieNumberAndPN.php";
  sendData = {
    t_press_id: $("#press-date__select").val(),
  };
  myAjax.myAjax(fileName, sendData);
  console.log(ajaxReturnData);
  // $("#DN__display").val(ajaxReturnData[0]["die_number"]);
  document.getElementById("DN__display").innerHTML =
    ajaxReturnData["die_number"];
  document.getElementById("PN__display").innerHTML =
    ajaxReturnData["production_number"];

  return false;
  $("#packing-check-date__input")
    .val(ajaxReturnData[0]["packing_check_date"])
    .removeClass("no-input")
    .addClass("complete-input");
}

$(document).on("change", "#press-date__select", function () {
  setAgingRack();
  // set packing complete date
  setPackingDate();
  // set dienumber and production number
  setDieNumberAndPN();
});

function setPackingDate() {
  fileName = "./php/Packing/SelPackingCompleteDate.php";
  sendData = {
    t_press_id: $("#press-date__select").val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#packing-check-date__input")
    .val(ajaxReturnData[0]["packing_check_date"])
    .removeClass("no-input")
    .addClass("complete-input");
}

function setAgingRack() {
  let fileName = "./php/Packing/SelUgingAgingRack.php";
  let sendData = {
    t_press_id: $("#press-date__select").val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#remain-rack__table tbody:nth-child(2)").empty();
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo("#remain-rack__table tbody:nth-child(2)");
  });
  $("#aging-rack-total-qty__html").html(agingRackTotalQty());
  // clear ng table and box table
  $("#ng__table tbody:nth-child(2)").empty();
  $("#box__table tbody:nth-child(2").empty();
  $("#ng-table-total-ng__html").html("0");
  $("#ng-table-total-ok__html").html("0");
  $("#box-table-total-qty__html").html("0");
}

// packing date
$(document).on("change", "#packing-date__input", function () {
  // background color changing
  if ($(this).val() != "") {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});
// packing start time
$(document).on("keyup", "#packing-start__input", function () {
  if (checkTimeValue($(this).val()) || cancelKeyupEvent) {
    $(this).removeClass("no-input").addClass("complete-input");
    cancelKeyupEvent = false;
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

$(document).on("keydown", "#packing-start__input", function (e) {
  if (
    e.keyCode == 13 &&
    $("#packing-start__input").hasClass("complete-input")
  ) {
    $(this).val(addColon($(this).val()));
    cancelKeyupEvent = true;
    $("#packing-end__input").focus();
    return false;
  }
});

// packing finish time
$(document).on("keyup", "#packing-end__input", function () {
  // if (checkTimeValue($(this).val()) || cancelKeyupEvent) {
  if (checkTimeValue($(this).val())) {
    $(this).removeClass("no-input").addClass("complete-input");
    checkPackingDateTimeInput();
    cancelKeyupEvent = false;
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

$(document).on("keydown", "#packing-end__input", function (e) {
  if (e.keyCode == 13 && $("#packing-end__input").hasClass("complete-input")) {
    $(this).val(addColon($(this).val()));
    cancelKeyupEvent = true;
    e.preventDefault(); // 入力をキャンセル。これをしないと、移動後、ボタンをクリックしてしまう
    $("#packing-add__button").focus();
    return false;
  }
});

function addColon(inputValue) {
  // 3桁、または4桁の時刻値にコロンを挿入する
  let returnVal;
  switch (inputValue.length) {
    case 3:
      returnVal = inputValue.substr(0, 1) + ":" + inputValue.substr(1, 2);
      break;
    case 4:
      returnVal = inputValue.substr(0, 2) + ":" + inputValue.substr(2, 2);
      break;
  }
  return returnVal;
}

function checkTimeValue(inputValue) {
  // 0:00 ~ 23:59 までに入っているか否か、判断する
  let flag = false;
  if (inputValue.substr(0, 1) == "1" && inputValue.length == 4) {
    // 1で始まる4桁時刻
    if (
      0 <= Number(inputValue.substr(1, 1)) &&
      Number(inputValue.substr(1, 1)) <= 9 &&
      0 <= Number(inputValue.substr(2, 2)) &&
      Number(inputValue.substr(2, 2) <= 59)
    ) {
      flag = true;
    } else {
      flag = false;
    }
  } else if (inputValue.substr(0, 1) == "2" && inputValue.length == 4) {
    // 2で始まる4桁時刻
    if (
      0 <= Number(inputValue.substr(1, 1)) &&
      Number(inputValue.substr(1, 1)) <= 3 &&
      0 <= Number(inputValue.substr(2, 2)) &&
      Number(inputValue.substr(2, 2) <= 59)
    ) {
      flag = true;
    } else {
      flag = false;
    }
  } else if (
    0 <= Number(inputValue.substr(0, 1)) &&
    Number(inputValue.substr(0, 1)) <= 9 &&
    inputValue.length == 3
  ) {
    // 3~9で始まる3桁時刻
    if (
      0 <= Number(inputValue.substr(1, 2)) &&
      Number(inputValue.substr(1, 2) <= 59)
    ) {
      flag = true;
    } else {
      flag = false;
    }
  } else {
    flag = false;
  }
  if (inputValue == "") flag = false;
  return flag;
}

// triger :Packing date and time
$(document).on("change", ".upper__wrapper .input__wrapper", function () {
  checkPackingDateTimeInput();
});

$(document).on("keyup", ".upper__wrapper .input__wrapper", function () {
  checkPackingDateTimeInput();
});

function checkPackingDateTimeInput() {
  let packingDate, packingStartTime, packingEndTime;
  packingDate = $("#packing-date__input").hasClass("complete-input");
  packingStartTime = $("#packing-start__input").hasClass("complete-input");
  packingEndTime = $("#packing-end__input").hasClass("complete-input");
  if (packingDate && packingStartTime && packingEndTime) {
    $("#packing-add__button").prop("disabled", false);
  } else {
    $("#packing-add__button").prop("disabled", true);
  }
}

$(document).on("keyup", "#packing-add__button", function () {
  let fileName;
  let sendData = new Object();
  if (cancelKeyupEvent) {
    cancelKeyupEvent = false;
    return false;
  }

  fileName = "./php/Packing/InsPacking.php";
  sendData = {
    packing_date: $("#packing-date__input").val(),
    packing_start: $("#packing-start__input").val(),
    packing_end: $("#packing-end__input").val(),
    created_at: getToday(),
  };
  myAjax.myAjax(fileName, sendData);
  // delete input data
  $("#packing-date__input").val("");
  $("#packing-start__input").val("");
  $("#packing-end__input").val("");
  // packing work history table
  setPackingHistoryTable();
});
// worker select
$(document).on("change", "#worker__select", function () {
  if ($(this).val() != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
    if ($("#packing-history__table_selected__tr").length) {
      $("#add_worker__button").prop("disabled", false);
    } else {
      $("#add_worker__button").prop("disabled", true);
    }
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
    $("#add_worker__button").prop("disabled", true);
  }
});

// worker select add button
$(document).on("click", "#add_worker__button", function () {
  let fileName;
  let sendData = new Object();

  fileName = "./php/Packing/InsPakcingWorker.php";
  sendData = {
    t_packing_id: $("#packing-history__table_selected__tr")
      .find("td")
      .eq(0)
      .html(),
    m_staff_id: $("#worker__select").val(),
    created_at: getToday(),
  };
  myAjax.myAjax(fileName, sendData);
  // set worker table
  setWorkerTable();
  // packing work history table
  setPackingHistoryTable();
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ======== Table Common                        ======================
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("click", "table tr", function (e) {
  let id_name;
  id_name = $(this).parent().parent().attr("id");
  id_name = id_name + "_selected__tr";
  if (!$(this).hasClass("selected-record")) {
    // tr に class を付与し、選択状態の background colorを付ける
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).parent().find("input").removeClass("selected-input");
    $(this).addClass("selected-record");
    $(this).find("input").addClass("selected-input");
    // tr に id を付与する
    $("#" + id_name).removeAttr("id");
    $(this).attr("id", id_name);
  } else {
    // 選択レコードを再度クリックした時
    // 削除問い合わせダイアログ
    // deleteDialog.showModal();
  }
});

$(document).on("keyup", ".bottom__wrapper", function () {
  if (activateAddButton()) {
    $("#packing-work-add__button").prop("disabled", false);
  } else {
    $("#packing-work-add__button").prop("disabled", true);
  }
});

$(document).on("update", ".bottom__wrapper", function () {
  if (activateAddButton()) {
    $("#packing-work-add__button").prop("disabled", false);
  } else {
    $("#packing-work-add__button").prop("disabled", true);
  }
});

$(document).on("click", ".bottom__wrapper", function () {
  if (activateAddButton()) {
    $("#packing-work-add__button").prop("disabled", false);
  } else {
    $("#packing-work-add__button").prop("disabled", true);
  }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ======== Middle Table Common                        ======================
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// #######################################################################
// ########  Packing history Table               #########################
// #######################################################################

$(document).on("click", "#packing-history__table tbody tr", function () {
  if (packingHistoryTableSelectedId == $(this).find("td").eq(0).html()) {
    // show delete dialog
    packingHisotryDeleteDialog.showModal();
  } else {
    // set worker table
    setWorkerTable();
    if ($(this).find("td").eq(6).html() != "0") {
      // when number of box is '0' show box talbe
      setViewModeBoxTable();
      viewMode = true;
    } else {
      viewMode = false;
    }
  }
  packingHistoryTableSelectedId = $(this).find("td").eq(0).html();
});

function setViewModeBoxTable() {
  let fileName;
  let sendData = new Object();

  fileName = "./php/Packing/SelViewModeBoxTable.php";
  sendData = {
    t_packing_id: $("#packing-history__table_selected__tr")
      .find("td")
      .eq(0)
      .html(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#box__table tbody:nth-child(2)").empty();
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo("#box__table tbody:nth-child(2)");
  });
  // calicurate total work qty
  $("#box-table-total-qty__html").html(totalBoxWorkQty());
}

function setWorkerTable() {
  let fileName;
  let sendData = new Object();

  fileName = "./php/Packing/SelWorkersList.php";
  sendData = {
    id: $("#packing-history__table_selected__tr").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#workers__table tbody").empty();
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo("#workers__table tbody");
  });
}

// delete dialog cancel button
$(document).on("click", "#packing-history-dialog-cancel__button", function (e) {
  packingHisotryDeleteDialog.close();
});
// delete dialog delete button
$(document).on("click", "#packing-history-dialog-delete__button", function (e) {
  let fileName;
  let sendData = new Object();

  fileName = "./php/Packing/DelPackingHistory.php";
  sendData = {
    id: $("#packing-history__table_selected__tr").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  // packing work history table
  setPackingHistoryTable();
  packingHisotryDeleteDialog.close();
});

// #######################################################################
// ########  Workers Table   Table               #########################
// #######################################################################

$(document).on("click", "#workers__table tbody tr", function () {
  console.log("hello");
  if (workersTableSelectedId == $(this).find("td").eq(0).html()) {
    // show delete dialog
    workersDeleteDialog.showModal();
  } else {
    // do nothing
  }
  workersTableSelectedId = $(this).find("td").eq(0).html();
});

// delete dialog cancel button
$(document).on("click", "#workers-dialog-cancel__button", function (e) {
  workersDeleteDialog.close();
});
// delete dialog delete button
$(document).on("click", "#workers-dialog-delete__button", function (e) {
  let fileName;
  let sendData = new Object();

  fileName = "./php/Packing/DelWorkersTable.php";
  sendData = {
    id: $("#workers__table_selected__tr").find("td").eq(0).html(),
  };
  console.log(sendData);
  // return false;
  myAjax.myAjax(fileName, sendData);
  // remake workers table
  setWorkerTable();
  workersDeleteDialog.close();
});
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ======== Under LEFT AgingRack                      ======================
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#remain-rack__table tr", function () {
  // Make Ng table
  makeNgTable();
  // display total qty
  $("#ng-table-total-ng__html").html(ngTableTotalNgQty());
  // display total OK qty
  okQty = Number($("#remain-rack__table_selected__tr td:nth-child(4)").html());
  // okQty = okQty - Number(ngTableTotalNgQty());
  $("#ng-table-total-ok__html").html(okQty);
  // packing work qty
  $("#packing-work-qty__input")
    .removeClass("no-input")
    .addClass("complete-input")
    .val(okQty);
  // make box table
  makeBoxTable();
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
    Object.keys(trVal).forEach(function (tdVal, index) {
      if (index == 3) {
        $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
      } else {
        $("<td>").html(trVal[tdVal]).appendTo(newTr);
      }
    });
    $(newTr).appendTo("#ng__table tbody:nth-child(2)");
  });
}

function agingRackTotalQty() {
  let totalQty = 0;
  $("#remain-rack__table tbody.table-content tr td:nth-child(4)").each(
    function () {
      totalQty += Number($(this).html());
    }
  );
  return totalQty;
}
// ======================================================
// ======== Under Middle (NG CODE) ======================
// ======================================================
$(document).on("click", "#ng__table tr", function (e) {
  // if the record is alredy selected
  if (ng__table_edit_mode) {
    ngTableDeleteDialog.showModal();
  }
  ng__table_edit_mode = true;
});
// delete dialog cancel button
$(document).on("click", "#ng_table-dialog-cancel__button", function (e) {
  ngTableDeleteDialog.close();
});

// delete dialog delete button
$(document).on("click", "#ng_table-dialog-delete__button", function (e) {
  let fileName = "./php/Packing/DelNgData.php";
  let sendData = {
    id: $("#ng__table_selected__tr td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  makeNgTable();
  // redisplay agingrack table
  setAgingRack();
  ngTableDeleteDialog.close();
});

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
  let okQty = 0;
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
  // delete input value
  console.log("hello");
  $("#ng-qty__input").val("");
  $("#ng-code__select").val("1");
  // display total NG qty
  $("#ng-table-total-ng__html").html(ngTableTotalNgQty());
  // display total OK qty
  okQty = Number($("#remain-rack__table_selected__tr td:nth-child(4)"));
  okQty = okQty - Number(ngTableTotalNgQty());
  $("#ng-table-total-ok__html").html(okQty);
  // redisplay agingrack table
  setAgingRack();
});

$(document).on("change", "#ng__table input", function () {
  let fileName = "./php/Packing/UpdateNgQty.php";
  let sendData = {
    id: $("#ng__table_selected__tr").find("td").eq(0).html(),
    ng_quantities: $(this).val(),
  };
  // return false;
  myAjax.myAjax(fileName, sendData);
  // clear input data
  $("#ng__table tbody").find("tr").removeClass("selected-record");
  $("#ng__table input").removeClass("selected-input");
  // redisplay agingrack table
  setAgingRack();
});

function ngTableTotalNgQty() {
  let totalNgQty = 0;
  $("#ng__table tbody.table-content tr td:nth-child(4) input").each(
    function () {
      totalNgQty += Number($(this).val());
    }
  );
  return totalNgQty;
}
// ======================================================
// ======== Under Right (Box Table) ======================
// ======================================================
$(document).on("click", "#box__table tr", function () {
  // if the record is alredy selected show delete dialog
  if (boxTableSelectedId == $(this).find("td").eq(0).html()) {
    boxTableDeleteDialog.showModal();
  }
  boxTableSelectedId = $(this).find("td").eq(0).html();
});

$(document).on("click", "#box_table-dialog-cancel__button", function () {
  boxTableDeleteDialog.close();
});

$(document).on("click", "#box_table-dialog-delete__button", function () {
  let fileName;
  let sendData = new Object();
  fileName = "./php/Packing/DelBoxData.php";
  sendData = {
    id: $("#box__table_selected__tr td:nth-child(1)").html(),
  };
  myAjax.myAjax(fileName, sendData);
  makeBoxTable();
  boxTableDeleteDialog.close();
});

$(document).on("keyup", "#box-number__input", function () {
  $(this).val($(this).val().toUpperCase()); // 小文字を大文字に
  if ($(this).val().length >= 3 && $(this).val() != "") {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

$(document).on("keyup", "#packing-work-qty__input", function () {
  const okWrok = Number($("#ng-table-total-ok__html").html());
  const boxTotalWork = Number($("#box-table-total-qty__html").html());
  const maxBoxWork = okWrok - boxTotalWork;
  // check input work qty is right or not it should be smaller than total ok qty
  if (Number($(this).val()) <= maxBoxWork && Number($(this).val()) > 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

function activateAddButton() {
  // boxnumber and workquantitty is inputted?
  let temp1, temp2, temp3;
  let flag = false;
  temp1 = $("#packing-history__table_selected__tr").length;
  temp2 = $("#box-number__select").hasClass("no-input");
  temp3 = $("#packing-work-qty__input").hasClass("no-input");

  if (temp1 && !temp2 && !temp3) {
    flag = true;
  } else {
    flag = false;
  }
  return flag;
}

// record new box number
$(document).on("click", "#packing-box-add__button", function () {
  $("#box-number__select").removeClass("complete-input").addClass("no-input");
  $("#packing-work-add__button").prop("disabled", true);
  window.open(
    "./PackingBoxList.html",
    null,
    "width=500, height=400,top=100,left=100,toolbar=yes,menubar=yes,scrollbars=no"
  );
});

$(document).on("change", "#box-number__select", function () {
  if ($(this).val() != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

function setBoxNumberOption() {
  let fileName;
  let sendData = new Object();
  fileName = "./php/Packing/SelBoxNumber.php";
  sendData = {
    limit: 20,
  };
  myAjax.myAjax(fileName, sendData);
  // return false;
  $("#box-number__select").empty().append($("<option>").val("0").html("no"));
  ajaxReturnData.forEach(function (value) {
    $("<option>")
      .val(value["id"])
      .html(value["box_number"])
      .appendTo("#box-number__select");
  });
}

$(document).on("click", "#packing-work-add__button", function () {
  let fileName;
  let sendData = new Object();
  fileName = "./php/Packing/InsPackingBox.php";
  sendData = {
    packing_id: $("#packing-history__table_selected__tr")
      .find("td")
      .eq(0)
      .html(),
    box_number_id: $("#box-number__select").val(),
    using_aging_rack_id: $(
      "#remain-rack__table_selected__tr td:nth-child(1)"
    ).html(),
    work_quantity: $("#packing-work-qty__input").val(),
    created_at: getToday(),
  };
  myAjax.myAjax(fileName, sendData);
  // remake box table
  makeBoxTable();
  // reset input frame
  $("#box-number__select").val("0");
  $("#packing-work-qty__input").val("");
  // remake aging table
  setAgingRack();
});

function makeBoxTable() {
  let fileName;
  let sendData = new Object();
  fileName = "./php/Packing/SelPackingBoxNumberWorkQty.php";
  sendData = {
    using_aging_rack_id: $(
      "#remain-rack__table_selected__tr td:nth-child(1)"
    ).html(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#box__table tbody:nth-child(2)").empty();
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal, index) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo("#box__table tbody:nth-child(2)");
  });
  // calicurate total work qty
  $("#box-table-total-qty__html").html(totalBoxWorkQty());
}

function totalBoxWorkQty() {
  let temp;
  let totalWorkQty = 0;
  temp = $("#box__table tbody:nth-child(2) tr td:nth-child(2)");
  $("#box__table tbody:nth-child(2) tr td:nth-child(3)").each(function () {
    totalWorkQty += Number($(this).html());
  });
  return totalWorkQty;
}

// ++++++++++++++++++++++   TEST  BUTTON ++++++++++++++++++++++++++
// ++++++++++++++++++++++   TEST  BUTTON ++++++++++++++++++++++++++
// ++++++++++++++++++++++   TEST  BUTTON ++++++++++++++++++++++++++
$(document).on("click", "#test__button", function () {
  $("#packing-date__input").val("2020-01-01");
  $("#packing-date__input").val("hogehoge");
  console.log($("#packing-date__input"));
  console.log($("#packing-date__input").val());
});
