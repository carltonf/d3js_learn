var jsonRectangles = [
    { "x_axis": 10, "y_axis": 10, "height": 20, "width":20, "color" : "green" },
    { "x_axis": 160, "y_axis": 40, "height": 30, "width":70, "color" : "purple" },
    { "x_axis": 70, "y_axis": 70, "height": 20, "width":20, "color" : "red" },
];

// calculate the needed width&height of SVG container
var svgWidth = 0, svgHeight = 0;
for (var rect of jsonRectangles){
    if (svgWidth < rect.x_axis + rect.width){
        svgWidth = rect.x_axis + rect.width;
    }
    if (svgHeight < rect.y_axis + rect.height){
        svgHeight = rect.y_axis + rect.height;
    }
}

console.log("SVG Size should be at least: " + svgWidth + " x " + svgHeight);

var svgContainer = d3.select('#draw').append('svg')
    .attr('width', svgWidth + 10).attr('height', svgHeight + 10);

svgContainer.selectAll('rect')
    .data(jsonRectangles)
    .enter()
    .append('rect')
    .attr('x', function(d){ return d.x_axis; })
    .attr('y', function(d){ return d.y_axis; })
    .attr('height', function(d){ return d.height; })
    .attr('width', function(d){ return d.width; })
    .attr('fill', function(d){ return d.color; });




