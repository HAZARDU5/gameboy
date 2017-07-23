AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.

    followingEntity: '', //ID of entity currently following the cursor
    entityOriginalAttrs: {}, //attributes of original entities before they are set to follow cursor
    targettedEntity: '',

    init: function () {
        // Called on scene initialization.

        //do stuff here after scene initializes

        var self = this;

        var scene = document.querySelector('a-scene');
        var mainCanvas = document.getElementById("mainCanvas");
        this.cursorEl = document.getElementById("my-cursor");
        this.gameboy = document.getElementById("gameboy");
        this.gameboyCollider = document.querySelector("#gameboy .collider");

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

            var colliderEls = AFRAME.utils.styleParser.parse(self.cursorEl.getAttribute('sphere-collider')).objects.split(',');

            //console.log('Els: ',colliderEls)

            for(var i = 0; i < colliderEls.length; i++){
                var el = document.querySelector(colliderEls[i]);

                el.addEventListener('hit',function(e){

                    //console.log('hit', e.target);

                    var targetEl = (e.target.parentNode !== self.el.sceneEl) ? e.target.parentNode : e.target;
                    self.cursorEl.setAttribute('material','opacity',0);

                    //console.log(targetEl);

                    //if(targetEl.object3D){
                        self.targettedEntity = targetEl.getAttribute('id');
                    //}

                    //console.log('Targetted: ',self.targettedEntity);
                });
            }


        }.bind(this));

        window.addEventListener('mouseup',function(e){

            //console.log('clicked: ',this.targettedEntity);
            if(this.targettedEntity !== ''){
                var targetEl = document.querySelector('#'+this.targettedEntity);
                var colliderEl = document.querySelector('#'+this.targettedEntity+' .collider');
                switch (this.targettedEntity){
                    case 'gameboy':
                        this.toggleEntityFollowCursor(this.targettedEntity,targetEl,colliderEl);
                        break;
                    case 'collision-table':
                    case 'collision-floor':

                        this.entityUnfollowCursor('gameboy',self.gameboy,self.gameboyCollider);
                        break;
                    default:
                        //do nothing
                        break;
                }
            }
        }.bind(this));

    },

    toggleEntityFollowCursor: function(id,entity,colliderEl){
        //console.log('toggling');
        if(id === this.followingEntity){
            this.entityUnfollowCursor(id,entity,colliderEl);
        }else{
            this.entityFollowCursor(id,entity,colliderEl);
        }
    },

    entityFollowCursor: function(id,entity,colliderEl){
        //if(this.followingEntity !== id){
            //console.log(id+' is now following cursor');
            this.followingEntity = id;
            this.entityOriginalAttrs[id] = {
                'grabbable': entity.getAttribute('grabbable'),
                'dynamic-body': entity.getAttribute('dynamic-body')
            };
            entity.removeAttribute('grabbable');
            entity.removeAttribute('dynamic-body');
            entity.setAttribute('look-at','#camera');
            entity.setAttribute('follow','target','#my-cursor');
            colliderEl.classList.add('ignore-ray');
            //this.cursor.removeAttribute('sphere-collider');
        //}


        //console.log(this.followingEntity);
    },

    entityUnfollowCursor: function(id,entity,colliderEl){

        //console.log(id+' is now unfollowing cursor');
        this.followingEntity = '';
        this.targettedEntity = '';
        if(this.entityOriginalAttrs[id]){
            entity.setAttribute('grabbable',this.entityOriginalAttrs[id]['grabbable']);
            entity.setAttribute('dynamic-body',this.entityOriginalAttrs[id]['dynamic-body']);
        }

        entity.removeAttribute('follow');
        entity.removeAttribute('look-at');
        this.cursorEl.setAttribute('material','opacity',1);
        colliderEl.classList.remove('ignore-ray');
    },

    tick: function (t, dt) {
        //console.log(self.camera.getAttribute('position'));


    }
    // Other handlers and methods.
});



