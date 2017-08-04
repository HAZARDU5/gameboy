AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.

    followingEntity: '', //ID of entity currently following the cursor
    entityOriginalAttrs: {}, //attributes of original entities before they are set to follow cursor
    targettedEntity: '',
    firstClick: true,

    init: function () {
        // Called on scene initialization.

        //do stuff here after scene initializes

        var scene = document.querySelector('a-scene');
        var mainCanvas = document.getElementById("mainCanvas");
        this.cursorEl = document.getElementById("my-cursor");
        this.gameboy = document.getElementById("gameboy");

        scene.addEventListener('loaded',function(){

            var client = new XMLHttpRequest();
            //client.open('GET', 'assets/roms/pd/geometrix/geometrix.gbc.base64.txt');
            client.open('GET', 'assets/roms/pd/tuff/tuff.gb.base64.txt');

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

            };
            client.send();

            var superHands = this.cursorEl.components['super-hands'];

            window.addEventListener('mousedown',function(e){
                superHands.onGrabStartButton();
            });

            window.addEventListener('mouseup',function(e){
                superHands.onGrabEndButton();
            });

        }.bind(this));

        this.gameboy.addEventListener('respawned',function(){
            //reset gameboy orientation
            console.log('Gameboy respawned');
        }.bind(this));


    },

    tick: function (t, dt) {

    }
    // Other handlers and methods.
});



