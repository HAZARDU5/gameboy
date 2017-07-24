var ACCEL_G = -9.8, // m/s^2
    EASING = -15; // m/s^2

/**
 * Gladeye Jump ability.
 */
AFRAME.registerComponent('drop-sounds', {
    dependencies: ['velocity'],

    /* Schema
     ——————————————————————————————————————————————*/

    schema: {
        distance: { default: 5 },
        soundLand: { type: 'array', default: [] },
        soundFalling: { type: 'array', default: [] },
        debug: { default: false },
        positional: { default: true }
    },

    init: function () {
        this.bindings = {};
        this.bindings.collide = this.onCollide.bind(this);
        this.el.addEventListener('collide', this.bindings.collide);
    },

    remove: function () {
        for (var event in this.bindings) {
            if (this.bindings.hasOwnProperty(event)) {
                this.el.removeEventListener(event, this.bindings[event]);
                delete this.bindings[event];
            }
        }
        this.el.removeEventListener('collide', this.bindings.collide);
        delete this.bindings.collide;
    },

    onCollide: function () {
        this.playLandSound();
    },

    playLandSound: function() {

        if(this.data.soundLand.length >= 1){
            var soundArray = this.data.soundLand;
            var randomKey = Math.floor(Math.random() * (soundArray.length - 1 + 1)) + 0;

            this.el.setAttribute('sound',
                {
                    src: soundArray[randomKey],
                    positional: this.data.positional
                }
            );

            this.el.components.sound.playSound();
        }
    },

    tick: function(){

    }

});