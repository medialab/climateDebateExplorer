(function(ns){ 

  ns.data = null;

  ns.color = d3.scale.category10();

  ns.draw_all = function(placeholders, data, callback) {
    if (data && !ns.data) {
      ns.data = data;
    }
    ns.draw_main_topics(placeholders[0]);
    ns.draw_other_topics(placeholders[1]);
    ns.draw_groupings(placeholders[2]);
    ns.list_countries(placeholders[3]);
  }

  var container = document.getElementById('viz');
  ns.getWidth = function() {
    return container.offsetWidth;
  }
  ns.getHeight = function() {
    return container.offsetHeight;
  }

  ns.draw_groupings = function(el_id, data){

    data = data || ns.data;

    var margin = {top: 40, right: 250, bottom: 70, left: 50},
        width = ns.getWidth() - margin.left - margin.right,
        height = ns.getHeight() - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]);


    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.format(".0f"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .interpolate("cardinal")
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.volume); });

    d3.select(el_id).select("svg").remove();
    var svg = d3.select(el_id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Actors as an array
    data.forEach(function(d){
      if (typeof(d.actors) === "string")
        d.actors = d.actors.split('|').filter(function(d){ return d != '' })
    })
  
    // Total yearly
    var totalVolumeYearly = {}
    data.forEach(function(d){
      totalVolumeYearly[d.year] = ( totalVolumeYearly[d.year] || 0 ) + 1
    })
  
    // Agregate volume
    var volumeByActorYearly = {}
    data.forEach(function(d){
      d.actors.forEach(function(actor){
        var volumeYearly = volumeByActorYearly[actor] || {}
          , volume = ( volumeYearly[d.year] || 0 ) + ( 100 / totalVolumeYearly[d.year] )
        volumeYearly[d.year] = volume
        volumeByActorYearly[actor] = volumeYearly
      })
    })
  
    // Flatten data
    var volumes = []
    for ( var actor in volumeByActorYearly ) {
      for ( var year = 1995 ; year <= 2015 ; year++ ) {
        volumes.push({
          actor: actor
        , year: year
        , volume: volumeByActorYearly[actor][year] || 0
        })
      }
    }
  
    // Curves by actor
    var nested_data = d3.nest()
      .key(function(d) { return d.actor; })
      .entries(volumes)
      .filter(function(d, i){
          return d3.max(d.values.map(function(d2){return d2.volume})) > 10
        })
  
    ns.color.domain(nested_data.map(function(d){return d.key}));
  
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
  
    var actor = svg.selectAll(".actor")
        .data(nested_data)
      .enter().append("g")
        .attr("class", "actor");
  
    actor.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return ns.color(d.key); });
  
    actor.append("text")
        .datum(function(d) { return {name: d.key, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.volume) + ")"; })
        .attr("x", 3)
        .attr("y", function(d){
          // console.log(d.name)
            if ( d.name == 'Alliance of Small Island States' ) {
                return -7
              }
            if ( d.name == 'Group of 77' ) {
                return -6
              }
            if ( d.name == 'African Group' ) {
                return 0
              }
            if ( d.name == 'Independent association of Latin America and the Caribbean' ) {
                return 9
              }
            return 0
          })
        .attr("dy", '.35em')
        .style("fill", function(d) { return ns.color(d.name); })
        .text(function(d) {
          if ( d.name == "Independent association of Latin America and the Caribbean" ) {
            return "I.A. of Latin America & the Caribbean"
          } else if ( d.name == "Organisation for Economic Co.operation and Development" ) {
            return "Org. for Economic Coop. & Development"
          }
          return d.name;
        })
  
  };

  ns.draw_main_topics = function(el_id, data){
    return ns.draw_topics(el_id, data, {
        'UNFCCC and Kyoto Protocol Functioning': -3
      , 'Extension of the Kyoto protocol': -3
      , 'Post-Kyoto Agreements': 0
      , 'Pre-Kyoto': 0
      , 'Compliance and Enforcement': -6
    });
  }

  ns.draw_other_topics = function(el_id, data){
    return ns.draw_topics(el_id, data, {
        'Vulnerabilities and Impacts': -5
      , 'Adverse Effects and Response Measure': 0
      , 'Financial Mechanisms and Funds': 0
      , 'forests': 0
      , 'Loss and Damage': 0
    });
  }

  ns.draw_topics = function(el_id, data, filters){

    data = data || ns.data;

    var margin = {top: 40, right: 250, bottom: 70, left: 50},
        width = ns.getWidth() - margin.left - margin.right,
        height = ns.getHeight() - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y%m%d").parse;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.format(".0f"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .interpolate("cardinal")
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.volume); });

    d3.select(el_id).select("svg").remove();
    var svg = d3.select(el_id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Topics as an array
    data.forEach(function(d){
      if (typeof(d.topics) === "string")
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
        return Object.keys(filters).indexOf(d.key) !== -1;
      })
  
    ns.color.domain(nested_data.map(function(d){return d.key}));
  
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
        .style("stroke", function(d) { return ns.color(d.key); });
  
    topic.append("text")
        .datum(function(d) { return {name: d.key, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.volume) + ")"; })
        .attr("x", 3)
        .attr("y", function(d){
            return filters[d.name];
          })
        .attr("dy", '.35em')
        .style("fill", function(d) { return ns.color(d.name); })
        .text(function(d) {
          return d.name;
        })
  
  };

  ns.list_countries = function(el_id, data){

    data = data || ns.data;

    d3.select(el_id).select("div").remove();
    var html = d3.select(el_id).append('div')
    //.attr("width", width + margin.left + margin.right)
    //.attr("height", height + margin.top + margin.bottom)

    ns.getCountryClass = function(d){
      return 'country-' + d.country.toLowerCase().replace(/[^a-z]*/gi, '')
    }

    // Countries as an array
    data.forEach(function(d){
      if (typeof(d.countries) === "string")
        d.countries = d.countries.split('|').filter(function(d){ return d != '' })
    })
  
    // Total yearly
    var totalVolumeYearly = {}
    data.forEach(function(d){
      totalVolumeYearly[d.year] = ( totalVolumeYearly[d.year] || 0 ) + 1
    })
  
    // Agregate volume
    var volumeByCountryYearly = {}
    data.forEach(function(d){
      d.countries.forEach(function(actor){
        var volumeYearly = volumeByCountryYearly[actor] || {}
          , volume = ( volumeYearly[d.year] || 0 ) + ( 100 / totalVolumeYearly[d.year] )
        volumeYearly[d.year] = volume
        volumeByCountryYearly[actor] = volumeYearly
      })
    })
  
    // Flatten data
    var volumes = []
    for ( var country in volumeByCountryYearly ) {
      for ( var year = 1995 ; year <= 2015 ; year++ ) {
        volumes.push({
          country: country
        , year: year
        , volume: volumeByCountryYearly[country][year] || 0
        })
      }
    }
  
    // Top 5 country each year
    var nested_data = d3.nest()
      .key(function(d) { return d.year; })
      // .key(function(d) { return d.countries; })
      .entries(volumes)
    nested_data.forEach(function(d){
      d.values.sort(function(a, b){
            return b.volume - a.volume
          })
  
      d.values = d.values.filter(function(d2, i2){
            return i2 < 5
          })
    })
  
    var countries = {}
    nested_data.forEach(function(d){
      d.values.forEach(function(d2){
        countries[d2.country] = true
      })
    })
  
    ns.color.domain(d3.keys(countries));
  
    var year = html.selectAll(".year")
        .data(nested_data)
      .enter().append("div")
        .attr("class", "year");
  
    year
      .text(function(d) {
          return d.key;
        })
      .selectAll('.country')
        .data(function(d){ 
            return d.values
          })
      .enter().append('p')
        .attr('class', function(d) { return 'overable ' + ns.getCountryClass(d) } )
        .style('color', function(d){ return ns.color(d.country) })
        .text(function(d){
            return d.country + ' ' + Math.round(d.volume) + '%'
          })
        .on('mouseenter', function(d){
            var cClass = ns.getCountryClass(d)
            ;[].forEach.call(document.querySelectorAll( '.' + cClass ), function(d){
              d.classList.add('highlight-country')
            })
          })
        .on('mouseleave', function(d){
            var cClass = ns.getCountryClass(d)
            ;[].forEach.call(document.querySelectorAll( '.' + cClass ), function(d){
              d.classList.remove('highlight-country')
            })
          })

  };

})(window.discoverviz = window.discoverviz || {});
