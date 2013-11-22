$(function() {
$('#tooltip').hide();
    var socket = io.connect(window.location.hostname);
    var date;
    socket.on('data', function(results) {
    	var counts = results[0];
    	var data = results[2];
    	var places = results[1];
		$('#map-view').empty();
		var w = $('#map-view').width();
        var h = 450;
        var margin = {top: 40, right: 10, bottom: 20, left: 10},
            width = w - margin.left - margin.right - 100,
            height = h - margin.top - margin.bottom - 100,
            svg_width = w,
            svg_height = h;
            
            //Create SVG element

        var projection = d3.geo.albersUsa()
            .scale(w*11.3)
            .translate([(-1.65)*w, (-0.45)*h]);

        var path = d3.geo.path()
            .projection(projection);


        var svg = d3.select('#map-view')
            .append("svg")
            .attr("width", svg_width)
            .attr("height", svg_height);

        svg.append("rect")
            .attr("class", "background")
            .attr("width", svg_width)
            .attr("height", svg_height);
                

        var g = svg.append("g");

        d3.json("us.json", function(error, us) {
            g.append("g")
              .attr("id", "states")
            .selectAll("path")
              .data(topojson.feature(us, us.objects.states).features)
            .enter().append("path")
              .attr("d", path);

            g.append("path")
              .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
              .attr("id", "state-borders")

           places.forEach(function(d,i) {
           		console.log(d.coords);
				var coords = projection(d.coords);
				console.log(d);
				g.append('circle')
					.attr('cx', coords[0])
					.attr('cy', coords[1])
					.attr('r', 4)
					.style('fill', d.color)
					.style('stroke', '#000')
					.on("mouseover", function() {
	                    $('#tooltip').fadeIn();
	                    //Get this bar's x/y values, then augment for the tooltip
	                    var xPosition = d3.event.pageX-40;
	                    var yPosition = d3.event.pageY+20;
	                    //Update Tooltip Position & value
	                    d3.select("#tooltip")
	                        .style("left", xPosition+'px')
	                        .style("top", yPosition+'px')
	                        .html('<b class="teamname">'+d.team+'</b><br/>'+d.place);
	                })
	                .on("mouseout", function() {
	                    //Remove the tooltip
	                    $('#tooltip').hide();
	                });
			});
		});

       $('#bar-view').empty();
        var chart_width = $('#bar-view').width();
		var margin = {top: 0, right: 50, bottom: 0, left: 80},
		    width = chart_width-margin.left-margin.right,
		    height = 80 - margin.top - margin.bottom;

		var chart_data = [
			{ "school": counts[2][0], "count":counts[1][0], "color":counts[3][0] },
			{ "school": counts[2][1], "count":counts[1][1], "color":counts[3][1] }
		];
		

	  	var barWidth = 35;
		//var width = (barWidth + 10) * chart_data.length;

		var y = d3.scale.linear().domain([0, chart_data.length]).range([0, height]);
		var x = d3.scale.linear().domain([0, d3.max(chart_data, function(datum) { return datum.count; })]).
		  rangeRound([0, width]);

		// add the canvas to the DOM
		var bar = d3.select("#bar-view")
		  .append("svg:svg")
		  .attr("width", chart_width)
		  .attr("height", height);

		bar.selectAll("rect")
		  .data(chart_data)
		  .enter()
		  .append("svg:rect")
		  .attr("y", function(d, index) { return y(index); })
		  .attr("x", function(d) { return margin.left+15 })
		  .attr("width", function(d) { return x(d.count); })
		  .attr("height", barWidth)
		  .attr("fill", function(d) { return d.color; });

		bar.selectAll(".bar-title")
			.data(chart_data)
			.enter()
			  .append("svg:text")
			  .attr("class","bar-title")
			  .attr("y", function(d, index) { return y(index) + barWidth; })
			  .attr("x", margin.left-5)
			  .attr("dy", -barWidth/2 +3)
			  .attr("dx", "1em")
			  .attr("text-anchor", "end")
			  .text(function(datum) { return datum.school;})
			  .attr("fill", "black");

		bar.selectAll(".bar-val")
			.data(chart_data)
			.enter()
			  .append("svg:text")
			  .attr("class","bar-val")
			  .attr("y", function(d, index) { return y(index) + barWidth; })
			  .attr("x", function(d) { return x(d.count) + margin.left + 5 })
			  .attr("dy", -barWidth/2 +3)
			  .attr("dx", "1em")
			  .attr("text-anchor", "start")
			  .text(function(datum) { return datum.count;})
			  .attr("fill", "black");

		$('.tweet-list  ul').empty();
		var uga = [];
		var gt = [];
		data.forEach(function(d,i){
			console.log(d.team);
			if (d.team=='Georgia'){
				var tweet_html = '<li><i class="fa fa-twitter fa-2x georgia""></i><p>'+d.tweet+'</p></li>';
				uga.push(tweet_html);

			} if (d.team=='Georgia Tech'){
				var tweet_html = '<li><i class="fa fa-twitter fa-2x tech""></i><p>'+d.tweet+'</p></li>';
				gt.push(tweet_html);
			}
		
		});
		uga.forEach(function(d,i){
			if (i>(uga.length-4)){
				$('#uga ul').append(d);
			}
		});
		gt.forEach(function(d,i){
			if (i>(gt.length-4)){
				$('#gt ul').append(d);
			}
		})
		
	



   	});
});