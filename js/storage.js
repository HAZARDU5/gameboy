export default {
    findValue(key) {
        if (window.localStorage.getItem(key) != null) {
            return JSON.parse(window.localStorage.getItem(key));
        }
        return null;
    },
    setValue(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));
    },
    deleteValue(key) {
        window.localStorage.removeItem(key);
    },
    checkStorageLength() {
        return window.localStorage.length;
    },
    getLocalStorageKeys() {
        var storageLength = this.checkStorageLength();
        var keysFound = [];
        var index = 0;
        var nextKey = null;
        while (index < storageLength) {
            nextKey = this.findKey(index++);
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