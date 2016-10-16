import io from '../io';

export default {
    GameBoyGyroSignalHandler(e) {
        if (io.GameBoyEmulatorInitialized() && io.GameBoyEmulatorPlaying()) {
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
    }
}