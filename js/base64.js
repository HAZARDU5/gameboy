export default {
    to_little_endian_dword (str) {
        return this.to_little_endian_word(str) + this.to_little_endian_word(str >> 16);
    },

    to_little_endian_word(str) {
        return this.to_byte(str) + this.to_byte(str >> 8);
    },

    to_byte(str) {
        return String.fromCharCode(str & 0xFF);
    },

    arrayToBase64(array) {
        var binString = "";
        var length = array.length;
        for (var index = 0; index < length; ++index) {
            if (typeof array[index] == "number") {
                binString += String.fromCharCode(array[index]);
            }
        }
        return window.btoa(binString);
    },

    base64ToArray(b64String) {
        var binString = window.atob(b64String);
        var outArray = [];
        var length = binString.length;
        for (var index = 0; index < length;) {
            outArray.push(binString.charCodeAt(index++) & 0xFF);
        }
        return outArray;
    }
}