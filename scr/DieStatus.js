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

// press date
$(document).on("change", "#date__input", function() {
    $(this).removeClass("no-input").addClass("complete-input");
});
// Die Name
$(document).on("focus", "#die__select", function() {
    var die_s = document.getElementById('die__input').value;
    let fileName = "./php/DieStatus/SelDieNumber.php";
    let sendData = {
        die_number: die_s + "%",
    };
    myAjax.myAjax(fileName, sendData);
    $("#number-of-die__display").html(ajaxReturnData.length);
    $("#die__select option").remove();
    $("#die__select").append($("<option>").val(0).html("NO select"));
    ajaxReturnData.forEach(function(value) {
        $("#die__select").append(
            $("<option>").val(value["id"]).html(value["die_number"])
        );
    });
});

$(document).on("keyup", "#die__input", function() {
    let fileName = "./php/DieStatus/SelDieNumber.php";
    let sendData = {
        die_number: $(this).val() + "%",
    };
    myAjax.myAjax(fileName, sendData);
    $("#number-of-die__display").html(ajaxReturnData.length);
    $("#die__select option").remove();
    $("#die__select").append($("<option>").val(0).html("NO select"));
    ajaxReturnData.forEach(function(value) {
        $("#die__select").append(
            $("<option>").val(value["id"]).html(value["die_number"])
        );
    });
});

// is Washed?
$(document).on("change", "#is-washed__select", function() {
    if ($(this).val() != 0)
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
});

// Name input
$(document).on("focus", "#name__input", function() {
    makeNameList($(this).val());
});

$(document).on("keyup", "#name__input", function() {
    makeNameList($(this).val());
});

function makeNameList(inputValue) {
    let fileName = "./php/DieStatus/SelStaff.php";
    let sendData = {
        name: "%" + inputValue + "%",
    };
    myAjax.myAjax(fileName, sendData);
    $("#name__select option").remove();
    $("#name__select").append($("<option>").val(0).html("no"));
    ajaxReturnData.forEach(function(value) {
        $("#name__select").append(
            $("<option>").val(value["id"]).html(value["staff_name"])
        );
    });
}

$(document).on("focus", "#name__select", function() {
    makeNameList($("#name__input").val());
});

$(document).on("change", "#name__select", function() {
    if ($(this).val() != "0") {
        $(this).removeClass("no-input").addClass("complete-input");
    } else {
        $(this).removeClass("complete-input").addClass("no-input");
    }
});

$(document).on("click", "#rack__table tbody tr", function() {
    if (!$(this).hasClass("selected-record")) {
        // tr に class を付与し、選択状態の background colorを付ける
        $(this).parent().find("tr").removeClass("selected-record");
        $(this).addClass("selected-record");
        // tr に id を付与する
        $("#rack_selected__tr").removeAttr("id");
        $(this).attr("id", "rack_selected__tr");
        // racknumber__input に値を移動する
        $("#racknumber__input").val($(this).find("td")[1].innerText);
        $("#racknumber__input").removeClass("no-input").addClass("complete-input");
        $("#rackqty__input").val($(this).find("td")[2].innerText);
        $("#rackqty__input").removeClass("no-input").addClass("complete-input");

        $("#add-rack__button").text("Update").prop("disabled", false);
    }
    /*else {
       $(this).remove();
       renumberTableColumn();
       $("#racknumber__input").val("");
       $("#rackqty__input").val("");
       $("#add-rack__button").prop("disabled", true).text("Save");
     }*/
});