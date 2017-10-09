//Used http://bl.ocks.org/d3noob/8952219 as reference
function makeAndShowBarChart(data){
    if (count == 0) {
        count = 1;
    }

    var margin = {top: 20, right: 200, bottom: 70, left: 60},
        width = 1160 - margin.left - margin.right,
        height = 470 - margin.top - margin.bottom;

    var x = d3.scale.ordinal().rangeRoundBands([width, 0], .05);

    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    var svg = d3.select("#barChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    x.domain(data.map(function(d) { return d.Date; }));
    y.domain([0, d3.max(data, function(d) { return Math.abs(d.Close - d.Open); })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");

    svg.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .style("fill", "steelblue")
        .attr("x", function(d) { return x(d.Date); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(Math.abs(d.Close - d.Open)); })
        .attr("height", function(d) { return height - y(Math.abs(d.Close - d.Open)); })
        .style("fill", function(d) {
            if (d.Close - d.Open < 0) {
                return "red";
            } else if (d.Close - d.Open > 0) {
                return "green";
            } else {
                return "orange";
            }});

    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width) +","+(height + 30) +")")  // centre below axis
        .text("Date");


    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width + 76) +","+(height - 100) +")")  // centre below axis
        .style("fill", "green")
        .text("Up (Positive Gains)");

    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width + 90) +","+(height - 80) +")")  // centre below axis
        .style("fill", "red")
        .text("Down (Negative Gains)");

}/**
 * Created by haesa on 5/7/2017.
 */
