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
  $("#insert_plan").prop("disabled", true);
    makeSummaryTable();
});

// ==============  die_number  ===================
$(document).on("keyup", "#die_number__input", function() {
    if (checkInput()) {
        makeTableWithTerm();
    } else {
        makeSummaryTable();
    }
});

function makeSummaryTable() {
    var fileName = "./php/Schedule/SelSummary.php";
    var sendObj = new Object();

    sendObj["start_s"] = $('#std').val();
    sendObj["end_s"] = $("#end").val();
    myAjax.myAjax(fileName, sendObj);
    console.log(ajaxReturnData);
    $("#summary__table tbody").empty();

    ajaxReturnData.forEach(function(trVal) {
        var newTr = $("<tr>");
        Object.keys(trVal).forEach(function(tdVal) {
            $("<td>").html(trVal[tdVal]).appendTo(newTr);
        });
        $(newTr).appendTo("#summary__table tbody");
    });
}

// ==============  press term  ===================
$(document).on("change", "input.date__input", function() {
    if (checkInput()) {
        makeTableWithTerm();
    }
});

function checkInput() {
    let flag = false;
    var fr = document.getElementById('start_term').value;
    var to = document.getElementById('end_term').value;
    if (fr != "" && to != "") {
        flag = true;
    }
    console.log(flag);
    return flag;
}

// ==============  summary table ====================
$(document).on("click", "#summary__table tbody tr", function(e) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
});

function timkiem() {
    var input, table, tr, td, filter, i, txtdata;
    input = document.getElementById("presstype");
    filter = input.value.toUpperCase();
    table = document.getElementById("summary__table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[3];
        if (td) {
            txtdata = td.innerText;
            if (txtdata.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function total_row(col, idcol) {
    var tablett, trtt, tdtt, itt, tt;
    var tt = 0;
    var txttt = 0;
    tablett = document.getElementById("summary__table");
    trtt = tablett.getElementsByTagName("tr");
    for (itt = 0; itt < trtt.length; itt++) {
        tdtt = trtt[itt].getElementsByTagName("td")[col];
        if (tdtt) {
            txttt = Number(tdtt.innerText);
            if ($(trtt[itt]).css("display") !== "none") {
                tt += txttt;
            }
        }
    }
    document.getElementById(idcol).innerHTML = tt;

}


// summary_table
var weekday = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

$(document).on("change", "#std", function() {
    renderHead($('div#table'), new Date($("#std").val()), new Date($("#end").val()));
    makeSummaryTable();
});
$(document).on("change", "#end", function() {
    renderHead($('div#table'), new Date($("#std").val()), new Date($("#end").val()));
    makeSummaryTable();
});
$(function() {
    renderHead($('div#table'), new Date($("#std").val()), new Date($("#end").val()));
    makeSummaryTable();
});

function renderHead(div, start, end) {
    var c_year = start.getFullYear();
    var r_year = "<tr> <th rowspan='4'>Die number</th>";
    var daysInYear = 0;

    var c_month = start.getMonth();
    var r_month = "<tr>";
    var daysInMonth = 0;

    var r_days = "<tr>";
    var r_days2 = "<tr>";
    for (start; start <= end; start.setDate(start.getDate() + 1)) {
        if (start.getFullYear() !== c_year) {
            r_year += '<th colspan="' + daysInYear + '">' + c_year + '</th>';
            c_year = start.getFullYear();
            daysInYear = 0;
        }
        daysInYear++;

        if (start.getMonth() !== c_month) {
            r_month += '<th colspan="' + daysInMonth + '">' + months[c_month] + '</th>';
            c_month = start.getMonth();
            daysInMonth = 0;
        }
        daysInMonth++;

        r_days += '<th>' + start.getDate() + '</th>';
        r_days2 += '<th>' + weekday[start.getDay()] + '</th>';
    }
    r_days += "</tr>";
    r_days2 += "</tr>";
    r_year += '<th colspan="' + (daysInYear) + '">' + c_year + '</th>';
    r_year += "</tr>";
    r_month += '<th colspan="' + (daysInMonth) + '">' + months[c_month] + '</th>';
    r_month += "</tr>";
    table = "<table id='summary__table'> <thead>" + r_year + r_month + r_days + r_days2 + " </thead> <tbody> </tbody> </table>";

    div.html(table);
}

// Prs date
$(document).on("change", "#press__date", function() {
  $(this).removeClass("no-input").addClass("complete-input");
  check_ins()
});

// Die input
$(document).on("keyup", "#die__input", function() {
  let fileName = "./php/Schedule/SelDieNumber.php";
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

// Die select
$(document).on("change", "#die__select", function() {
  if ($(this).val() != "0") {
    $(this).removeClass("no-input").addClass("complete-input");
} else {
    $(this).removeClass("complete-input").addClass("no-input");
}
check_ins()
});

// Prs qty
$(document).on("keyup", "#press__qty", function() {
  if ($(this).val().length > 0) {
    $(this).removeClass("no-input").addClass("complete-input");
} else {
    $(this).removeClass("complete-input").addClass("no-input");
}
check_ins()
});

function check_ins() {
  $("#insert_plan").prop("disabled", true);
  var st1 = $("#die__select").val();
  var st2 = $("#press__date").val().length;
  var st3 = $("#press__qty").val();
  console.log(st1)
  console.log(st2)
  console.log(st3)
  if(st1 !=0 && st2 !=0 &&st3 !=0){
    $("#insert_plan").prop("disabled", false);
  }else{
    $("#insert_plan").prop("disabled", true);
  }
};

$(document).on("click", "#insert_plan", function() {
  var fileName = "./php/Schedule/InsPlan.php";
  var sendObj = new Object();

  sendObj["dies_id"] = $('#die__select').val();
  sendObj["prs_date"] = $("#press__date").val();
  sendObj["prs_qty"] = $("#press__qty").val();
  console.log(sendObj)
  myAjax.myAjax(fileName, sendObj);

  $("#insert_plan").prop("disabled", true);
  $("#die__input").val("");
  $("#die__select").val("");
  $("#press__date").val("");
  $("#press__qty").val("");
  makeSummaryTable();
});