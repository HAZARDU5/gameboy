import WindowStack from './windowStack';

export default function windowCreate(sId, bShow) {
    var oWindow = new WindowStack(document.getElementById(sId));
    if (bShow) {
        oWindow.show();
    }
    return oWindow;
}