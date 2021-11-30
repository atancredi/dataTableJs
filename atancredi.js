//variable is array
function isArray(arr) {
    if (typeof (arr) == "object" && Array.isArray(arr)) return true;
    else return false;
}

//variable is object
function isObject(arr) {
    if (typeof (arr) == "object" && !(Array.isArray(arr))) return true;
    else return false;
}

//Find the lenght of an ARRAY
function lenght(array) {
    var len = 0;

    if (typeof array == "object") {
        if (Array.isArray(array)) {
            array.forEach(function (item) {
                len++;
            })
        } else {
            len = lenght(Object.keys(array));
        }
    }
    return len;
}

//Format a string - should really add exceptions
function format(stringa, array_parametri) {
    var counter = 0;
    var stringa_out = stringa;

    array_parametri.forEach(function (item) {
        if (typeof (item) == "string" || typeof item == "number") {
            var expr = "{" + counter + "}";
            if (stringa.includes(expr)) {
                stringa_out = stringa_out.replaceAll(expr, item);
            } else {
                return "errore";
            }
        } else {
            return "errore";
        }

        counter++;
    });

    return stringa_out;

}

//breakpoint for screen size
function getScreenRes(){
		return window.screen.availWidth+"x"+window.screen.availHeight
}
