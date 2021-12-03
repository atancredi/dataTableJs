/////////////////////////////// UTILITY
//see if checkbox is in the head or body of the table
function theadTest(sel) {
    return $(sel.parents()[2]).is("thead");
}

//////////////////////////////// CORE

// INIT AND WRAPPER
function Initialization(container) {
    DestroyData(container);
    InitWrapper(container, detectDevice(), createDataSets(RawDataSet));
}
function InitWrapper(container, mode, data) {
    //if data is array create a table for each object
    if (isArray(data)) {
        for (var i = 0; i < lenght(data); i++) {
            ShowData(container, mode, data[i]);
        }
    }

    //if data is object create just one
    else if (isObject(data)) {
        ShowData(container, mode, data);
    }
}

// DATA MANAGEMENT
function createDataSets(raw) {

    ////// funzione che crea il dataset da stampare
    function createDS(caption, head, data, options) {
        return {

            caption: caption,
            head: head,
            data: data,
            options: options
        }
    }

    //qual è il criterio di divisione?
    var criteria = (getCriteria() == "tema") ? 3 : 2;

    //creo la tHead
    var th = (criteria == 3) ? (["Titolo", "Autore", "Testata"]) : (["Titolo", "Autore", "Tema"]);

    //dividi gli articoli
    var data = {}; //parsed articles
    for (var i = 0; i < lenght(raw); i++) {
        var eval = raw[i][criteria];
        if (!isArray(data[eval])) data[eval] = [];

        //create the new data array without the criteria column
        var row = [];
        for (var k = 0; k < lenght(raw[i]); k++) {
            if (k != criteria) row.push(raw[i][k]);
        }

        data[eval].push(row);
    }

    //crea la lista delle categorie
    var categories = Object.keys(data);

    //creo un dataset da stampare per ogni categoria
    var options = {
        formatOptions: {
            '0': "underline",
            '1': "bold, small",
            '2': "small",
            '3': "hide"
        }
    }
    var finalDataSets = [];
    for (var i = 0; i < lenght(categories); i++) {
        finalDataSets.push(createDS(categories[i], th, data[categories[i]], options));
    }

    return finalDataSets;
}
function getCriteria() { //get subdivision criteria !! THIS IS NOT GENERAL
    return $("#splitCriteria").val();
}

// SHOW THE DATA IN THE HTML TABLE
function ShowData(container, mode, ds) {

    //----------------------------------------------------- §Functions§

    //GENERATION FUNCTIONS
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

    function DesktopRuntime(table) {

        console.log("Generating desktop version");

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
    }

    function MobileRuntime(table) {

        console.log("Generating mobile version");

        //create the table body
        table.append("<tbody></tbody>");
        var tbody = table.find("tbody");


        for (var i = 0; i < lenght(ds["data"]); i++) {
            //tbody.append(format('<tr><td class="mobileTd" colspan="2">{0}</td></tr><tr style="border-bottom: 1px solid black;"><td class="mobileTd" style="border-right: 1px solid black;">{1}</td><td class="mobileTd">{2}</td></tr>', [ds["data"][i]]));

            //

            //generation of a table entry
            var s = "";
            for (var j = 0; j < lenght(ds["data"][i]); j++) {

                //isolate the first, last and normal
                if (j == 0) {
                    s += '<tr><td>' + ds["data"][i][j] + '</td></tr>';
                }
                else if (j == lenght(ds["data"][i]) - 1) {
                    s += '<tr><td style="border-bottom: 1px solid black;">' + ds["data"][i][j] + '</td></tr>';
                }
                else {
                    s += '<tr><td>' + ds["data"][i][j] + '</td></tr>';
                }
            }
            tbody.append(s);
        }

    }

    //enumerate the currently rendered tables
    function GetTableNumber() {
        return $('table.dataTable').length;
    }

    //get the new table's id
    function GetTableID() {
        return "dataTable-" + (GetTableNumber() + 1)
    }

    //CHECK TYPES IN THE DATA SET
    function checkDataType(inp) {
        if (!(typeof (inp) == "number" || typeof (inp) == "string"))
            throw new Error("Forbidden data type for " + typeof (inp) + " '" + inp + "'");
    }

    function TypeControl(ds) {
        try {
            ds["head"].forEach(function (value, index) {
                checkDataType(value);
            });
            ds["data"].forEach(function (value, index) {
                value.forEach(function (v, i) {
                    checkDataType(v);
                });
            });
        } catch (e) {
            console.log(e);
            ErrorFlag = 1;
        }
    }

    //----------------------------------------------------- §Main§

    var ErrorFlag = 0;

    //ALLOW MANIPULATION OF THE DATA SET
    TypeControl(ds);

    //if an error is raised stop the execution
    if (ErrorFlag != 0) return;

    //append the table
    var tableID = GetTableID();
    container.append('<table class="dataTable" id="' + tableID + '" ></table>');
    var table = $("#" + tableID);

    //append the caption of the table if exists
    table.append("<caption>" + ds["caption"] + "</caption>");

    // HERE DIVIDE THE MOBILE FROM THE DESKTOP GENERATION
    (mode != "mobile") ? DesktopRuntime(table) : MobileRuntime(table);

    //----------------------------------------------------- §User Interaction§

    //add handler for checkbox selecting
    $(container.find("#" + tableID).find("input[type=checkbox]")).change(function () {

        //is it a click from the table head?
        if (theadTest($(this))) {
            for (var i = 0; i < lenght($(container.find("#" + tableID).find("input[type=checkbox]"))) - 1; i++) {
                $($(container.find("#" + tableID).find("input[type=checkbox]"))[i]).prop("checked", this.checked);
            }
        }

        if (this.checked) {

        } else {

            //if there are none left with the check and the head one has it remove


        }
    });

}

function DestroyData(container) {
    container.html("");
}

//HANDLE THE SELECTION OF ALL THE ITEMS IN DIFFERENT TABLES IN THE SAME CONTAINER
function selectAllContainer(container) {
    var cb = container.find("input[type=checkbox]")

    //count if there are more checked or unchecked
    var c = 0, uc = 0;
    for (var i = 0; i < lenght(cb) - 1; i++) {
        if ($(cb[i]).prop("checked") == true)
            c += 1;
        else
            uc += 1;
    }

    var test;
    if (c == uc)
        test = true;
    else
        (c > uc) ? test = false : test = true;

    for (var i = 0; i < lenght(cb) - 1; i++) {
        $(cb[i]).prop("checked", test);
    }
}

//GET THE CHECK STATE OF ALL THE TABLES IN A CONTAINER
//the returned data is an array containing the tableID, the row number and the value of the checkbox
function getCheckStatus(container) {
    var ReturnData = [];
    var tables = $(container.find("table"));
    var l = lenght(tables) - 1;
    for (var i = 0; i < l; i++) {
        var cbs = $($(tables[i]).find("input[type=checkbox]"));
        var ll = lenght(cbs) - 1;
        for (var j = 0; j < ll; j++) {
            if (!theadTest($(cbs[j])))
                ReturnData.push([i + 1, j - 1, $(cbs[j]).prop("checked")])
        }
    }
    return ReturnData;
}

//////////////////////////////// USER INTERACTION: search in all the tables in a container
InitSearch(text, go, reset){

}