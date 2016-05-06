var React = require('react');
var ReactFauxDOM = require('react-faux-dom');

class HelloMessage extends React.Component {



    render() {
        var svg = ReactFauxDOM.createElement('svg');
        //return <div>Hello {this.props.name}</div>;

        d3.select(svg)
            .append('circle')
            .attr({
                r : 48
            });

        return svg.toReact()
    }
}

module.exports = HelloMessage;
