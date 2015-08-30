var theData = [1, 2, 3];

var p = d3.select("body").selectAll("p")
    .data(theData)
    .text(function(d){ return "Update 'Hello' to '" + d + "'."; }) // 'update' selection
    .enter()                                                       // 'enter' selection
    .append("p")
    .text(function(d){ return "Newly add '" + d + "'"; });
