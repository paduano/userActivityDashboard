var React = require('react');
var ReactFauxDOM = require('react-faux-dom');
var Colors = require('Colors');
var dotLegend = require('components/dotLegend');

class PieChart extends React.Component {

    constructor() {

        super();

        this.data = {
            values : [
                {
                    name: 'restaurant',
                    label: 'restaurants',
                    value: 10,
                    color: Colors.places.restaurant
                },
                {
                    name: 'entertainment',
                    label: 'entertainment',
                    value: 20,
                    color: Colors.places.entertainment
                },
                {
                    name: 'bar',
                    label: 'bar and pubs',
                    value: 30,
                    color: Colors.places.bar
                },
            ]
        }
    }


    componentWillMount() {


    }


    setData(data) {
        this.data = data;
        this.forceUpdate();
    }


    componentDidMount() {

        var self = this;

    }


    componentWillUnmount() {



    }


    render(){

        var svgFaux = ReactFauxDOM.createElement('svg');

        var width = 400,
            height = 250;

        var margin = {top: 40, right: 10, bottom: 30, left: 10},
            chartWidth = width - margin.left - margin.right,
            chartHeight = height - margin.top - margin.bottom;

        var radius = Math.min(chartWidth, chartHeight)/2;


        var svg = d3.select(svgFaux)
            .classed('pie-chart', true)
            .attr("width", width )
            .attr("height", height)
        ;

        var g = svg.append('g')
                .attr('transform', 'translate(' + [width/2, chartHeight/2  + margin.top] + ')');

        var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.value; });


        var gArc = g.selectAll(".arc")
            .data(pie(this.data.values))
            .enter().append("g")
            .attr("class", d=>{return "arc " + d.data.name});

        gArc.append("path")
            .attr({
                d : d=>{return arc(d)},
                stroke: Colors.background,
                "stroke-width": 2
            })
            .style("fill", d => d.data.color);

            //legend
        var legend = this.data.values.map(s => {
                return {
                    name: s.name,
                    label: s.label,
                    color: s.color
                }
            })

        svg.append('text')
            .classed('title', true)
            .attr({
                x: (chartWidth + margin.left + margin.right)/2,
                y: 20,
                'text-anchor': 'middle',
                'fill' : '#CCC',
                'font-size': 12
            }).text('Places Type Breakdown')


        dotLegend(svg, legend)
            .attr('transform', 'translate(' + [width/2 + 20, height - 12] + ')')


        return svgFaux.toReact()
    }
}


module.exports = PieChart;