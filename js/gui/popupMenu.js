import dom from './dom';

export default class PopupMenu {
    constructor(oClick, oMenu) {
        this.clickElement = oClick;
        this.menuElement = oMenu;
        var thisObj2 = this;
        this.eventHandle = [
            function (event) {
                thisObj2.startPopup(event);
            },
            function (event) {
                thisObj2.endPopup(event);
            }
        ];
        this.open = false;
        dom.addEvent("click", this.clickElement, this.eventHandle[0]);
    }

    startPopup(event) {
        if (!this.open) {
            this.open = true;
            this.menuElement.style.display = "block";
            dom.removeEvent("click", this.clickElement, this.eventHandle[0]);
            this.position(event);
            dom.addEvent("mouseout", this.menuElement, this.eventHandle[1]);
        }
    }

    endPopup(event) {
        if (this.open) {
            if (dom.mouseLeaveVerify(this.menuElement, event)) {
                this.open = false;
                this.menuElement.style.display = "none";
                dom.removeEvent("mouseout", this.menuElement, this.eventHandle[1]);
                dom.addEvent("click", this.clickElement, this.eventHandle[0]);
            }
        }
    }

    position(event) {
        if (this.open) {
            this.menuElement.style.left = (dom.pageXCoord(event) - 5) + "px";
            this.menuElement.style.top = (dom.pageYCoord(event) - 5) + "px";
        }
    }
}