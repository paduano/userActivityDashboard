/**
 * Class to handle render-to-texture elements
 */


class CanvasBuffer {


    constructor(parent, width, height) {

        this.canvas = parent
            .append('canvas')
            .attr({
                width: width,
                height: height
            })
            .node();

    }


    getContext() {
        return this.canvas.getContext("2d");
    }


}


class CanvasBuffersContainer {


    constructor() {

        this.container = d3
            .selectAll('#offscreen')
            .append('div')
            .classed('offscreen-canvas', true);


        this.buffers = [];

    }


    addBuffer(width, height) {

        var buffer = new CanvasBuffer(this.container, width, height);

        this.buffers.push(buffer);

        return buffer;

    }

}


module.exports = CanvasBuffersContainer;