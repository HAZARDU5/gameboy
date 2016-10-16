import io from '../io';

export default {
    GameBoyGyroSignalHandler(e) {
        if (io.GameBoyEmulatorInitialized() && io.GameBoyEmulatorPlaying()) {
            /** @namespace e.gamma */
            /** @namespace e.beta */
            if (e.gamma || e.beta) {
                io.gameboy.GyroEvent(e.gamma * Math.PI / 180, e.beta * Math.PI / 180);
            }
            else {
                io.gameboy.GyroEvent(e.x, e.y);
            }
            try {
                e.preventDefault();
            }
            catch (error) {
            }
        }
    },
    //Call this when resizing the canvas:
    initNewCanvasSize() {
        if (io.GameBoyEmulatorInitialized()) {
            if (!io.settings[12]) {
                if (io.gameboy.onscreenWidth != 160 || io.gameboy.onscreenHeight != 144) {
                    io.gameboy.initLCD();
                }
            }
            else {
                if (io.gameboy.onscreenWidth != io.gameboy.canvas.clientWidth || io.gameboy.onscreenHeight != io.gameboy.canvas.clientHeight) {
                    io.gameboy.initLCD();
                }
            }
        }
    }
}