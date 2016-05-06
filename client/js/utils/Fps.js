var React = require('react');

class Fps extends React.Component {

    componentWillMount() {

        this.filterStrength = 20;
        this.frameTime = 0;
        this.lastLoop = new Date;
        this.thisLoop;
    }


    componentDidMount() {
        var self = this;
        this.updateTimer = setInterval(function(){
            self.forceUpdate();
        }, 1000);

    }


    componentWillUnmount() {

        clearInterval(this.updateTimer);

    }


    frame(){

        var thisFrameTime = (this.thisLoop=new Date) - this.lastLoop;
        this.frameTime+= (thisFrameTime - this.frameTime) / this.filterStrength;
        this.lastLoop = this.thisLoop;
        this.fps = (1000/this.frameTime).toFixed(1) + " fps";

    }


    render(){
        return <div className="fps-counter"> {this.fps}</div>
    }
}


module.exports = Fps;