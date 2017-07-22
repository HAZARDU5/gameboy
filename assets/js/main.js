AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.
    init: function () {
        // Called on scene initialization.

        //do stuff here after scene initializes

        var self = this;

        var scene = document.querySelector('a-scene');
        var mainCanvas = document.getElementById("mainCanvas");

        scene.addEventListener('loaded',function(){

            //start(mainCanvas, window.atob(datauri));


        }.bind(this));
    },

    tick: function (t, dt) {
        //console.log(self.camera.getAttribute('position'));

    }
    // Other handlers and methods.
});



