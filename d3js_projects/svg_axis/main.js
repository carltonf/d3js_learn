// DONE create Y axis

var svgContainer = d3.select('#draw').append('svg')
    .attr('width', 450).attr('height', 200);

var xAxisScale = d3.scale.linear().domain([0, 100]).range([0, 400]);
var xAxis = d3.svg.axis().scale(xAxisScale).orient('top');

var yAxisScale = d3.scale.linear().domain([0, 10]).range([0, 150]);
var yAxis = d3.svg.axis().scale(yAxisScale).orient('left');

var xAxisGroup = svgContainer.append('g').attr('transform', 'translate(30, 20)')
    .call(xAxis);
var yAxisGroup = svgContainer.append('g').attr('transform', 'translate(30, 20)')
    .call(yAxis);
