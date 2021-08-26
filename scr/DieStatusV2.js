// 削除確認ダイアログ
let deleteDialog = document.getElementById("delete__dialog");
var ajaxReturnData;

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
    makeSummaryTable();
    // 入力項目の非活性化
    // $("#directive__input").prop("disabled", true);
    // ボタンの非活性化
    $("#save__button").prop("disabled", true);
    $("#update__button").prop("disabled", true);
    // test ボタンの表示
    $("#test__button").remove();
    $("#delete-record__button").remove();

    var allRadios = document.getElementsByName('check_uncheck');
    var booRadio;
    var x = 0;
    for (x = 0; x < allRadios.length; x++) {
        allRadios[x].onclick = function() {
            if (booRadio == this) {
                this.checked = false;
                booRadio = null;
            } else {
                booRadio = this;
            }
        };
    }
});

function makeSummaryTable() {
    var fileName = "./php/DieStatus/SelSummary.php";
    var sendData = {
        dummy: "dummy",
    };
    // 今日の日付の代入
    $("#do_sth_at").val(returnToday());
    // summary tebale の読み出し
    myAjax.myAjax(fileName, sendData);
    fillTableBody(ajaxReturnData, $("#summary__table tbody"));
    formatDate();
}

function returnToday() {
    // 本日の日付をyy-mm-dd形式で返す
    var month;
    var dt = new Date();
    month = dt.getMonth() + 1;
    if (month < 9) month = "0" + month;
    return dt.getFullYear() + "-" + month + "-" + dt.getDate();
}

function fillTableBody(data, tbodyDom) {
    let checkLimit = new Object();
    let checkFlag = false;
    $(tbodyDom).empty();
    data.forEach(function(trVal) {
        let newTr = $("<tr>");
        Object.keys(trVal).forEach(function(tdVal, index) {
            // if (index == 3 || index == 5) {
            //     trVal[tdVal] = trVal[tdVal] + " km";
            // }
            if (checkFlag) {
                $("<td>").html(trVal[tdVal]).addClass("nitriding").appendTo(newTr);
            } else {
                $("<td>").html(trVal[tdVal]).appendTo(newTr);
            }
        });
        checkFlag = false;
        $(newTr).appendTo(tbodyDom);
    });
}

function fillTableBodyHisotry(data, tbodyDom) {
    let checkLimit = new Object();
    let checkFlag = false;
    $(tbodyDom).empty();
    data.forEach(function(trVal) {
        let newTr = $("<tr>");
        Object.keys(trVal).forEach(function(tdVal, index) {
            if (tdVal == "profile_length") {
                trVal[tdVal] = trVal[tdVal] + " km";
            }
            $("<td>").html(trVal[tdVal]).appendTo(newTr);
        });
        checkFlag = false;
        $(newTr).appendTo(tbodyDom);
    });
}

// summary table tr click
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// -------------------------   summary table tr click   -------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#summary__table tbody tr", function() {
    var fileName = "./php/DieStatus/SelSelSummary3.php";
    var sendData = new Object();
    if (!$(this).hasClass("selected-record")) {
        // tr に class を付与し、選択状態の background colorを付ける
        $(this).parent().find("tr").removeClass("selected-record");
        $(this).addClass("selected-record");
        // tr に id を付与する
        $("#summary__table__selected").removeAttr("id");
        $(this).attr("id", "summary__table__selected");
        sendData = {
            id: $("#summary__table__selected").find("td").eq(0).html(),
        };
    } else {
        $("#add__table tbody").append($(this).removeClass("selected-record"));
        $("#go__button").prop("disabled", false);
    }
    go_check();
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// -------------------------   add__table table tr click   -------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#add__table tbody tr", function() {
    var fileName = "./php/DieStatus/SelSelSummary.php";
    var sendData = new Object();
    var tableId = $(this).parent().parent().attr("id");

    if (!$(this).hasClass("selected-record")) {
        // tr に class を付与し、選択状態の background colorを付ける
        $(this).parent().find("tr").removeClass("selected-record");
        $(this).addClass("selected-record");
        // tr に id を付与する
        $("#add__table__selected").removeAttr("id");
        $(this).attr("id", "add__table__selected");
        // 選択金型の窒化履歴読み出し ajax の読み出し
        sendData = {
            id: $("#add__table__selected").find("td").eq(0).html(),
        };
    } else {
        // 選択レコードを再度クリックした時
        $("#summary__table tbody").prepend($(this).removeClass("selected-record"));
        $("#go__button").prop("disabled", true);
    }
    go_check();
});


function go_check() {
    if (($("#add__table tbody tr").length == 0) && ($("#process").val() == 0)) {
        $("#go__button").prop("disabled", true);
    } else if (($("#add__table tbody tr").length == 0) && ($("#process").val() != 0)) {
        $("#go__button").prop("disabled", true);
    } else if (($("#add__table tbody tr").length != 0) && ($("#process").val() == 0)) {
        $("#go__button").prop("disabled", true);
    } else {
        $("#go__button").prop("disabled", false);
    }
};

$(document).on("change", "#process", function() {
    if ($("#process").val() == 0) {
        $("#process").removeClass("complete-input").addClass("no-input");
        document.getElementById("status_process").innerHTML = ``;
    } else if ($("#process").val() == 1) {
        $("#process").removeClass("no-input").addClass("complete-input");
        document.getElementById("status_process").innerHTML = `
            <input type="radio" checked name="check_uncheck" class="radio-button" value="1" />Measuring <br /> 
            <input type="radio" name="check_uncheck" class="radio-button" value="2" / > OK <br />
            <input type="radio" name="check_uncheck" class="radio-button" value="3" / > NG <br /> `;

    } else if ($("#process").val() == 2) {
        $("#process").removeClass("no-input").addClass("complete-input");
        document.getElementById("status_process").innerHTML = `
            <input type="radio" checked name="check_uncheck" class='radio-button' value="4" />Immersion <br />
            <input type="radio" name="check_uncheck" class='radio-button' value="5" />Shot <br />
            <input type="radio" name="check_uncheck" class='radio-button' value="6" />Clean <br />`;

    } else if ($("#process").val() == 3) {
        $("#process").removeClass("no-input").addClass("complete-input");
        document.getElementById("status_process").innerHTML = `
            <input type="radio" checked name="check_uncheck" class='radio-button' value="7" />Grinding <br />
            <input type="radio" name="check_uncheck" class='radio-button' value="8" />Nitriding <br />
            <input type="radio" name="check_uncheck" class='radio-button' value="9" />Wire cutting <br />`;
    } else if ($("#process").val() == 4) {
        $("#process").removeClass("no-input").addClass("complete-input");
        document.getElementById("status_process").innerHTML = `
            <input type="radio" checked name="check_uncheck" class='radio-button' value="10" />On rack <br />`;
    }
    go_check();
    console.log($('input[name="check_uncheck"]:checked').val());
});

$(document).on("change", "#status_process", function() {
    console.log($('input[name="check_uncheck"]:checked').val());
});

$(document).on("click", "#go__button", function() {
    var fileName = "./php/DieStatus/InsStatus.php";
    var sendObj = new Object();

    $("#add__table tbody tr td:nth-child(1)").each(function(
        index,
        element
    ) {
        sendObj[index] = $(this).html();
    });
    sendObj["die_status_id"] = $('input[name="check_uncheck"]:checked').val();
    sendObj["do_sth_at"] = $("#do_sth_at").val();
    sendObj["note"] = $("#note").val();
    myAjax.myAjax(fileName, sendObj);
    console.log(($("#do_sth_at").val()));
    console.log(sendObj);
    // 書き込み後の処理
    $("#add__table tbody").empty();
    $("#do_sth_at").val(returnToday());
    document.getElementById("status_process").innerHTML = ``;
    $("#go__button").prop("disabled", true);
    $("#process").removeClass("complete-input").addClass("no-input");
    $("#process").val("0");
    $("#note").val("");
    makeSummaryTable();

});

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function formatDate() {
    var table, tr, action_s, pr_tm, sta_val, txt_pr_tm, txt_sta_val, i, diff;
    table = document.getElementById("summary__table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        pr_tm = tr[i].getElementsByTagName("td")[2];
        sta_val = tr[i].getElementsByTagName("td")[4];
        action_s = tr[i].getElementsByTagName("td")[6];
        if (pr_tm) {
            txt_pr_tm = Number(pr_tm.innerText.replace(",", ""));
            txt_sta_val = Number(sta_val.innerText.replace(",", ""));
            table.rows[i].insertCell(6);
            if (txt_sta_val == 1) {
                table.rows[i].cells[6].innerHTML = "Wait result";


            } else if ((txt_pr_tm >= 2)) {
                table.rows[i].cells[6].innerHTML = "Need wash";

            } else if ((txt_sta_val == 4) || (txt_sta_val == 5) ||
                (txt_sta_val == 6) || (txt_sta_val == 7) ||
                (txt_sta_val == 8) || (txt_sta_val == 9)) {
                table.rows[i].cells[6].innerHTML = "Fixing";


            }
        }
    } // table.rows[i].cells[6].style.backgroundColor = "yellow";
};