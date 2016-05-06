var TWEEN = require('tween.js');
var Colors = require('Colors');
var randomData = require('data/randomData');
var CanvasBuffers = require('graphics/CanvasBuffers');
var CanvasOverlay = require('components/CanvasOverlay');

class ActiveUsersOverlay extends CanvasOverlay {

    constructor(map, users) {

        super(map);

        this.nBuffers = 20;


        this.data = {
            activeUsers: users
        };

        this.buffersHandler = new CanvasBuffers();

        this.addToMap();
    }


    onAdd(){
        super.onAdd();

        d3.select(this.canvas)
            .classed('active-users', true)
    }

    /**
        Draw called by google map API
     */
    draw() {

        //stop animation loop if present
        if(this.tweenLoop){
            this.tweenLoop.stop();
        }

        //resize
        this.resize();

        var canvas = this.canvas;

        //prepare buffers
        for(let i = 0; i < this.nBuffers; i++) {
            let buffer = this.buffersHandler.addBuffer(canvas.width, canvas.height);
            buffer.sinParams = {
                speed: Math.floor(Math.random()*10),
                phase: Math.random()*Math.PI*2,
                intensity: 0.5 + Math.random()*0.2,
                base: 0.1 + Math.random()*0.2
            }
        }

        //
        this.drawOnBuffers();

        //start animation loop

        var ctx = canvas.getContext("2d");
        var self = this;
        this.tweenLoop = new TWEEN.Tween({p:0})
            .to({p:1}, 10000)
            .repeat(Infinity)
            .onUpdate(function() {
                self.drawOnCanvas(this.p);
            })
            .start();
    };


    drawOnBuffers() {

        //
        this.drawActiveUsers();

    }


    drawOnCanvas(p){

        //reset
        this.clearCanvas();

        //render the n buffers
        for(let b = 0; b < this.nBuffers; b++) {

            let buffer = this.buffersHandler.buffers[b];
            let sinParams = buffer.sinParams;

            //compute alpha
            this.ctx.globalAlpha =
                sinParams.base +
                sinParams.intensity * Math.abs(
                    Math.sin(sinParams.phase + sinParams.speed * p * Math.PI)
                );

            this.ctx.drawImage(buffer.canvas, 0, 0);

        }

    }


    drawActiveUsers(){

        //color of the user
        //XXX move or generate from Colors
        var arrayColor = [255,255,0,255];

        for(let b = 0; b < this.nBuffers; b++) {

            var secSize = this.data.activeUsers.length / this.nBuffers;
            var start = b * secSize;
            var end = start + secSize;

            var ctx = this.buffersHandler.buffers[b].getContext();

            //TODO clear buffer

            var canvasData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var pixelsData = canvasData.data;


            for (let i = start; i < end; i++) {

                var u = this.data.activeUsers[i];
                var pos = this.canvasPointFromLatLng(u.lat, u.lng);

                var xpix = Math.round(pos.x),
                    ypix = Math.round(pos.y);

                var pixelIndex = ((this.canvas.width * ypix) + xpix) * 4;

                if (xpix >= 0 && xpix <= this.canvas.width
                    && ypix >= 0 && ypix <= this.canvas.height) {

                    pixelsData[pixelIndex] = arrayColor[0];
                    pixelsData[pixelIndex + 1] = arrayColor[1];
                    pixelsData[pixelIndex + 2] = arrayColor[2];
                    pixelsData[pixelIndex + 3] = arrayColor[3];
                }

            }

            ctx.putImageData(canvasData, 0, 0);

        }

    }


}

module.exports = ActiveUsersOverlay;