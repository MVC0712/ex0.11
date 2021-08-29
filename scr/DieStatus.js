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
    $("#date__input").val(returnToday());
    // summary tebale の読み出し
    myAjax.myAjax(fileName, sendData);
    fillTableBody(ajaxReturnData, $("#die__table tbody"));
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