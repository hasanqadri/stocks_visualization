/**
 * Created by haesa on 5/6/2017.
 */
 
 var count = 0;
 var svg;
 
 
function submitidForm() {
    var user = document.getElementById("user").value;
    var pass = document.getElementById("pass").value;
    var query = "php/server.php?username=" + user + "&password=" + pass;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(this.responseText=='Fail'){
                alert("The username and password do not match");
                return;
            } else{
                document.getElementById('dataRequest').style.visibility = "visible";
                document.getElementById('signin').style.visibility = "hidden";
                makeDropDownMenu(JSON.parse(this.responseText));
            }
            return false;
        }
    };
    xhttp.open("GET", query, true);
    xhttp.send();
    return false;
}


function makeDropDownMenu(jsObj){
    var select = document.getElementById("companyDropdown");

    for( var i=0; i<jsObj.length; i++){
        var option = document.createElement("option");
        option.value = jsObj[i].corpsymbol;
        option.text = jsObj[i].corpname;
        select.add(option);
    }
}

function getStockData() {
    
    //Assign user values to variables to build query
    var companySymbol = document.getElementById("companyDropdown").value;
    var startDate = document.getElementById("startDate").value;
    var endDate = document.getElementById("endDate").value;

    //Check for bad input
    if (companySymbol=="None"){
        alert("Please choose a company.");
        return;
    }
    if (startDate==""){
        alert("Please choose a start date");
        return;
    }
    if (endDate==""){
        alert("Please choose an end date");
        return;
    }
    if (startDate.substring(0,4) != endDate.substring(0,4)) {
            if (parseInt(startDate.substring(0,4)) != parseInt(endDate.substring(0,4))- 1) {
                alert("Please choose a valid date range, it seems your years are questionable");
                return;
            }
    }
    
    var startD = new Date(startDate);
    var endD = new Date(endDate);

    var daysBetweenDiffMonths = 31 - startD.getDate() + endD.getDate();
    if (startD.getFullYear() > endD.getFullYear()) {
            alert("Please choose a valid date range, it seems your years are questionable");  
            return;
    }
    console.log(startD.getMonth());
    if (startD.getFullYear() < endD.getFullYear()) {
        if (startD.getMonth() != 11) {
            alert("Please choose a valid date range, it seems your years are questionable");  
            return;
        }
    }
    
    if (startD.getMonth() > endD.getMonth() && endD.getFullYear() <= startD.getFullYear()) {
            alert("Please choose a valid date range, it seems your months are questionable");  
            return;
    }

    if (startD.getDate() > endD.getDate() - 5) {
        if (startD.getMonth() != endD.getMonth() - 1 && startD.getMonth() != 11) {
            alert("Please choose a valid date range, it seems your days are questionable");
            return;
        }
        if (daysBetweenDiffMonths > 31) {
            alert("Please choose a valid date range, it seems your days are questionable");
            return;
        }
    }
    
    if (startD.getMonth() < endD.getMonth()) {
        if (daysBetweenDiffMonths > 31) {
        alert("Please choose a valid date range, it seems your months are questionable");
            return;
        }
        if (startD.getMonth() < endD.getMonth() - 1) {
            alert("Please choose a valid date range, it seems your months are questionable");
            return;
        }
    }

    //Build query
    var query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%3D%22" + companySymbol + "%22%20and%20startDate%20%3D%20%22" + startDate + "%22%20and%20endDate%20%3D%20%22" + endDate + "%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('stockChart').style.visibility = "visible";
            document.getElementById('barChart').style.visibility = "visible";

            if (count == 1) {
                d3.select("svg#chart").remove();
                d3.select("svg").remove();
            }
            makeAndShowChart(JSON.parse(this.responseText).query.results.quote);
            makeAndShowBarChart(JSON.parse(this.responseText).query.results.quote);

        }
    };
    xhttp.open("GET", query, true);
    xhttp.send();
}



//Used http://bl.ocks.org/d3noob/8603837 as reference
function makeAndShowChart(data){
if (count == 0) {
    count = 1;
}
var	margin = {top: 30, right: 40, bottom: 30, left: 60},
	width = 1000 - margin.left - margin.right,
	height = 470 - margin.top - margin.bottom;

//var	parseDate = d3.time.format("%y-%m-%d").parse;

var	x = d3.time.scale().range([0, width]);
var	y = d3.scale.linear().range([height, 0]);

var	xAxis = d3.svg.axis().scale(x)
	.orient("bottom");

var	yAxis = d3.svg.axis().scale(y)
	.orient("left");

var	open = d3.svg.line()
	.x(function(d) { return x(d.Date); })
	.y(function(d) { return y(d.Open); });
	
var	close = d3.svg.line()
	.x(function(d) { return x(d.Date); })
	.y(function(d) { return y(d.Close); });
  
var high = d3.svg.line()
	.x(function(d) { return x(d.Date); })
	.y(function(d) { return y(d.High); });
  
var low = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Low); });

var avg = d3.svg.line()
    .x(function(d) {return x(d.Date); })
    .y(function(d) {return y((d.High+ d.Low) /2.0);});
    
var svg = d3.select("#stockChart")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("id", "chart")

	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get the data
	data.forEach(function(d) {
		d.Date = +(d3.time.format('%Y-%m-%d').parse(d.Date));
		d.Close = +d.Close;
		d.Open = +d.Open;
		d.High = +d.High;
		d.Low = +d.Low;
	});

	// Scale the range of the data
	x.domain(d3.extent(data, function(d) { return d.Date; }));
	y.domain([d3.min(data, function(d) {return Math.min(d.Close, d.Open, d.High, d.Low)}), d3.max(data, function(d) { return Math.max(d.Close, d.Open, d.High, d.Low); })]);

	svg.append("path")		// Add the valueline path.
		.attr("class", "line")
		.style("stroke", "steelblue")
		.attr("d", open(data));

	svg.append("path")		// Add the valueline2 path.
		.attr("class", "line")
		.style("stroke", "purple")
		.attr("d", close(data));

	svg.append("path")		// Add the valueline3 path.
		.attr("class", "line")
		.style("stroke", "orange")
		.attr("d", high(data));

	svg.append("path")		// Add the valueline4 path.
		.attr("class", "line")
		.style("stroke", "brown")
		.attr("d", low(data));
		
	svg.append("path")		// Add the valueline5 path.
		.attr("class", "line")
		.style("stroke", "pink")
		.attr("d", avg(data));



	svg.append("g")			// Add the X Axis
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	svg.append("g")			// Add the Y Axis
		.attr("class", "y axis")
		.call(yAxis);

	svg.append("text")
		.attr("transform", "translate(" + (width+5) + "," + y(data[0].Open) + ")")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "steelblue")
		.text("Open");

	svg.append("text")
		.attr("transform", "translate(" + (width-50) + "," + y(data[0].Close) + ")")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "purple")
		.text("Close");
		
	svg.append("text")
		.attr("transform", "translate(" + (width-50) + "," + y(data[0].High) + ")")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "orange")
		.text("High");
		
	svg.append("text")
		.attr("transform", "translate(" + (width-40) + "," + y(data[0].Low) + ")")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "brown")
		.text("Low");

	svg.append("text")
		.attr("transform", "translate(" + (width-40) + "," + (y(data[0].Low) + y(data[0].High)) /2 + ")")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "pink")
		.text("Average")

    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width/2) +","+(height + 30) +")")  // centre below axis
        .text("Date");
        
    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ -40+","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("Price");
}
