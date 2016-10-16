"use strict";

function to_little_endian_dword(str) {
    return to_little_endian_word(str) + to_little_endian_word(str >> 16);
}
function to_little_endian_word(str) {
    return to_byte(str) + to_byte(str >> 8);
}
function to_byte(str) {
    return String.fromCharCode(str & 0xFF);
}
function arrayToBase64(arrayIn) {
    var binString = "";
    var length = arrayIn.length;
    for (var index = 0; index < length; ++index) {
        if (typeof arrayIn[index] == "number") {
            binString += String.fromCharCode(arrayIn[index]);
        }
    }
    return window.btoa(binString);
}
function base64ToArray(b64String) {
    var binString = window.atob(b64String);
    var outArray = [];
    var length = binString.length;
    for (var index = 0; index < length;) {
        outArray.push(binString.charCodeAt(index++) & 0xFF);
    }
    return outArray;
}