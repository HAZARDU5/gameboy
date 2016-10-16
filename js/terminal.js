class Terminal {
    contructor(){
        this.DEBUG_MESSAGES = true;
        this.DEBUG_WINDOWING = true;
    }
    cout(message, colorIndex) {
        var terminal_output = document.getElementById("terminal_output");
        if ((colorIndex != 0 || this.DEBUG_MESSAGES) && (colorIndex != -1 || this.DEBUG_WINDOWING)) {
            var lineout = document.createElement('span');
            lineout.appendChild(document.createTextNode(message));
            switch (colorIndex) {
                case -1:
                case 0:
                    lineout.className = "white";
                    break;
                case 1:
                    lineout.className = "yellow";
                    break;
                case 2:
                    lineout.className = "red";
            }
            terminal_output.appendChild(lineout);
            terminal_output.appendChild(document.createElement('br'));
            terminal_output.scrollTop = terminal_output.scrollHeight - terminal_output.clientHeight;
            console.log(message);
        }
    }

    static clear_terminal() {
        var terminal_output = document.getElementById("terminal_output");
        while (terminal_output.firstChild != null) {
            terminal_output.removeChild(terminal_output.firstChild);
        }
    }
}
export default (new Terminal())