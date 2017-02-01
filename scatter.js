var margin = { top: 50, right: 300, bottom: 50, left: 50 },
    outerWidth = 1050,
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();

var xCat = "IMDRank",
    yCat = "ind2value",
    rCat = "ind4value",
    colorCat = "regioncode",
    legendEntries = [],
    areaLabel = "hospname";
    


d3.csv("data/hospital_georef_data_correlotron_region.csv", function(data) {
  data.forEach(function(d) {
    d.hbscore = +d.hbscore;
    d.hospcode = +d.hospcode;
    //d.hospname = +d.hospname;
    d.obs1url = +d.obs1url;
    d.ind1url = +d.ind1url;
    d.ind1value = +d.ind1value;
    d.obs2url = +d.obs2url;
    d.ind2url = +d.ind2url;
    d.ind2value = +d.ind2value;
    d.obs3url = +d.obs3url;
    d.ind3url = +d.ind3url;
    d.ind3value = +d.ind3value;
    d.obs4url = +d.obs4url;
    d.ind4url = +d.ind4url;
    d.ind4value = +d.ind4value;
    //d.regionname = +d.regionname;
    //d.regioncode = +d.regioncode;
    d.IMDRank = +d.IMDRank;
    legendEntries.push({regioncode: d.regioncode, regionname: d.regionname});
  });

  var xMax = d3.max(data, function(d) { return d[xCat]; }) * 1.05,
      xMin = d3.min(data, function(d) { return d[xCat]; }),
      //xMin = xMin > 0 ? 0 : xMin,
      yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05,
      yMin = d3.min(data, function(d) { return d[yCat]; }),
      //yMin = yMin > 0 ? 0 : yMin,
      rMax = d3.max(data, function(d) { return d[rCat]; }),
      rModifier = 1+(100/rMax);

      

  x.domain([xMin, xMax]);
  y.domain([yMin, yMax]);
  xCatLabel = $('#x_select option:selected').text();
  yCatLabel = $('#y_select option:selected').text();
  rCatLabel = $('#r_select option:selected').text();

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width);

  var color = d3.scale.category10();

  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return d[areaLabel] + "<br>" + xCatLabel + ": " + d[xCat] + "<br>" + yCatLabel + ": " + d[yCat] + "<br>" + rCatLabel + ": " + d[rCat];
      });

  var zoomBeh = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on("zoom", zoom);

  var svg = d3.select("#scatter")
    .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoomBeh);

  svg.call(tip);

  svg.append("rect")
      .attr("width", width)
      .attr("height", height);

  svg.append("g")
      .classed("x axis", true)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .classed("label", true)
      .attr("x", width)
      .attr("y", margin.bottom - 10)
      .style("text-anchor", "end")
      .text(xCatLabel);

  svg.append("g")
      .classed("y axis", true)
      .call(yAxis)
    .append("text")
      .classed("label", true)
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(yCatLabel);

  var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);

  objects.append("svg:line")
      .classed("axisLine hAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("transform", "translate(0," + height + ")");

  objects.append("svg:line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);

  objects.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .classed("dot", true)
      .attr("r", function (d) { return rModifier * Math.sqrt(d[rCat] / Math.PI); })
      .attr("transform", transform)
      .attr("id" , function(d) { return d.regioncode; } )
      .style("fill", function(d) { return color(d[colorCat]); })
      .style("fill-opacity", 0.5)
      .style("stroke-width",2)
      .style("stroke-opacity",0)
      .style("stroke","#111")
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);
      

  
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .classed("legend", true)
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
      
  legend.append("text")
      .attr("x", width + 30)
      .attr("dy", ".35em")
      .attr("font-weight", "bold")
      .attr("id", function(d) {return d + "ltext";})
      .text(function (d) { 
          for (var i=0, iLen=legendEntries.length; i<iLen; i++)
            if (legendEntries[i].regioncode == d)
          break       
          return legendEntries[i].regionname;
      }); 

  legend.append("circle")
      .attr("r", 8)
      .attr("cx", width + 20)
      .style("fill", color)
      .style("fill-opacity", 0.5)
      .style("stroke-width", 1)
      .style("stroke-opacity", 0.8)
      .style("stroke", '#111')
      .attr("id", function(d) {return d;})
      .on("click", function (d, i) {
                      // register on click event
                      var lVisibility = this.style['fill-opacity']
                      ltvisibility = document.getElementById(d + 'ltext').attributes['font-weight'].value;
                      filterGraph(d, lVisibility, ltvisibility);
                   });

  
       

  d3.select("input").on("click", change);

  function change() {
    xCat = d3.select("#x_select").node().value;
    yCat = d3.select("#y_select").node().value;
    rCat = d3.select("#r_select").node().value;
    xCatLabel = $('#x_select option:selected').text();
    yCatLabel = $('#y_select option:selected').text();
    rCatLabel = $('#r_select option:selected').text();
    console.log(xCatLabel);
    

    xMax = d3.max(data, function(d) { return d[xCat]; });
    xMin = d3.min(data, function(d) { return d[xCat]; });
    yMax = d3.max(data, function(d) { return d[yCat]; });
    yMin = d3.min(data, function(d) { return d[yCat]; });
    rMax = d3.max(data, function(d) { return d[rCat]; });
    rModifier = 1+(100/rMax);


    zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

    var svg = d3.select("#scatter").transition();

    svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCatLabel);
    svg.select(".y.axis").duration(750).call(yAxis).select(".label").text(yCatLabel);

    objects.selectAll(".dot")
        .transition().duration(1000)
        .attr("transform", transform)
        .attr("r", function (d) { return rModifier * Math.sqrt(d[rCat] / Math.PI); });
  }

  function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
        .attr("transform", transform);
  }

  function transform(d) {
    return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
  }

  function highlightCircle (circle, strokeFlag) {
        if (strokeFlag == 0)
            {newStroke = 1}
          else {newStroke = 0};
        d3.selectAll("#" + circle).style("stroke-opacity", newStroke);
  }

  // Method to filter graph
    function filterGraph( aRegion, aVisibility, ltvisibility) {
        
          newOpacity = 0.5 - aVisibility ;
          
          if (ltvisibility == 'bold') 
            { newWeight = 'normal' }
          else { newWeight = 'bold'};

         
        // Hide or show the elements
        d3.selectAll("#" + aRegion).style("fill-opacity", newOpacity);
        d3.selectAll("#" + aRegion + "ltext").attr("font-weight", newWeight);
        
    }

  

  

});