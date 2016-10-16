import terminal from '../terminal'

export default {
    addEvent: function (sEvent, oElement, fListener) {
        try {
            oElement.addEventListener(sEvent, fListener, false);
            terminal.cout("In addEvent() : Standard addEventListener() called to add a(n) \"" + sEvent + "\" event.", -1);
        }
        catch (error) {
            oElement.attachEvent("on" + sEvent, fListener);	//Pity for IE.
            terminal.cout("In addEvent() : Nonstandard attachEvent() called to add an \"on" + sEvent + "\" event.", -1);
        }
    },
    removeEvent: function (sEvent, oElement, fListener) {
        try {
            oElement.removeEventListener(sEvent, fListener, false);
            terminal.cout("In removeEvent() : Standard removeEventListener() called to remove a(n) \"" + sEvent + "\" event.", -1);
        }
        catch (error) {
            oElement.detachEvent("on" + sEvent, fListener);	//Pity for IE.
            terminal.cout("In removeEvent() : Nonstandard detachEvent() called to remove an \"on" + sEvent + "\" event.", -1);
        }
    },
    isDescendantOf(ParentElement, toCheck) {
        var _this = this;
        if (!ParentElement || !toCheck) {
            return false;
        }
        //Verify an object as either a direct or indirect child to another object.
        function traverseTree(domElement) {
            while (domElement != null) {
                if (domElement.nodeType == 1) {
                    if (_this.isSameNode(domElement, toCheck)) {
                        return true;
                    }
                    if (_this.hasChildNodes(domElement)) {
                        if (traverseTree(domElement.firstChild)) {
                            return true;
                        }
                    }
                }
                domElement = domElement.nextSibling;
            }
            return false;
        }

        return traverseTree(ParentElement.firstChild);
    },
    hasChildNodes(oElement) {
        return (typeof oElement.hasChildNodes == "function") ? oElement.hasChildNodes() : ((oElement.firstChild != null));
    },
    isSameNode(oCheck1, oCheck2) {
        return (typeof oCheck1.isSameNode == "function") ? oCheck1.isSameNode(oCheck2) : (oCheck1 === oCheck2);
    },
    pageXCoord(event) {
        if (typeof event.pageX == "undefined") {
            return event.clientX + document.documentElement.scrollLeft;
        }
        return event.pageX;
    },
    pageYCoord(event) {
        if (typeof event.pageY == "undefined") {
            return event.clientY + document.documentElement.scrollTop;
        }
        return event.pageY;
    },
    mouseLeaveVerify(oElement, event) {
        //Hook target element with onmouseout and use this function to verify onmouseleave.
        return this.isDescendantOf(oElement, (typeof event.target != "undefined") ? event.target : event.srcElement) && !this.isDescendantOf(oElement, (typeof event.relatedTarget != "undefined") ? event.relatedTarget : event.toElement);
    },
    mouseEnterVerify(oElement, event) {
        //Hook target element with onmouseover and use this function to verify onmouseenter.
        return !this.isDescendantOf(oElement, (typeof event.target != "undefined") ? event.target : event.srcElement) && this.isDescendantOf(oElement, (typeof event.relatedTarget != "undefined") ? event.relatedTarget : event.fromElement);
    }
}