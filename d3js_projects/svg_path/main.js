var lineData = [ { "x": 1,   "y": 5},  { "x": 20,  "y": 20},
                 { "x": 40,  "y": 10}, { "x": 60,  "y": 40},
                 { "x": 80,  "y": 5},  { "x": 100, "y": 60} ];

var lineFunction = d3.svg.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .interpolate("linear");

var svgContainer = d3.select("#draw").append("svg")
    .attr('width', 200).attr('height', 200)

var lineGraph = svgContainer.append('path')
    .attr('d', lineFunction(lineData))
    .attr('stroke', 'blue')
    .attr('stroke-width', 2)
    .attr('fill', 'none');

// DONE use a group of radio button to have all 11 different types of line
// interpolations drawn
// DONE at Aug-30-2015 10:14:16 CST

///////////////// 
// A group of radio buttons for interpolations
var interpolations = ['linear', 'step-before', 'step-after', 'basis', 'basis-open',
                     'basis-closed', 'bundle', 'cardinal', 'cardinal-open', 'cardinal-closed',
                     'monotone' ]
var interpolationLabels = d3.select('#interpolations')
    .selectAll('label')
    .data(interpolations)
    .enter()
    .append('label');

interpolationLabels.append('input')
    .attr('type', 'radio')
    .attr('name', 'interpolation')
    .attr('value', function(d){ return d; });

interpolationLabels.append('span')
    .text( function(d) { return d; } )

// default to linear
d3.select('#interpolations input[value="linear"]')
    .property('checked', true);


///////////////// 
// get the current selected interpolation
// without event
// 
// d3.selectAll('#interpolations input')
//     .filter( function(){ return this.checked ? this : null; } )
//     .datum();

function lineUpdate(interpolation, data){
    lineFunction = lineFunction.interpolate(interpolation);
    lineGraph.attr('d', lineFunction(data));
}

d3.select("#interpolations").on('change', function(){
    console.log(d3.event.target);
    var ipType = d3.select(d3.event.target).datum();
    if (interpolations.indexOf(ipType) == -1)
        return;

    lineUpdate(ipType, lineData);
}, 'input')
