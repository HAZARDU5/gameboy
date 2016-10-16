export default {
    //Wrapper for localStorage getItem, so that data can be retrieved in various types.
    findValue(key) {
        try {
            if (window.localStorage.getItem(key) != null) {
                return JSON.parse(window.localStorage.getItem(key));
            }
        }
        catch (error) {
            //An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
            if (window.globalStorage[location.hostname].getItem(key) != null) {
                return JSON.parse(window.globalStorage[location.hostname].getItem(key));
            }
        }
        return null;
    },
    //Wrapper for localStorage setItem, so that data can be set in various types.
    setValue(key, value) {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        }
        catch (error) {
            //An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
            window.globalStorage[location.hostname].setItem(key, JSON.stringify(value));
        }
    },
    //Wrapper for localStorage removeItem, so that data can be set in various types.
    deleteValue(key) {
        try {
            window.localStorage.removeItem(key);
        }
        catch (error) {
            //An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
            window.globalStorage[location.hostname].removeItem(key);
        }
    },
    checkStorageLength() {
        try {
            return window.localStorage.length;
        }
        catch (error) {
            //An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
            return window.globalStorage[location.hostname].length;
        }
    },
    getLocalStorageKeys() {
        var storageLength = this.checkStorageLength();
        var keysFound = [];
        var index = 0;
        var nextKey = null;
        while (index < storageLength) {
            nextKey = findKey(index++);
            if (nextKey !== null && nextKey.length > 0) {
                if (nextKey.substring(0, 5) == "SRAM_" || nextKey.substring(0, 9) == "B64_SRAM_" || nextKey.substring(0, 7) == "FREEZE_" || nextKey.substring(0, 4) == "RTC_") {
                    keysFound.push(nextKey);
                }
            }
            else {
                break;
            }
        }
        return keysFound;
    },
    findKey(keyNum) {
        try {
            return window.localStorage.key(keyNum);
        }
        catch (error) {
            //An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
            return window.globalStorage[location.hostname].key(keyNum);
        }
    }
}