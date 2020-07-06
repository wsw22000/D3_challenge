var svgWidth = 960;
var svgHeight = 500;
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read in data.csv
d3.csv('./assets/data/data.csv').then(function(allData){
    console.log(allData);

    // Step 1: Parse Data/Cast as numbers (age, % smokers)
    allData.forEach(function(data){
        data.age = +data.age;
        data.smokes = +data.smokes;
    });

    // Step 2: Create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(allData, d => d.age)-1, d3.max(allData, d => d.age)+1])
        .range([0, width]);
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(allData, d => d.smokes)+5])
        .range([height, 0]);

    // Step 3: Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    chartGroup.append("g")
        .call(leftAxis);    

    // Step 5a: Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(allData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "10")
    .attr("fill", "green")
    .attr("opacity", ".5")
    .text("hello");

    // Step 5b: Create Circle Labels
    var circleLabels = chartGroup.selectAll(null).data(allData).enter().append("text");
    circleLabels
    .attr("x", d => xLinearScale(d.age))
    .attr("y", d => yLinearScale(d.smokes))
    .text(d => d.abbr)
    .attr("font-family", "sans-serif")
    .attr("font-size", "9px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");

    // Step 6: Initialize tool tip
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .attr("font-size", "9px")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}<br>Average Age: ${d.age}<br>%Smokers: ${d.smokes}`);
    });

    // Step 7: Create tooltip in the chart
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
      })

        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smokers in Population (%)");
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Average Age (yrs)");
      
  }).catch(function(error) {
    console.log(error);
  });





