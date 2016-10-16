require('../css/GameBoy.scss');

import windowingInitialize from './gui';
import terminal from './terminal';

terminal.DEBUG_MESSAGES = false;
terminal.DEBUG_WINDOWING = false;

window.onload = function () {
    windowingInitialize();
}