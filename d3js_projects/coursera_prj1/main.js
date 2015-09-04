// load the data js: this introduces the "data" var into global
// TODO use the "csv" version
// d3.select('head').append('script')
//     .attr('src', 'data/ExcelFormattedGISTEMPData2JS.js');
// NOTE: the above is async and thus can not be relied on to provide 'data'
// move to HTML directly

// TODO factor into a class for this SVG container/canvas parameters generation
var svgParams = {
    // raw SVG container
    W: 900,
    H: 600,
    M: {
        TOP: 20,
        RIGHT: 20,
        BOTTOM: 20,
        LEFT: 50,
    },
};

(function(self){
    self.width = self.W - self.M.LEFT - self.M.RIGHT;
    self.height = self.H - self.M.TOP - self.M.BOTTOM;
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
    { name: "South Frigid Zone",
      key: "90S-64S",
      color: 'MidnightBlue', },
    { name: "South Temperate Zone",
      key: "64S-44S",
      color: 'SteelBlue', },
    { name: "South sub-Tropical Zone",
      key: "44S-24S",
      color: 'Teal', },
    { name: "Tropical Zone",
      key: "24S-24N",
      color: 'Crimson', },
    { name: "North sub-Tropical Zone",
      key: "24N-44N",
      color: 'ForestGreen', },
    { name: "North Temperate Zone",
      key: "44N-64N",
      color: 'Blue', },
    { name: "North Frigid Zone",
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
    .range([0, svgParams.width]);
var yScale = d3.scale.linear()
    .domain([scaleParams.minTemp - scaleParams.tempMargin,
             scaleParams.maxTemp + scaleParams.tempMargin])
    .range([svgParams.height, 0]);

// TODO better named as svgCanvas?
svgDraw = svgDraw.append('g')
    .attr('class', 'canvas')
    .attr('transform', 'translate(' + svgParams.M.LEFT + ', ' + svgParams.M.RIGHT + ')');

var xAxis = d3.svg.axis().scale(xScale).orient('bottom')

var yAxis = d3.svg.axis().scale(yScale).orient('left');

var svgXAxis = svgDraw.append('g')
    .attr('class', 'axis')
    .call(xAxis)
    .attr('transform', 'translate(0, ' + svgParams.height+ ')');
var svgYAxis = svgDraw.append('g').attr('class', 'axis').call(yAxis);

///////////////// Draw one line first
var lineGen = d3.svg.line()
    .x(function(d){ return xScale(d["Year"]) })
    .interpolate('basis');

for (var param of dataParams){
    lineGen.y(function(d){ return yScale(d[param.key])});
    svgDraw.append('g')
        .append('path')
        .attr('d', lineGen(data))
        .attr('stroke', param.color)
        .attr('stroke-width', 2)
        .attr('fill', 'none');
}
