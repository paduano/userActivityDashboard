var TWEEN = require('tween.js');
var Colors = require('Colors');
var clamp = require('clamp');
var CanvasOverlay = require('components/CanvasOverlay');
var randomData = require('data/randomData');

class ActiveUsersOverlay extends CanvasOverlay {


    constructor(map, clusters) {

        super(map);

        this.blurSize = 15;
        this.clusters = clusters;

        this.addToMap()

    }


    onAdd(){
        super.onAdd();

        d3.select(this.div)
            .append('div')
            .classed('canvas-frame', true)

            .style({
                'box-sizing': 'border-box',
                width: '100%',
                height: '100%',
                'border-color': Colors.background,
                'border-style' : 'solid',
                'border-width' : 10 + this.blurSize * 2 + 'px',
                'position' : 'absolute'
            });

        d3.select(this.canvas)
            .classed('all-users', true)



    }

    /**
        Draw called by google map API
     */
    draw() {

        //resize
        this.resize();


        if(this.data) {
            this.initUserScale();
        }

        this.canvas.style.webkitFilter = "blur(" + this.blurSize + "px)";

        this.drawOnCanvas();

    };


    initUserScale() {

        this.userScale = d3.scale.linear()
            .domain([0, this.data.overallUsers.maxValue])
            .range([0,0.5]);

    }


    drawOnCanvas() {

        //reset
        this.clearCanvas();
        //TODO must be computed according to the background color
        //this.ctx.fillStyle = "rgba(0, 0, 0, 0.855)";
        this.ctx.fill();

        if(this.data){
            this.drawAllUsers();
        }

    }


    drawAllUsers(){

        var width = this.canvas.width;
        var height = this.canvas.height;

        var canvasData = this.ctx.getImageData(0, 0, width, height);
        var pixelsData = canvasData.data;

        var grid = this.data.overallUsers.grid;
        var geoBounds = this.data.overallUsers.bounds;

        if(grid.length == 0){
            console.error('empty grid in draw all users');
            return;
        }

        var sw = this.canvasPointFromLatLng(geoBounds[0].lat, geoBounds[0].lng);
        var ne = this.canvasPointFromLatLng(geoBounds[1].lat, geoBounds[1].lng);

        var tileWidth = (ne.x - sw.x) / grid.length;
        var tileHeight = (sw.y - ne.y) / grid[0].length;

        //prepare alpha
        var alphaGrid = [];
        for(let gY = 0; gY < grid[0].length; gY++) {
            let row = [];
            for (let gX = 0; gX < grid.length; gX++) {
                let users = grid[gX][gY];
                let alpha = clamp(
                    (0.855 - this.userScale(users)), 0, 1
                );
                row.push(alpha);
            }
            alphaGrid.push(row);
        }

        //draw pixels
        for(let i = 0; i < height; i++) {
            for(let j = 0; j < width; j++) {

                var x = j,
                    y = i;

                //grid coordinates
                //XXX review
                let gY = Math.floor(x/tileWidth),
                    gX = Math.floor((height-y-1)/tileHeight);

                //coordinates inside the single tile
                let tX = x % tileWidth,
                    tY = y % tileHeight;

                let alpha = alphaGrid[gX][gY];
                var pixelIndex = ((width * y) + x) * 4;
                //let alphaComposite = 0;

                //pixelsData[pixelIndex] = arrayColor[0];
                //pixelsData[pixelIndex + 1] = arrayColor[1];
                //pixelsData[pixelIndex + 2] = arrayColor[2];

               //if(x == 134 && y == 151)debugger
               //
               //
               // let
               //     //alpha contribution of the 3 tiles
               //     xa = 0,
               //     ya = 0,
               //     da = 0,
               //
               //     //offset from the tile center
               //     dx,
               //     dy,
               //
               //     //to select the right diagonal tile
               //     diagX,
               //     diagY;
               //
               // dx = tX/(tileWidth/2) - 1;
               // dy = tY/(tileHeight/2) - 1;
               //
               // if(tX > tileWidth/2) {
               //     xa = gX < grid.length - 1 ? alphaGrid[gX+1][gY] : 0;
               //     diagX = 1;
               // } else {
               //     dx = -dx;
               //     xa = gX > 0 ? alphaGrid[gX-1][gY] : 0;
               //     diagX = -1;
               // }
               //
               // if(tY > tileHeight/2) {
               //     ya = gY < grid[0].length - 1 ? alphaGrid[gX][gY+1] : 0;
               //     diagY = 1;
               // } else {
               //     dy = -dy;
               //     ya = gY > 0 ? alphaGrid[gX][gY-1] : 0;
               //     diagY = -1;
               // }
               //
               // if(gX + diagX  < grid.length - 1 &&
               //     gX + diagX > 0 &&
               //     gY + diagY  < grid[0].length - 1 &&
               //     gY + diagY > 0) {
               //     da = alphaGrid[gX][gY];
               // } else {
               //     da = 0;
               // }
               //
               // //approx
               //
               // dx/=4;
               // dy/=4;
               // let dd = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
               //
               // let dc = clamp(1 - (dx) - (dy) - (da), 0, 1);
               // alphaComposite = dc * alpha + (dx * xa) + (dy * ya) + (dd * da);

                //alphaComposite = alphaComposite > alpha ? alphaComposite : alpha;

                //
                //if(dx > dy){
                //    //use only horizontal and corner
                //    let dc = clamp(1 - (dd + dx), 0, 1);
                //    alphaComposite = dc * alpha + (dx * xa + dd * da);
                //} else {
                //    //use oly vertical and corner
                //    let dc = clamp(1 - (dd + dy), 0, 1);
                //    alphaComposite = dc * alpha + (dy * ya + dd * da);
                //}

                pixelsData[pixelIndex + 3] = Math.floor(alpha*255);
                
            }
        }

        this.ctx.putImageData(canvasData, 0, 0);


    }


}

module.exports = ActiveUsersOverlay;