// load the data js: this introduces the "data" var into global
// TODO use the "csv" version
// d3.select('head').append('script')
//     .attr('src', 'data/ExcelFormattedGISTEMPData2JS.js');
// NOTE: the above is async and thus can not be relied on to provide 'data'
// move to HTML directly

// TODO factor into a class for this SVG container/canvas parameters generation
var svgParams = {
    canvas: {
        width: 600,
        height: 400,
        margins: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 50,
        },
    },

    // on the left of "canvas"
    legends: {
        width: 250,
        height: 400,
        margins: {
            top: 40,
            right: 20,
            bottom: 20,
            left: 10,
        }
    },

    // on the bottom of canvas&legend
    caption: {
        height: 100,
        margins: {
            top: 0,
            right: 0,
            bottom: 20,
            left: 0,
        },
    }
};

(function(self){
    self.W = self.canvas.width + self.canvas.margins.right + self.canvas.margins.left
        + self.legends.width + self.legends.margins.right + self.legends.margins.left;
    self.H = self.canvas.height + self.canvas.margins.top + self.canvas.margins.bottom
        + self.caption.height + self.caption.margins.top + self.caption.margins.bottom;
})(svgParams);

// use bare DOM API to have an cross-browser implementation
// var svgDraw = document.createElement('svg'),
//     svgDraw = svgDraw.setAttribute('width', svgParams.width), // no chaining
//     svgDraw = svgDraw.setAttribute('height', svgParams.height);

// append svg element into DOM
svgDraw = d3.select('#svg-draw').append('svg')
    .attr('width', svgParams.W).attr('height', svgParams.H);

/////////////////
///// Setup Axis
// Note:
// At this stage, we need to be clear about the diagram we'd like to draw.
//
// X: year. Y: deviations from the corresponding 1951-1980 means
// 7 lines, one for each climate zone:
// Temperate Zone: 44N/S-66N/S (approx. =~ 64) -> nTempZone, sTempZone
// Tropical Zone: 24S-24N                      -> tropZone
// Sub-tropical Zone: 24N/S - 44N/S            -> subTropZone
// Frigid/Cold Zone: 66N/S - 90N/S             -> nColdZone, sColdZone
//
// TODO: include Global data for reference?

var dataParams = [
    { name: "S Frigid Zone",
      key: "90S-64S",
      color: 'MidnightBlue', },
    { name: "S Temperate Zone",
      key: "64S-44S",
      color: 'SteelBlue', },
    { name: "S sub-Tropical Zone",
      key: "44S-24S",
      color: 'Teal', },
    { name: "Tropical Zone",
      key: "24S-24N",
      color: 'Crimson', },
    { name: "N sub-Tropical Zone",
      key: "24N-44N",
      color: 'ForestGreen', },
    { name: "N Temperate Zone",
      key: "44N-64N",
      color: 'Blue', },
    { name: "N Frigid Zone",
      key: "64N-90N",
      color: 'Indigo', },
];

///// scale
var scaleParams = {
    minTemp: null,
    maxTemp: null,
    beginYear: null,
    endYear: null,
    // decorative margins
    tempMargin: 0,              // 5% of (maxTemp - minTemp) for top and bottom
    beginYearMargin: 0,         // keep it zero
    endYearMargin: 5,           // 5 year seems to be good-looking
};
for (var row of data){
    scaleParams.minTemp = scaleParams.minTemp || row["24S-24N"];
    scaleParams.maxTemp = scaleParams.maxTemp || row["24S-24N"];
    scaleParams.beginYear = scaleParams.beginYear || row["Year"];
    scaleParams.endYear = scaleParams.endYear || row["Year"];

    // not relying on the natural order of raw data
    //
    // TODO: if raw data preparation is under our control, we should trust its
    // order or setup the order purposefully even.
    scaleParams.beginYear = Math.min(row["Year"], scaleParams.beginYear);
    scaleParams.endYear = Math.max(row['Year'], scaleParams.endYear);

    var tempExtent = d3.extent([
        scaleParams.minTemp, scaleParams.maxTemp,

        // from South to North
        // TODO derive the following from dataParams
        row["90S-64S"], row["64S-44S"], row["44S-24S"],
        row["24S-24N"],
        row["24N-44N"], row["44N-64N"], row["64N-90N"],
    ]);
    scaleParams.minTemp = tempExtent[0];
    scaleParams.maxTemp = tempExtent[1];
}

tempMargin = Math.floor(0.05 * (scaleParams.maxTemp - scaleParams.minTemp));

var xScale = d3.scale.linear()
    .domain([scaleParams.beginYear - scaleParams.beginYearMargin,
             scaleParams.endYear + scaleParams.endYearMargin])
    .range([0, svgParams.canvas.width]);
var yScale = d3.scale.linear()
    .domain([scaleParams.minTemp - scaleParams.tempMargin,
             scaleParams.maxTemp + scaleParams.tempMargin])
    .range([svgParams.canvas.height, 0]);

svgCanvas = svgDraw.append('g')
    .attr('class', 'canvas')
    .attr('transform',
          'translate(' + svgParams.canvas.margins.left
          + ', ' + svgParams.canvas.margins.top + ')');

var xAxis = d3.svg.axis().scale(xScale).orient('bottom')

var yAxis = d3.svg.axis().scale(yScale).orient('left');

var svgXAxis = svgCanvas.append('g')
    .attr('class', 'axis')
    .call(xAxis)
    .attr('transform', 'translate(0, ' + svgParams.canvas.height+ ')');
var svgYAxis = svgCanvas.append('g').attr('class', 'axis').call(yAxis);

///////////////// Draw mult-line graph
var lineGen = d3.svg.line()
    .x(function(d){ return xScale(d["Year"]) })
    .interpolate('basis');

for (var param of dataParams){
    lineGen.y(function(d){ return yScale(d[param.key])});
    svgCanvas.append('g')
        .append('path')
        .attr('d', lineGen(data))
        .attr('stroke', param.color)
        .attr('stroke-width', 2)
        .attr('fill', 'none');
}

///////////////// Legends and captions
var svgLegends = svgDraw.append('g')
    .attr('class', 'legends')
    .attr('transform',
          'translate('
          + (svgParams.canvas.width + svgParams.canvas.margins.left + svgParams.canvas.margins.right
             + svgParams.legends.margins.left)
          + ', '
          + svgParams.legends.margins.top 
          + ')');

for (var idx = 0; idx < dataParams.length; idx++){
    var param = dataParams[idx];
    var svgOneLegend = svgLegends.append('g')
        .attr('transform', 'translate(0, ' + idx * 30 + ')');
    svgOneLegend.append('line').attr('x2', 50).attr('stroke-width', '5')
        .attr('stroke', param.color);
    // TODO I am doing manual aligning here!! (y = 5 is calculated by trial)
    svgOneLegend.append('text').attr('x', 55).attr('y', 5)
        .text(param.name);
}

// TODO another manual tweaking
var svgCaption = svgDraw.append('g')
    .attr('class', 'caption')
    .attr('transform', 'translate('
          + ((svgParams.canvas.width + svgParams.canvas.margins.left + svgParams.canvas.margins.right)/2 - 50)
          + ', '
          + (svgParams.canvas.height + svgParams.canvas.margins.top + svgParams.canvas.margins.bottom + 20)
          + ')')
    .append('text').text('ZonAnnTSS Data');
