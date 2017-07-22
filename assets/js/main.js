AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.
    init: function () {
        // Called on scene initialization.

        //do stuff here after scene initializes

        var self = this;

        var scene = document.querySelector('a-scene');
        var mainCanvas = document.getElementById("mainCanvas");

        scene.addEventListener('loaded',function(){



            var client = new XMLHttpRequest();
            client.open('GET', 'assets/roms/pd/geometrix/geometrix.gbc.base64.txt');
            //client.open('GET', 'assets/roms/commercial/super-mario-land/super-mario-land.gb.base64.txt');
            client.onreadystatechange = function() {

                var datauri = client.responseText;

                if (datauri != null && datauri.length > 0) {
                    try {
                        cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
                        initPlayer();
                        start(mainCanvas, window.atob(datauri));
                    }
                    catch (error) {
                        console.error(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
                    }
                }

                //alert(client.responseText);
                //console.log('Loaded: ',client.responseText);

            };
            client.send();




        }.bind(this));
    },

    tick: function (t, dt) {
        //console.log(self.camera.getAttribute('position'));

    }
    // Other handlers and methods.
});



