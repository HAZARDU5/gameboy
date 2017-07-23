AFRAME.registerComponent('auto-fall-respawn', {
    schema: {
        fallHeight: {type: 'int', default: -50},
        respawnPosition: {type: 'vec3', default: {x: 0, y: 20, z: 0}}
    },

    init: function() {
        this.originalDynamicBody = this.el.getAttribute('dynamic-body');
    },

    tick: function() {

        var position = this.el.object3D.position;

        //console.log(position.y,this.data.fallHeight);

        if(position.y < this.data.fallHeight){
            this.el.removeAttribute('dynamic-body');
            this.el.setAttribute('position',this.data.respawnPosition);
            this.el.object3D.rotation = new THREE.Vector3(0, 0, Math.PI / 2);
            //this.el.setAttribute('rotation','0 0 180');

            setTimeout(function(){

                this.el.setAttribute('dynamic-body',this.originalDynamicBody);
            }.bind(this),250)
        }
    }
});