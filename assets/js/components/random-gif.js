AFRAME.registerComponent('random-gif', {
    schema: {
        srcs: {type: 'array', required: true},
        interval: {type: 'int', default: 300}
    },

    timeCount: 0,

    init: function () {

    },
    tick: function (time, timeDelta) {
        if(this.timeCount > this.data.interval){
            this.el.setAttribute('material','src:url('+this.getRandomImage()+')');
            this.timeCount = 0;
        }else{
            this.timeCount++;
        }
    },

    getRandomImage: function(){
        var rnd = Math.round(Math.random()*(this.data.srcs.length-1));
        return this.data.srcs[rnd];
    }
});