
/**
 * Base class for a google map overlay that use the canvas
 **/
class CanvasOverlay extends google.maps.OverlayView {


    constructor(map) {

        super();
        this.map_ = map;
        this.canvas = null;


    }

    addToMap(){
        this.setMap(this.map_);
    }


    onAdd() {

        var canvas = document.createElement('canvas');
        canvas.style.borderStyle = 'none';
        canvas.style.borderWidth = '0px';
        canvas.style.position = 'absolute';

        var div = document.createElement('div');
        div.style.position = 'absolute';
        div.appendChild(canvas);

        this.canvas = canvas;
        this.div = div
        this.ctx = canvas.getContext("2d");



        var panes = this.getPanes();
        panes.overlayLayer.appendChild(div);

    };


    setData(data) {
        this.data = data;
        this.draw();
    }


    resize() {

        var overlayProjection = this.getProjection();

        var sw = overlayProjection.fromLatLngToDivPixel(
            this.map.getBounds().getSouthWest()
        );
        var ne = overlayProjection.fromLatLngToDivPixel(
            this.map.getBounds().getNorthEast()
        );

        var div = this.div;
        var canvas = this.canvas;

        this.canvasRealWidth = ne.x - sw.x;
        this.canvasRealHeight = sw.y - ne.y;

        //set position
        div.style.left = sw.x  + 'px';
        div.style.top = ne.y  + 'px';
        div.style.width = this.canvasRealWidth + 'px';
        div.style.height = this.canvasRealHeight + 'px';

        canvas.style.top = 0 + 'px';
        canvas.style.left = 0 + 'px';
        canvas.width = this.canvasRealWidth;
        canvas.height = this.canvasRealHeight;

        this.geoBounds = [
            {
                lat: this.map.getBounds().getSouthWest().lat(),
                lng: this.map.getBounds().getSouthWest().lng()
            },
            {
                lat: this.map.getBounds().getNorthEast().lat(),
                lng: this.map.getBounds().getNorthEast().lng()
            }
        ]

    }


    canvasPointFromLatLng(lat, lng){

        var proj = this.getProjection();
        var pos = proj.fromLatLngToContainerPixel(new google.maps.LatLng({lat:lat, lng:lng}));
        return {
            x: pos.x / (this.canvasRealWidth/this.canvas.width),
            y: pos.y / (this.canvasRealHeight/this.canvas.height)
        }

    }


    clearCanvas() {

        this.ctx.globalAlpha = 1;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);

    }


    onRemove() {

        //TODO
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;

    };

}

module.exports = CanvasOverlay;