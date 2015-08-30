var spaceCircles = [30, 70, 110];

var svgSelection = d3.select('#draw')
    .append('svg').attr('width', 200).attr('height', 200);

svgSelection.selectAll('circle')
    .data(spaceCircles)
    .enter()
    .append('circle')
    .attr('cx', function(d, i){
        return spaceCircles[i];
    })
    .attr('cy', function(d, i){
        return spaceCircles[i];
    })
    .attr('r', 20)
    .attr('fill', function(d, i){
        switch(i){
        case 0: return 'green';
        case 1: return 'purple';
        case 2: return 'red';
        };
    });

