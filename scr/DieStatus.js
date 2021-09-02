// 2021/08/19 start to edit
// let deleteDialog = document.getElementById("delete__dialog");

let cancelKeyupEvent = false;
let cancelKeydownEvent = false;
let editMode = false;
let readNewFile = false;

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
});


function makeSummaryTable() {
    var fileName = "./php/DieStatus/DieHistory.php";
    var sendData = {
        dummy: "dummy",
    };
    // 今日の日付の代入
    myAjax.myAjax(fileName, sendData);
    fillTableBody(ajaxReturnData, $("#die__table tbody"));
}

function fillTableBody(data, tbodyDom) {
    let checkLimit = new Object();
    let chekFlag = false;
    $(tbodyDom).empty();
    data.forEach(function(trVal) {
        let newTr = $("<tr>");
        Object.keys(trVal).forEach(function(tdVal, index) {

            $("<td>").html(trVal[tdVal]).appendTo(newTr);

        });
        chekFlag = false;
        $(newTr).appendTo(tbodyDom);
    });
}

$(document).on("click", "#die__table tbody tr", function() {
    if (!$(this).hasClass("selected-record")) {
        $(this).parent().find("tr").removeClass("selected-record");
        $(this).addClass("selected-record");
        $("#die__table__selected").removeAttr("id");
        $(this).attr("id", "die__table__selected");
    } else {
        $("#add__table tbody").append($(this).removeClass("selected-record"));
        $("#go__button").prop("disabled", false);
    }
});