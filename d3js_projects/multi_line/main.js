var SVG_W = 900,
    SVG_H = 500,
    SVG_MARGINS = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 50,
    };

var svgDraw = d3.select('#svg-draw').append('svg')
    .attr('width', SVG_W).attr('height', SVG_H);

var xScale = d3.scale.linear().domain([2000, 2010]);
var yScale = d3.scale.linear().domain([120, 220])


// auxiliary var to test two approaches
var USE_CANVAS_GROUP = true;

if (USE_CANVAS_GROUP){
    // make everything we need to draw within the canvas group to avoid spread
    // margins info everywhere.
    var CANVAS_W = SVG_W - SVG_MARGINS.left - SVG_MARGINS.right,
        CANVAS_H = SVG_H - SVG_MARGINS.top - SVG_MARGINS.bottom;

    // aux CANVAS group, note after this point no MARGINS are used anymore.
    // only the CANVAS parameters.
    svgDraw = svgDraw.append('g')
        .attr('class', 'canvas')
        .attr('transform', 'translate(' + SVG_MARGINS.left + ',' + SVG_MARGINS.top + ')');

    xScale.range([0, CANVAS_W]);
    // NOTE: as the SVG Y coordinate grows from top to bottom, to get a classical Y
    // axis, revert the range with the largest as the first
    yScale.range([CANVAS_H, 0]);
}
// the naive solution without canvas group
else{
    xScale.range([SVG_MARGINS.left, SVG_W - SVG_MARGINS.right]);
    yScale.range([SVG_H - SVG_MARGINS.bottom, SVG_MARGINS.top]);
}

// orient bottom is the default
xAxis = d3.svg.axis().scale(xScale).orient('bottom');
// by default, there are ten sects, 10 ticks (11, if the start tick is counted)
yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(5);

var svgXAxis = svgDraw.append('g')
    .attr('class', 'axis')
    .call(xAxis);

var svgYAxis = svgDraw.append('g')
    .attr('class', 'axis')
    .call(yAxis); 

if (USE_CANVAS_GROUP){
    // NOTE: here it's the more natural interpretation of the bottom of the
    // "graph" and there is no need to transform Y Axis.
    svgXAxis.attr('transform', 'translate(0,' + CANVAS_H + ')');
}
else {
    svgXAxis.attr('transform', 'translate(0,' + (SVG_H - SVG_MARGINS.bottom) + ')');
    svgYAxis.attr('transform', 'translate(' + (SVG_MARGINS.left) + ')');
}

// draw the line 1
var data1 = [
    {
    "sale": "202",
    "year": "2000"
    },
    {
    "sale": "215",
    "year": "2001"
    },
    {
    "sale": "179",
    "year": "2002"
    },
    {
    "sale": "199",
    "year": "2003"
    },
    {
    "sale": "134",
    "year": "2005"
    },
    {
    "sale": "176",
    "year": "2010"
    }
];

var lineGen = d3.svg.line()
    .x(function(d) {
        return xScale(d.year);
    })
    .y(function(d) {
        return yScale(d.sale);
    })
    .interpolate('basis');

svgDraw.append('g')
    .append('path')
    .attr('d', lineGen(data1))
    .attr('stroke', 'blue')
    .attr('stroke-width', 2)
    .attr('fill', 'none');

// draw the line 2
var data2 = [{
    "sale": "152",
    "year": "2000"
}, {
    "sale": "189",
    "year": "2002"
}, {
    "sale": "179",
    "year": "2004"
}, {
    "sale": "199",
    "year": "2006"
}, {
    "sale": "134",
    "year": "2008"
}, {
    "sale": "176",
    "year": "2010"
}];

svgDraw.append('g')
    .append('path')
    .attr('d', lineGen(data2))
    .attr('stroke', 'green')
    .attr('stroke-width', 2)
    .attr('fill', 'none');
