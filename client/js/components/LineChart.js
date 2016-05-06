var React = require('react');
var ReactFauxDOM = require('react-faux-dom');
var Colors = require('Colors');
var dotLegend = require('components/dotLegend');

class LineChart extends React.Component {

    constructor() {

        super();

        this.data = {
            series : [
                {
                    name: 'all-users',
                    label: 'overall users',
                    values: [], //{date:'2015-12-25', value:}
                    color: ''
                },
                {
                    name: 'active-users',
                    label: 'active users',
                    values: [],
                    color: ''
                }
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
            height = 300;
        
        var margin = {top: 40, right: 10, bottom: 60, left: 10},
            chartWidth = width - margin.left - margin.right,
            chartHeight = height - margin.top - margin.bottom;


        var parseDate = d3.time.format("%Y-%m-%d").parse;

        var x = d3.time.scale()
            .range([0, chartWidth]);

        var y = d3.scale.linear()
            .range([chartHeight, 0]);

        var xAxis = d3.svg.axis()
            .tickFormat(d3.time.format('%b'))
            .scale(x)
            .ticks(12)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5)
            .tickSize(-chartWidth, 0, 0)
            //.tickFormat("");

        var line = d3.svg.line()
            .interpolate("basis")
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.value); });

        var svg = d3.select(svgFaux)
            .classed('line-chart', true)
            .attr("width", width )
            .attr("height", height)

        svg.append('text')
            .classed('title', true)
            .attr({
                x: (chartWidth + margin.left + margin.right)/2,
                y: 20,
                'text-anchor': 'middle',
                'fill' : '#CCC',
                'font-size': 12
            }).text('User Growth')

        var chart = svg
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.data.series.forEach(serie=>{
            serie.values.forEach(function(d) {
                d.date = parseDate(d.date);
                d.value = +d.value;
            });
        });



        x.domain(d3.extent(this.data.series[0].values, function(d) { return d.date; }));
        var yrange = d3.extent(this.data.series[0].values, function(d) { return d.value; });
        yrange[0] = 0;
        y.domain(yrange);



        chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(xAxis);

        chart.append('line')
            .attr({
                y1: chartHeight,
                x1: 0,
                y2: chartHeight,
                x2: chartWidth,
                stroke: '#FFF',
                opacity: 0.6
            })


        chart.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            //.append("text")
            //.attr("transform", "rotate(-90)")
            //.attr("y", 6)
            //.attr("dy", ".71em")
            //.style("text-anchor", "end")
            //.text("Price ($)");

        chart.selectAll('.domain').remove();

        chart.append("path")
            .datum(this.data.series[0].values)
            .attr("class", "line-serie " + this.data.series[0].name)
            .attr({
                'stroke-chartWidth' : 1,
                'stroke' : '#FFFFFF',
                'fill' : 'none'
            })
            .attr("d", line);

        chart.append("path")
            .datum(this.data.series[1].values)
            .attr("class", "line-serie " + this.data.series[1].name)
            .attr({
                'stroke-chartWidth' : 1,
                'stroke' : Colors.activeUser,
                'fill' : 'none'
            })
            .attr("d", line);



        //customize ticks
        chart
            .selectAll('.y')
            .selectAll('.tick')
            .selectAll('line')
            .attr({
                opacity: 0.2,
                'stroke-chartWidth': 1,
                'stroke': '#FFF'
            })

        chart
            .selectAll('.tick')
            .selectAll('text')
            .attr({
                fill: '#FFF',
                'font-size': 8
            })


        chart
            .selectAll('.y')
            .selectAll('.tick')
            .selectAll('text')
            .attr({
                x: chartWidth,
                y : 10,
                'text-anchor' : 'end'
            })


        //legend
        var legend = this.data.series.map(s => {
                return {
                    name: s.name,
                    label: s.label,
                    color: s.color
                }
            })

        dotLegend(svg, legend)
            .attr('transform', 'translate(' + [width/2 + 20, height - 20] + ')')


        return svgFaux.toReact()
    }
}


module.exports = LineChart;