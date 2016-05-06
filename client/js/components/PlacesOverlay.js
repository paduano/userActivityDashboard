var TWEEN = require('tween.js');
var Colors = require('Colors');
var clamp = require('clamp');
var CanvasOverlay = require('components/CanvasOverlay');

class PlacesOverlay extends CanvasOverlay {


    constructor(map, clusters) {

        super(map);
        this.addToMap();

        this.data = {
            places: []
        };

        this.maxRadius = 15;
        this.minRadius = 5;

    }


    onAdd(){
        super.onAdd();

        this.svg = d3.select(this.div)
            .append('svg')
            .classed('places-svg', true)
            .style({
                width: '100%',
                height: '100%',
                position : 'absolute'
            });
    }

    /**
        Draw called by google map API
     */
    draw() {

        //resize
        this.resize();
        this.initScale();
        this.updatePlaces();
    };

    setData(data){

        super.setData(data);

        this.initScale();
        this.updatePlaces();

    }


    initScale() {

        var maxPopularity = _.max(this.data.places, p=>p.popularity).popularity;

        this.radiusScale = d3.scale.linear()
            .domain([0, maxPopularity])
            .range([this.minRadius, this.maxRadius]);

    }


    updatePlaces() {

        var self = this;

        var places = this.svg
            .selectAll('.place')
            .data(this.data.places)

        var newPlace = places
            .enter()
            .append('g')
            .each(d=>{
                d._r = self.radiusScale(d.popularity);
                d._dr = d._r * 0.1;
                //d._mr = d._r*0.1;
                d._delay = 500 + Math.random()*2000;
                d._animDirection = 1;
                d._duration = 1000+Math.random()*2000;

            })
            .attr('class', d=>{return 'place ' + d.type} )
            .attr('transform', function(d){
                var pos = self.canvasPointFromLatLng(d.lat, d.lng);
                return 'translate(' + [pos.x, pos.y] + ')';
            })

        var newCircle = newPlace
            .append('circle')
            .attr({
                r: d=>d._r,
                stroke: function(d){
                    return Colors.places[d.type];
                },
                'stroke-width': 1,
                fill: 'none'
            })


        newCircle.each(loopAnimation);

        function loopAnimation(){
            d3.select(this)
                .each(d=>{d._animDirection *= -1})
                .transition()
                .delay(d=>d._delay)
                .duration(d=>d._duration)
                //.attr('r', d=>{return d._animDirection > 0? d._r : d._mr})
                .attr('r', d=>{return  d._r + d._animDirection * d._dr})
                .each('end', d=>{d3.select(this).each(loopAnimation)})
        }

        places.exit().remove();

    }

}

module.exports = PlacesOverlay;