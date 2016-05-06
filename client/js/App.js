var React = require('react');
var Map = require('components/Map.js');
var TWEEN = require('tween.js');

var Fps = require('utils/fps.js');
var LineChart = require('components/LineChart.js');
var PieChart = require('components/PieChart');
var randomData = require('data/randomData');

class App extends React.Component {

    componentDidMount() {

        requestAnimationFrame(animate);
        var self = this;
        function animate(time) {
            requestAnimationFrame(animate);
            TWEEN.update(time);
            self.refs.fps.frame();
        }

        this.refs.usersLineChart.setData(
            randomData.generateUserSeries()
        );

        var self=this;

        //d3.selectAll('container').att

        setTimeout(function(){
            self.introAnimation();
        },1000)

    }

    introAnimation() {

        var stepDelay = 5000;
        var stepDuration = 2000;

        function fadeIn(delay){
            return function(){
                d3.select(this)
                    .style('opacity', 0)
                    .transition()
                    .delay(delay)
                    .duration(stepDuration)
                    .style('opacity', 1);
            }
        }

        //
        //
        //d3.select('body')
        //    .style('background-color','#777777')
        //    .transition()
        //    .delay(1*stepDelay)
        //    .duration(stepDuration)
        //    .duration(2000)
        //    .style('background-color','#111111')
        //;
        //

        //d3.selectAll('.all-users')
        //    .each(fadeIn(1*stepDelay));

        d3.selectAll('.active-users')
            .each(fadeIn(2*stepDelay));


        d3.selectAll('.pie-chart')
            .selectAll('.title')
            .each(fadeIn(3*stepDelay));

        d3.selectAll('.restaurant')
            .each(fadeIn(3*stepDelay));

        d3.selectAll('.entertainment')
            .each(fadeIn(4*stepDelay));

        d3.selectAll('.bar')
            .each(fadeIn(5*stepDelay));

    }

    render(){
console.log('render')
        return <div className='container'>
            <Fps ref="fps"/>
            <div className='left-container'>
                <div className='logo'/>
                <LineChart ref="usersLineChart"/>
                <PieChart ref="placesPieChart"/>
            </div>

            <Map/>
            <div className="bottom-cover"/>

        </div>;

    }

}

module.exports = App;