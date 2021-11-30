//dummy dataSet
var ds = {

    caption: "caption 1",
    head: ["col1", "col2", "col3"],
    data: [
        [3, 2, 3],
        [3, 4, 5],
        [6, 7, 8]
    ],
    options: {

    }

}

// SHOW THE DATA IN THE HTML TABLE
function ShowData(container, ds) {

    var ErrorFlag = 0;

    function generateRow(rowData, options) {
        var s = "";

        //if options has something inside
        if (lenght(options) > 0) {
            var r = '<tr style="{0}">';
            var op = "";
            if (options["background"] != "undefined") {
                op += "background: " + options["background"];
            }
            s += format(r, [op])
        }

        else s += "<tr>"

        //add the select cell
        s += '<td class="selectCell"><input type="checkbox"></td>';

        var cell = "<td>{0}</td>"

        //for every column add the cell
        rowData.forEach(function (value, index) {
            s += format(cell, [value]);
        });

        s += "</tr>";
        return s;
    }

    //enumerate the currently rendered tables
    function GetTableNumber() {
        return $('table.dataTable').length;
    }

    //get the new table's id
    function GetTableID() {
        return "dataTable-" + (GetTableNumber() + 1)
    }

    //rollback function in case of error
    function rollback(container) {
        container.html("");
    }

    //CHECK TYPES IN THE DATA SET
    function checkDataType(inp) {
        if (!(typeof (inp) == "number" || typeof (inp) == "string"))
            throw new Error("Forbidden data type for " + typeof (inp) + " '" + inp + "'");
    }
    ds["head"].forEach(function (value, index) {
        try {
            checkDataType(value);
        } catch (e) {
            console.log(e);
            ErrorFlag = 1;
        }
    });
    ds["data"].forEach(function (value, index) {
        try {
            value.forEach(function (v, i) {
                checkDataType(v);
            });
        } catch (e) {
            console.log(e);
            ErrorFlag = 1;
        }
    });

    //ALLOW MANIPULATION OF THE DATA SET


    //if an error is raised stop the execution
    if (ErrorFlag != 0) return;

    //append the table
    var tableID = GetTableID();
    container.append('<table class="dataTable" id="' + tableID + '" ></table>');
    var table = $("#" + tableID);

    //append the caption of the table if exists
    table.append("<caption>" + ds["caption"] + "</caption>");

    //append the table head
    table.append('<thead>' + generateRow(ds["head"]) + '</thead>');

    //create the table body
    table.append("<tbody></tbody>");
    var tbody = table.find("tbody");

    for (var i = 0; i < lenght(ds["data"]); i++) {

        //if even show grey, if odd show white
        if (i % 2 == 0) {
            tbody.append(generateRow(ds["data"][i], {

            }));
        } else {

            tbody.append(generateRow(ds["data"][i], {
                background: "#dfdfdf"
            }));
        }


    }

    ///////////////////////////////////////////////////////////////////////////////

    //add handler for checkbox selecting
    $(container.find("input[type=checkbox]")).change(function () {

        //is it a click from the table head?
        var theadTest = $($(this).parents()[2]).is("thead");
        if (theadTest) {
            for (var i = 0; i < lenght($(container.find("input[type=checkbox]"))) - 1; i++) {
                $($(container.find("input[type=checkbox]"))[i]).prop("checked", this.checked);
            }
        }

        if (this.checked) {

        } else {

            //if there are none left with the check and the head one has it remove


        }
    });

}