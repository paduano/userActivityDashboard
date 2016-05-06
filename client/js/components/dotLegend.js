module.exports = function(g, elements) {

    var gleg = g
        .append('g')
        .classed('legend', true)

    var ldist = 50;

    var span = 120;

    var elements = gleg.selectAll('.element')
        .data(elements)
        .enter()
        .append('g')
        .attr('class', d=>{return 'element ' + d.name})
        .attr('transform', (d,i)=>{
            return 'translate(' + [span*(-elements.length/2 + i), 0] + ')'
        });


    function addLegendItem(d){
        d3.select(this).append('circle')
            .attr({
                r: 4,
                fill: d.color
            })

        d3.select(this).append('text')
            .attr({
                fill: d.color,
                dy: 3,
                x: 12,
                'font-size': 10
            })
            .text(d.label)
    }

    elements.each(addLegendItem)

    return gleg;


}