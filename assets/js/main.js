AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.

    followingEntity: '', //ID of entity currently following the cursor
    entityOriginalAttrs: {}, //attributes of original entities before they are set to follow cursor
    targettedEntity: '',
    firstClick: true,

    init: function () {
        // Called on scene initialization.

        //do stuff here after scene initializes

        var self = this;

        var scene = document.querySelector('a-scene');
        var mainCanvas = document.getElementById("mainCanvas");
        this.cursorEl = document.getElementById("my-cursor");
        this.gameboy = document.getElementById("gameboy");
        this.tvScreen = document.getElementById("tv-screen");
        this.gameboyCollider = document.querySelector("#gameboy .collider");


        scene.addEventListener('loaded',function(){



            var client = new XMLHttpRequest();
            //client.open('GET', 'assets/roms/pd/geometrix/geometrix.gbc.base64.txt');
            client.open('GET', 'assets/roms/commercial/super-mario-land/super-mario-land.gb.base64.txt');
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

                //console.log('Added collider to: ',el.getAttribute('id'));

                el.addEventListener('hit',function(e){

                    //console.log('hit', e.target);

                    var targetEl = (e.target.parentNode !== self.el.sceneEl) ? e.target.parentNode : e.target;


                    //console.log('targetEl: ',targetEl);

                    //if(targetEl.object3D){
                    //if(!self.followingEntity){
                        self.targettedEntity = targetEl.getAttribute('id');
                    //}


                    /*if(self.targettedEntity === 'gameboy'){
                        self.cursorEl.setAttribute('material','opacity',0.5);
                    }else{
                        self.cursorEl.setAttribute('material','opacity',1);
                    }*/
                    //}

                    //console.log('Targetted: ',self.targettedEntity);
                });
            }

            //this.entityUnfollowCursor('gameboy',this.gameboy,this.gameboyCollider);

            /*setTimeout(function(){
                this.giphyTVEl = document.querySelector('#asdf-draggable-gif');

                setInterval(function(){
                    console.log('src: ',this.giphyTVEl.getAttribute('src'));
                    this.tvScreen.setAttribute('material','src:url('+this.giphyTVEl.getAttribute('src')+')');
                }.bind(this),5000); //switch TV display every 5 seconds
            }.bind(this),5000);*/


        }.bind(this));

        this.gameboy.addEventListener('respawned',function(){
            //reset gameboy orientation
            console.log('Gameboy respawned');
        }.bind(this));

        window.addEventListener('mouseup',function(e){

            if(this.firstClick){
                this.firstClick = false;
                return;
            }

            //console.log('clicked: ',this.targettedEntity);
            if(this.targettedEntity !== ''){
                var targetEl = document.querySelector('#'+this.targettedEntity);
                var colliderEl = targetEl.querySelector('.collider');
                switch (this.targettedEntity){
                    case 'gameboy':
                        this.toggleEntityFollowCursor(this.targettedEntity,targetEl,colliderEl);
                        break;
                    case 'glass':
                    case 'picture':
                    case 'ball':
                        this.toggleEntityFollowCursor(this.targettedEntity,targetEl,targetEl);
                        break;
                    case 'collision-table':
                    case 'collision-floor':

                        //this.entityUnfollowCursor('gameboy',self.gameboy,self.gameboyCollider);
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

            this.entityOriginalAttrs[id] = {
                'grabbable': entity.getAttribute('grabbable'),
                'dynamic-body': entity.getAttribute('dynamic-body')
            };

            switch(id){
                case 'gameboy':
                    this.cursorEl.setAttribute('material','opacity',0);
                    break;
                case 'ball':
                    this.cursorEl.setAttribute('material','opacity',0);
                    this.entityOriginalAttrs[id].mirror = entity.getAttribute('mirror');
                    //entity.setAttribute('mirror','repeat',false);
                    //entity.removeAttribute('mirror');
                    break;
            }

            this.followingEntity = id;

            entity.removeAttribute('grabbable');
            entity.removeAttribute('dynamic-body');
            entity.setAttribute('look-at','#camera');
            entity.setAttribute('follow','target','#my-cursor');

            colliderEl.classList.add('ignore-ray');

            //this.cursor.setAttribute('sphere-collider','objects','#collision-gameboy,#glass');


        console.log('now ignoring: ',colliderEl);

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

            if(id === 'ball'){
                //entity.setAttribute('mirror',this.entityOriginalAttrs[id]['mirror']);
            }
        }

        entity.removeAttribute('follow');
        entity.removeAttribute('look-at');
        this.cursorEl.setAttribute('material','opacity',0.5);
        colliderEl.classList.remove('ignore-ray');

    },

    tick: function (t, dt) {
        //console.log(self.camera.getAttribute('position'));





    }
    // Other handlers and methods.
});



