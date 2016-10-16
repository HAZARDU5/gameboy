import PopupMenu from './gui/popupMenu';
import windowCreate from './gui/windowCreate';
import terminal from './terminal';
import dom from './gui/dom';
import io from './io';
import handlers from './gui/handlers';
import storage from './storage';

var windowStacks = [];
var inFullscreen = false;
var mainCanvas = null;
var fullscreenCanvas = null;
var showAsMinimal = false;
var keyZones = [
    ["right", [39]],
    ["left", [37]],
    ["up", [38]],
    ["down", [40]],
    ["a", [88, 74]],
    ["b", [90, 81, 89]],
    ["select", [16]],
    ["start", [13]]
];
export default function windowingInitialize() {
    terminal.cout("windowingInitialize() called.", 0);
    windowStacks[0] = windowCreate("GameBoy", true);
    windowStacks[1] = windowCreate("terminal", false);
    windowStacks[2] = windowCreate("about", false);
    windowStacks[3] = windowCreate("settings", false);
    windowStacks[4] = windowCreate("input_select", false);
    windowStacks[5] = windowCreate("instructions", false);
    windowStacks[6] = windowCreate("local_storage_popup", false);
    windowStacks[7] = windowCreate("local_storage_listing", false);
    windowStacks[8] = windowCreate("freeze_listing", false);
    windowStacks[9] = windowCreate("save_importer", false);
    mainCanvas = document.getElementById("mainCanvas");
    fullscreenCanvas = document.getElementById("fullscreen");
    try {
        //Hook the GUI controls.
        registerGUIEvents();
    }
    catch (error) {
        terminal.cout("Fatal windowing error: \"" + error.message + "\" file:" + error.fileName + " line: " + error.lineNumber, 2);
    }
    //Update the settings to the emulator's default:
    document.getElementById("enable_sound").checked = io.settings[0];
    document.getElementById("enable_gbc_bios").checked = io.settings[1];
    document.getElementById("disable_colors").checked = io.settings[2];
    document.getElementById("rom_only_override").checked = io.settings[9];
    document.getElementById("mbc_enable_override").checked = io.settings[10];
    document.getElementById("enable_colorization").checked = io.settings[4];
    document.getElementById("do_minimal").checked = showAsMinimal;
    document.getElementById("software_resizing").checked = io.settings[12];
    document.getElementById("typed_arrays_disallow").checked = io.settings[5];
    document.getElementById("gb_boot_rom_utilized").checked = io.settings[11];
    document.getElementById("resize_smoothing").checked = io.settings[13];
    document.getElementById("channel1").checked = io.settings[14][0];
    document.getElementById("channel2").checked = io.settings[14][1];
    document.getElementById("channel3").checked = io.settings[14][2];
    document.getElementById("channel4").checked = io.settings[14][3];
}


function registerGUIEvents() {
    terminal.cout("In registerGUIEvents() : Registering GUI Events.", -1);
    dom.addEvent("click", document.getElementById("terminal_clear_button"), terminal.clear_terminal);
    dom.addEvent("click", document.getElementById("local_storage_list_refresh_button"), refreshStorageListing);
    dom.addEvent("click", document.getElementById("terminal_close_button"), function () {
        windowStacks[1].hide()
    });
    dom.addEvent("click", document.getElementById("about_close_button"), function () {
        windowStacks[2].hide()
    });
    dom.addEvent("click", document.getElementById("settings_close_button"), function () {
        windowStacks[3].hide()
    });
    dom.addEvent("click", document.getElementById("input_select_close_button"), function () {
        windowStacks[4].hide()
    });
    dom.addEvent("click", document.getElementById("instructions_close_button"), function () {
        windowStacks[5].hide()
    });
    dom.addEvent("click", document.getElementById("local_storage_list_close_button"), function () {
        windowStacks[7].hide()
    });
    dom.addEvent("click", document.getElementById("local_storage_popup_close_button"), function () {
        windowStacks[6].hide()
    });
    dom.addEvent("click", document.getElementById("save_importer_close_button"), function () {
        windowStacks[9].hide()
    });
    dom.addEvent("click", document.getElementById("freeze_list_close_button"), function () {
        windowStacks[8].hide()
    });
    dom.addEvent("click", document.getElementById("GameBoy_about_menu"), function () {
        windowStacks[2].show()
    });
    dom.addEvent("click", document.getElementById("GameBoy_settings_menu"), function () {
        windowStacks[3].show()
    });
    dom.addEvent("click", document.getElementById("local_storage_list_menu"), function () {
        refreshStorageListing();
        windowStacks[7].show();
    });
    dom.addEvent("click", document.getElementById("freeze_list_menu"), function () {
        refreshFreezeListing();
        windowStacks[8].show();
    });
    dom.addEvent("click", document.getElementById("view_importer"), function () {
        windowStacks[9].show()
    });
    dom.addEvent("keydown", document, keyDown);
    dom.addEvent("keyup", document, function (event) {
        if (event.keyCode == 27) {
            //Fullscreen on/off
            fullscreenPlayer();
        }
        else {
            //Control keys / other
            keyUp(event);
        }
    });
    dom.addEvent("MozOrientation", window, handlers.GameBoyGyroSignalHandler);
    dom.addEvent("deviceorientation", window, handlers.GameBoyGyroSignalHandler);
    new PopupMenu(document.getElementById("GameBoy_file_menu"), document.getElementById("GameBoy_file_popup"));
    dom.addEvent("click", document.getElementById("data_uri_clicker"), function () {
        var datauri = prompt("Please input the ROM image's Base 64 Encoded Text:", "");
        if (datauri != null && datauri.length > 0) {
            try {
                terminal.cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
                initPlayer();
                start(mainCanvas, window.atob(datauri));
            }
            catch (error) {
                terminal.cout(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
            }
        }
    });
    dom.addEvent("click", document.getElementById("set_volume"), function () {
        if (io.GameBoyEmulatorInitialized()) {
            var volume = prompt("Set the volume here:", "1.0");
            if (volume != null && volume.length > 0) {
                io.settings[3] = Math.min(Math.max(parseFloat(volume), 0), 1);
                io.gameboy.changeVolume();
            }
        }
    });
    dom.addEvent("click", document.getElementById("set_speed"), function () {
        if (io.GameBoyEmulatorInitialized()) {
            var speed = prompt("Set the emulator speed here:", "1.0");
            if (speed != null && speed.length > 0) {
                io.gameboy.setSpeed(Math.max(parseFloat(speed), 0.001));
            }
        }
    });
    dom.addEvent("click", document.getElementById("internal_file_clicker"), function () {
        var file_opener = document.getElementById("local_file_open");
        windowStacks[4].show();
        file_opener.click();
    });
    dom.addEvent("blur", document.getElementById("input_select"), function () {
        windowStacks[4].hide();
    });
    dom.addEvent("change", document.getElementById("local_file_open"), function () {
        windowStacks[4].hide();
        if (typeof this.files != "undefined") {
            try {
                if (this.files.length >= 1) {
                    terminal.cout("Reading the local file \"" + this.files[0].name + "\"", 0);
                    try {
                        //Gecko 1.9.2+ (Standard Method)
                        var binaryHandle = new FileReader();
                        binaryHandle.onload = function () {
                            if (this.readyState == 2) {
                                terminal.cout("file loaded.", 0);
                                //todo: remover esse comentário
                                //try {
                                initPlayer();
                                io.start(mainCanvas, this.result);
                                //}
                                //catch (error) {
                                //    terminal.cout(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
                                //}
                            }
                            else {
                                terminal.cout("loading file, please wait...", 0);
                            }
                        }
                        binaryHandle.readAsBinaryString(this.files[this.files.length - 1]);
                    }
                    catch (error) {
                        terminal.cout("Browser does not support the FileReader object, falling back to the non-standard File object access,", 2);
                        //Gecko 1.9.0, 1.9.1 (Non-Standard Method)
                        var romImageString = this.files[this.files.length - 1].getAsBinary();
                        try {
                            initPlayer();
                            io.start(mainCanvas, romImageString);
                        }
                        catch (error) {
                            terminal.cout(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
                        }

                    }
                }
                else {
                    terminal.cout("Incorrect number of files selected for local loading.", 1);
                }
            }
            catch (error) {
                terminal.cout("Could not load in a locally stored ROM file.", 2);
            }
        }
        else {
            terminal.cout("could not find the handle on the file to open.", 2);
        }
    });
    dom.addEvent("change", document.getElementById("save_open"), function () {
        windowStacks[9].hide();
        if (typeof this.files != "undefined") {
            try {
                if (this.files.length >= 1) {
                    terminal.cout("Reading the local file \"" + this.files[0].name + "\" for importing.", 0);
                    try {
                        //Gecko 1.9.2+ (Standard Method)
                        var binaryHandle = new FileReader();
                        binaryHandle.onload = function () {
                            if (this.readyState == 2) {
                                terminal.cout("file imported.", 0);
                                try {
                                    io.import_save(this.result);
                                    refreshStorageListing();
                                }
                                catch (error) {
                                    terminal.cout(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
                                }
                            }
                            else {
                                terminal.cout("importing file, please wait...", 0);
                            }
                        }
                        binaryHandle.readAsBinaryString(this.files[this.files.length - 1]);
                    }
                    catch (error) {
                        terminal.cout("Browser does not support the FileReader object, falling back to the non-standard File object access,", 2);
                        //Gecko 1.9.0, 1.9.1 (Non-Standard Method)
                        var romImageString = this.files[this.files.length - 1].getAsBinary();
                        try {
                            io.import_save(romImageString);
                            refreshStorageListing();
                        }
                        catch (error) {
                            terminal.cout(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
                        }

                    }
                }
                else {
                    terminal.cout("Incorrect number of files selected for local loading.", 1);
                }
            }
            catch (error) {
                terminal.cout("Could not load in a locally stored ROM file.", 2);
            }
        }
        else {
            terminal.cout("could not find the handle on the file to open.", 2);
        }
    });
    dom.addEvent("click", document.getElementById("restart_cpu_clicker"), function () {
        if (io.GameBoyEmulatorInitialized()) {
            try {
                if (!io.gameboy.fromSaveState) {
                    initPlayer();
                    io.start(mainCanvas, io.gameboy.getROMImage());
                }
                else {
                    initPlayer();
                    io.openState(io.gameboy.savedStateFileName, mainCanvas);
                }
            }
            catch (error) {
                terminal.cout(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
            }
        }
        else {
            terminal.cout("Could not restart, as a previous emulation session could not be found.", 1);
        }
    });
    dom.addEvent("click", document.getElementById("run_cpu_clicker"), function () {
        io.run();
    });
    dom.addEvent("click", document.getElementById("kill_cpu_clicker"), function () {
        io.pause();
    });
    dom.addEvent("click", document.getElementById("save_state_clicker"), function () {
        io.save();
    });
    dom.addEvent("click", document.getElementById("save_SRAM_state_clicker"), function () {
        io.saveSRAM();
    });
    dom.addEvent("click", document.getElementById("enable_sound"), function () {
        io.settings[0] = document.getElementById("enable_sound").checked;
        if (io.GameBoyEmulatorInitialized()) {
            io.gameboy.initSound();
        }
    });
    dom.addEvent("click", document.getElementById("disable_colors"), function () {
        io.settings[2] = document.getElementById("disable_colors").checked;
    });
    dom.addEvent("click", document.getElementById("rom_only_override"), function () {
        io.settings[9] = document.getElementById("rom_only_override").checked;
    });
    dom.addEvent("click", document.getElementById("mbc_enable_override"), function () {
        io.settings[10] = document.getElementById("mbc_enable_override").checked;
    });
    dom.addEvent("click", document.getElementById("enable_gbc_bios"), function () {
        io.settings[1] = document.getElementById("enable_gbc_bios").checked;
    });
    dom.addEvent("click", document.getElementById("enable_colorization"), function () {
        io.settings[4] = document.getElementById("enable_colorization").checked;
    });
    dom.addEvent("click", document.getElementById("do_minimal"), function () {
        showAsMinimal = document.getElementById("do_minimal").checked;
        fullscreenCanvas.className = (showAsMinimal) ? "minimum" : "maximum";
    });
    dom.addEvent("click", document.getElementById("software_resizing"), function () {
        io.settings[12] = document.getElementById("software_resizing").checked;
        if (io.GameBoyEmulatorInitialized()) {
            io.gameboy.initLCD();
        }
    });
    dom.addEvent("click", document.getElementById("typed_arrays_disallow"), function () {
        io.settings[5] = document.getElementById("typed_arrays_disallow").checked;
    });
    dom.addEvent("click", document.getElementById("gb_boot_rom_utilized"), function () {
        io.settings[11] = document.getElementById("gb_boot_rom_utilized").checked;
    });
    dom.addEvent("click", document.getElementById("resize_smoothing"), function () {
        io.settings[13] = document.getElementById("resize_smoothing").checked;
        if (io.GameBoyEmulatorInitialized()) {
            io.gameboy.initLCD();
        }
    });
    dom.addEvent("click", document.getElementById("channel1"), function () {
        io.settings[14][0] = document.getElementById("channel1").checked;
    });
    dom.addEvent("click", document.getElementById("channel2"), function () {
        io.settings[14][1] = document.getElementById("channel2").checked;
    });
    dom.addEvent("click", document.getElementById("channel3"), function () {
        io.settings[14][2] = document.getElementById("channel3").checked;
    });
    dom.addEvent("click", document.getElementById("channel4"), function () {
        io.settings[14][3] = document.getElementById("channel4").checked;
    });
    dom.addEvent("click", document.getElementById("view_fullscreen"), fullscreenPlayer);
    new PopupMenu(document.getElementById("GameBoy_view_menu"), document.getElementById("GameBoy_view_popup"));
    dom.addEvent("click", document.getElementById("view_terminal"), function () {
        windowStacks[1].show()
    });
    dom.addEvent("click", document.getElementById("view_instructions"), function () {
        windowStacks[5].show()
    });
    dom.addEvent("mouseup", document.getElementById("gfx"), handlers.initNewCanvasSize);
    dom.addEvent("resize", window, handlers.initNewCanvasSize);
    dom.addEvent("unload", window, function () {
        io.autoSave();
    });
}
function keyDown(event) {
    var keyCode = event.keyCode;
    var keyMapLength = keyZones.length;
    for (var keyMapIndex = 0; keyMapIndex < keyMapLength; ++keyMapIndex) {
        var keyCheck = keyZones[keyMapIndex];
        var keysMapped = keyCheck[1];
        var keysTotal = keysMapped.length;
        for (var index = 0; index < keysTotal; ++index) {
            if (keysMapped[index] == keyCode) {
                io.GameBoyKeyDown(keyCheck[0]);
                try {
                    event.preventDefault();
                }
                catch (error) {
                }
            }
        }
    }
}
function keyUp(event) {
    var keyCode = event.keyCode;
    var keyMapLength = keyZones.length;
    for (var keyMapIndex = 0; keyMapIndex < keyMapLength; ++keyMapIndex) {
        var keyCheck = keyZones[keyMapIndex];
        var keysMapped = keyCheck[1];
        var keysTotal = keysMapped.length;
        for (var index = 0; index < keysTotal; ++index) {
            if (keysMapped[index] == keyCode) {
                io.GameBoyKeyUp(keyCheck[0]);
                try {
                    event.preventDefault();
                }
                catch (error) {
                }
            }
        }
    }
}
function initPlayer() {
    document.getElementById("title").style.display = "none";
    document.getElementById("port_title").style.display = "none";
    document.getElementById("fullscreenContainer").style.display = "none";
}
function fullscreenPlayer() {
    if (io.GameBoyEmulatorInitialized()) {
        if (!inFullscreen) {
            io.gameboy.canvas = fullscreenCanvas;
            fullscreenCanvas.className = (showAsMinimal) ? "minimum" : "maximum";
            document.getElementById("fullscreenContainer").style.display = "block";
            windowStacks[0].hide();
        }
        else {
            io.gameboy.canvas = mainCanvas;
            document.getElementById("fullscreenContainer").style.display = "none";
            windowStacks[0].show();
        }
        io.gameboy.initLCD();
        inFullscreen = !inFullscreen;
    }
    else {
        terminal.cout("Cannot go into fullscreen mode.", 2);
    }
}
function runFreeze(keyName) {
    try {
        windowStacks[8].hide();
        initPlayer();
        openState(keyName, mainCanvas);
    }
    catch (error) {
        terminal.cout("A problem with attempting to open the selected save state occurred.", 2);
    }
}
function outputLocalStorageLink(keyName, dataFound, downloadName) {
    return generateDownloadLink("data:application/octet-stream;base64," + dataFound, keyName, downloadName);
}
function refreshFreezeListing() {
    var storageListMasterDivSub = document.getElementById("freezeListingMasterContainerSub");
    var storageListMasterDiv = document.getElementById("freezeListingMasterContainer");
    storageListMasterDiv.removeChild(storageListMasterDivSub);
    storageListMasterDivSub = document.createElement("div");
    storageListMasterDivSub.id = "freezeListingMasterContainerSub";
    var keys = storage.getLocalStorageKeys();
    while (keys.length > 0) {
        var key = keys.shift();
        if (key.substring(0, 7) == "FREEZE_") {
            storageListMasterDivSub.appendChild(outputFreezeStateRequestLink(key));
        }
    }
    storageListMasterDiv.appendChild(storageListMasterDivSub);
}
function outputFreezeStateRequestLink(keyName) {
    var linkNode = generateLink("javascript:runFreeze(\"" + keyName + "\")", keyName);
    var storageContainerDiv = document.createElement("div");
    storageContainerDiv.className = "storageListingContainer";
    storageContainerDiv.appendChild(linkNode)
    return storageContainerDiv;
}
function refreshStorageListing() {
    var storageListMasterDivSub = document.getElementById("storageListingMasterContainerSub");
    var storageListMasterDiv = document.getElementById("storageListingMasterContainer");
    storageListMasterDiv.removeChild(storageListMasterDivSub);
    storageListMasterDivSub = document.createElement("div");
    storageListMasterDivSub.id = "storageListingMasterContainerSub";
    var keys = storage.getLocalStorageKeys();
    var blobPairs = [];
    for (var index = 0; index < keys.length; ++index) {
        blobPairs[index] = getBlobPreEncoded(keys[index]);
        storageListMasterDivSub.appendChild(outputLocalStorageRequestLink(keys[index]));
    }
    storageListMasterDiv.appendChild(storageListMasterDivSub);
    var linkToManipulate = document.getElementById("download_local_storage_dba");
    linkToManipulate.href = "data:application/octet-stream;base64," + window.btoa(io.generateMultiBlob(blobPairs));
    linkToManipulate.download = "gameboy_color_saves.export";
}
function getBlobPreEncoded(keyName) {
    if (keyName.substring(0, 9) == "B64_SRAM_") {
        return [keyName.substring(4), window.atob(storage.findValue(keyName))];
    }
    else if (keyName.substring(0, 5) == "SRAM_") {
        return [keyName, convertToBinary(storage.findValue(keyName))];
    }
    else {
        return [keyName, JSON.stringify(storage.findValue(keyName))];
    }
}
window.outputLocalStorageRequestLink = function(keyName) {
    var linkNode = generateLink("javascript:popupStorageDialog(\"" + keyName + "\")", keyName);
    var storageContainerDiv = document.createElement("div");
    storageContainerDiv.className = "storageListingContainer";
    storageContainerDiv.appendChild(linkNode)
    return storageContainerDiv;
}
function popupStorageDialog(keyName) {
    var subContainer = document.getElementById("storagePopupMasterContainer");
    var parentContainer = document.getElementById("storagePopupMasterParent");
    parentContainer.removeChild(subContainer);
    subContainer = document.createElement("div");
    subContainer.id = "storagePopupMasterContainer";
    parentContainer.appendChild(subContainer);
    var downloadDiv = document.createElement("div");
    downloadDiv.id = "storagePopupDownload";

    var downloadDiv2;

    if (keyName.substring(0, 9) == "B64_SRAM_") {
        downloadDiv2 = document.createElement("div");
        downloadDiv2.id = "storagePopupDownloadRAW";
        downloadDiv2.appendChild(outputLocalStorageLink("Download RAW save data.", storage.findValue(keyName), keyName));
        subContainer.appendChild(downloadDiv2);
        downloadDiv.appendChild(outputLocalStorageLink("Download in import compatible format.", window.btoa(generateBlob(keyName.substring(4), window.atob(storage.findValue(keyName)))), keyName));
    }
    else if (keyName.substring(0, 5) == "SRAM_") {
        downloadDiv2 = document.createElement("div");
        downloadDiv2.id = "storagePopupDownloadRAW";
        downloadDiv2.appendChild(outputLocalStorageLink("Download RAW save data.", window.btoa(convertToBinary(storage.findValue(keyName))), keyName));
        subContainer.appendChild(downloadDiv2);
        downloadDiv.appendChild(outputLocalStorageLink("Download in import compatible format.", window.btoa(generateBlob(keyName, convertToBinary(storage.findValue(keyName)))), keyName));
    }
    else {
        downloadDiv.appendChild(outputLocalStorageLink("Download in import compatible format.", window.btoa(generateBlob(keyName, JSON.stringify(storage.findValue(keyName)))), keyName));
    }
    var deleteLink = generateLink("javascript:deleteStorageSlot(\"" + keyName + "\")", "Delete data item from HTML5 local storage.");
    deleteLink.id = "storagePopupDelete";
    subContainer.appendChild(downloadDiv);
    subContainer.appendChild(deleteLink);
    windowStacks[6].show();
}
function convertToBinary(jsArray) {
    var length = jsArray.length;
    var binString = "";
    for (var indexBin = 0; indexBin < length; indexBin++) {
        binString += String.fromCharCode(jsArray[indexBin]);
    }
    return binString;
}
function deleteStorageSlot(keyName) {
    storage.deleteValue(keyName);
    windowStacks[6].hide();
    refreshStorageListing();
}
function generateLink(address, textData) {
    var link = document.createElement("a");
    link.href = address;
    link.appendChild(document.createTextNode(textData));
    return link;
}
function generateDownloadLink(address, textData, keyName) {
    var link = generateLink(address, textData);
    link.download = keyName + ".sav";
    return link;
}