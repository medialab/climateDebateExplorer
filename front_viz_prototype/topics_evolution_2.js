var targetFile = "../app/data/sections_metadata.csv"

var margin = {top: 20, right: 200, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y%m%d").parse;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("cardinal")
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.volume); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(targetFile, function(error, data) {
  if (error) throw error;

  // Topics as an array
  data.forEach(function(d){
    d.topics = d.topics.split('|').filter(function(d){ return d != '' })
  })

  // Total yearly
  var totalVolumeYearly = {}
  data.forEach(function(d){
    totalVolumeYearly[d.year] = ( totalVolumeYearly[d.year] || 0 ) + 1
  })

  // Agregate volume
  var volumeByTopicYearly = {}
  data.forEach(function(d){
    d.topics.forEach(function(topic){
      var volumeYearly = volumeByTopicYearly[topic] || {}
        , volume = ( volumeYearly[d.year] || 0 ) + ( 100 / totalVolumeYearly[d.year] )
      volumeYearly[d.year] = volume
      volumeByTopicYearly[topic] = volumeYearly
    })
  })

  // Flatten data
  var volumes = []
  for ( var topic in volumeByTopicYearly ) {
    for ( var year = 1995 ; year <= 2015 ; year++ ) {
      volumes.push({
        topic: topic
      , year: year
      , volume: volumeByTopicYearly[topic][year] || 0
      })
    }
  }

  // Curves by topic
  var nested_data = d3.nest()
    .key(function(d) { return d.topic; })
    .entries(volumes)
    .filter(function(d, i){
        // return d3.max(d.values.map(function(d2){return d2.volume})) >= 10
        return d.key == 'Vulnerabilities and Impacts'
          || d.key == 'Adverse Effects and Response Measure'
          // || d.key == 'Reasons for Concern'
          || d.key == 'Financial Mechanisms and Funds'
          || d.key == 'forests'
          || d.key == 'Loss and Damage'
      })

  color.domain(nested_data.map(function(d){return d.key}));

  x.domain(d3.extent(volumes, function(d) { return d.year; }));

  y.domain([
    d3.min(nested_data, function(volumes) { return d3.min(volumes.values, function(d) { return d.volume; }); }),
    d3.max(nested_data, function(volumes) { return d3.max(volumes.values, function(d) { return d.volume; }); })
  ]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("x", width)
      .attr("y", 30)
      .style("text-anchor", "end")
      .text("Year");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Volume (%)");

  var topic = svg.selectAll(".topic")
      .data(nested_data)
    .enter().append("g")
      .attr("class", "topic");

  topic.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.key); });

  topic.append("text")
      .datum(function(d) { return {name: d.key, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.volume) + ")"; })
      .attr("x", 3)
      .attr("y", function(d){
          if ( d.name == "Vulnerabilities and Impacts" ) {
            return -5
          }
          return 0
        })
      .attr("dy", '.35em')
      .style("fill", function(d) { return color(d.name); })
      .text(function(d) {
        return d.name;
      })
});