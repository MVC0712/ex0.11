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
    $("#add__button").prop("disabled", true);
    $("#test__button").remove();
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
    var fileName = "./php/QualitySummary/SelSummary.php";
    var sendData = {
        die_number: $("#die_number__input").val() + "%",
    };
    myAjax.myAjax(fileName, sendData);
    $("#summary__table tbody").empty();

    ajaxReturnData.forEach(function(trVal) {
        var newTr = $("<tr>");
        Object.keys(trVal).forEach(function(tdVal) {
            $("<td>").html(trVal[tdVal]).appendTo(newTr);
        });
        $(newTr).appendTo("#summary__table tbody");
    });
    console.log("Die search");
}

// ==============  press term  ===================
$(document).on("change", "input.date__input", function() {
    if (checkInput()) {
        makeTableWithTerm();
    }
});

function makeTableWithTerm() {
    var fileName = "./php/QualitySummary/SelSummaryTerm.php";
    var sendData = {
        die_number: $("#die_number__input").val() + "%",
        start_term: $("#start_term").val(),
        end_term: $("#end_term").val(),
    };
    myAjax.myAjax(fileName, sendData);
    console.log(ajaxReturnData);
    $("#summary__table tbody").empty();

    ajaxReturnData.forEach(function(trVal) {
        var newTr = $("<tr>");
        Object.keys(trVal).forEach(function(tdVal) {
            $("<td>").html(trVal[tdVal]).appendTo(newTr);
        });
        $(newTr).appendTo("#summary__table tbody");
    });
    console.log("Term search");
    mau();
    ulitycall();
}

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

function datesearch() {
    var choice, datea, filterdt, tabledt, trdt, td9, td10, td11, td12, idt;
    var datea = document.getElementById('date').value;
    filterdt = formatDate(datea);
    choice = $('#choice').val();
    tabledt = document.getElementById("summary__table");
    trdt = tabledt.getElementsByTagName("tr");
    if (choice == 1) {
        console.log(9);
        for (idt = 0; idt < trdt.length; idt++) {
            td9 = trdt[idt].getElementsByTagName("td")[9];
            if (td9) {
                if (td9.innerHTML.toUpperCase().indexOf(filterdt) > -1) {
                    trdt[idt].style.display = "";
                } else {
                    trdt[idt].style.display = "none";
                }
            }
        }
    } else if (choice == 2) {
        console.log(10);
        for (idt = 0; idt < trdt.length; idt++) {
            td10 = trdt[idt].getElementsByTagName("td")[10];
            if (td10) {
                if (td10.innerHTML.toUpperCase().indexOf(filterdt) > -1) {
                    trdt[idt].style.display = "";
                } else {
                    trdt[idt].style.display = "none";
                }
            }
        }
    } else if (choice == 3) {
        console.log(11);
        for (idt = 0; idt < trdt.length; idt++) {
            td11 = trdt[idt].getElementsByTagName("td")[11];
            if (td11) {
                if (td11.innerHTML.toUpperCase().indexOf(filterdt) > -1) {
                    trdt[idt].style.display = "";
                } else {
                    trdt[idt].style.display = "none";
                }
            }
        }
    } else if (choice == 4) {
        console.log(12);
        for (idt = 0; idt < trdt.length; idt++) {
            td12 = trdt[idt].getElementsByTagName("td")[12];
            if (td12) {
                if (td12.innerHTML.toUpperCase().indexOf(filterdt) > -1) {
                    trdt[idt].style.display = "";
                } else {
                    trdt[idt].style.display = "none";
                }
            }
        }
    } else if (choice == 5) {
        console.log("all");
        for (idt = 0; idt < trdt.length; idt++) {
            td9 = trdt[idt].getElementsByTagName("td")[9];
            td10 = trdt[idt].getElementsByTagName("td")[10];
            td11 = trdt[idt].getElementsByTagName("td")[11];
            td12 = trdt[idt].getElementsByTagName("td")[12];
            if (td9) {
                if ((td9.innerHTML.toUpperCase().indexOf(filterdt) > -1) ||
                    (td10.innerHTML.toUpperCase().indexOf(filterdt) > -1) ||
                    (td11.innerHTML.toUpperCase().indexOf(filterdt) > -1) ||
                    (td12.innerHTML.toUpperCase().indexOf(filterdt) > -1)) {
                    trdt[idt].style.display = "";
                } else {
                    trdt[idt].style.display = "none";
                }
            }
        }
    }
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [month, day].join('-');
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
});
$(document).on("change", "#end", function() {
    renderHead($('div#table'), new Date($("#std").val()), new Date($("#end").val()));
});
$(function() {
    renderHead($('div#table'), new Date($("#std").val()), new Date($("#end").val()));
});

function renderHead(div, start, end) {
    var c_year = start.getFullYear();
    var r_year = "<tr> <th rowspan='4'>Die number</th> <th rowspan='4'>Total</th> ";
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