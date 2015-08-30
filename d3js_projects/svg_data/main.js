var circleRadii = [40, 20, 10];

var circleColors = ['red', 'purple', 'green'];

var svgWH = Math.max.apply(null, circleRadii) * 2;
var circleCenter = [svgWH/2, svgWH/2];

d3.select('#draw')
    .style('width', '-moz-max-content') // to contain the content only
// explicitly mark that there is no font and thus eliminate the extra height
// resulted from implicit height calculated from 'font' and 'line-height'
// see http://stackoverflow.com/questions/20106428/why-does-inline-block-cause-this-div-to-have-height
// "nkmol"'s answer
    .style('font-size', '0')   
    .style('border-color', 'black')
    .style('border-style', 'solid')
    .style('border-width', '1px');

var $svg = d3.select('#draw').append('svg')
    .attr('width', svgWH).attr('height', svgWH);

$svg.selectAll("circle")
// create circles
    .data(circleRadii)
    .enter()
    .append("circle")
    .attr('cx', circleCenter[0])
    .attr('cy', circleCenter[1])
    .attr('r', function(d){ return d; })
// fill circles with colors
    .data(circleColors)
    .attr('fill', function(d){ return d; });
