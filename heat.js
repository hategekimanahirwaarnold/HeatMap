const tooltip = document.getElementById("tooltip");

const padding = 150;
const w = 1700;
const h = 800;

let color1 = "rgb(73, 73, 241)";
let color2 = "aqua";
let color3 = "rgb(255, 249, 167)";
let color4 = "rgb(247, 165, 13)";
let color5 = "rgb(236, 114, 43)";
let color6 = "rgb(247, 48, 13)";


const dopColor = "rgb(229, 176, 250)";
const undopColor = "greenyellow";
const svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

var legendData = [
  { color: color1, label: "[0\u00B0C, 4\u00B0C[" },
  { color: color2, label: "[4\u00B0C, 6\u00B0C[" },
  { color: color3, label: "[6\u00B0C, 8\u00B0C[" },
  { color: color4, label: "[8\u00B0C, 10\u00B0C[" },
  { color: color5, label: "[10\u00B0C, 12\u00B0C[" },
  { color: color6, label: "[12\u00B0C, 14\u00B0C]"},
];

var legend = svg.append("g")
  .attr("id", "legend")
  .selectAll("g")
  .data(legendData)
  .enter()
  .append("g")
  .attr("transform", function (d, i) {
    return "translate("+ i * 90 + ", 0)";
  });
legend.append("rect")
  .attr("x", padding)
  .attr("y", h-50)
  .attr("width", 90)
  .attr("height", 18)
  .style("fill", function (d) {
    return d.color;
  });

legend.append("text")
  .attr("x", padding)
  .attr("y", h-20)
  .attr("dx", "0em")
  .text(function (d) {
    return d.label;
  });
  const months = {
    "1" : "January",
    "2" : "February",
    "3" : "March",
    "4" : "April",
    "5" : "May",
    "6" : "June",
    "7" : "July",
    "8" : "August",
    "9" : "September",
    "10": "October",
    "11": "November",
    "12": "December"
  }
  const monthLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let dataSet;
fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
  .then(res => res.json())
  .then(data => {
    dataSet = data.monthlyVariance;
    
    
    // y axis = month name 
    // x axis = years between 1754 and 2015

    let yMax = d3.max(dataSet, d => d.month);
    let yMin = d3.min(dataSet, d => d.month);
    let xMax = d3.max(dataSet, d => d.year);
    let xMin = d3.min(dataSet, d => d.year);
     console.log("minYear: ", xMin, "maxYear: ", xMax)
    let xScale = d3.scaleLinear()
      .domain([xMin, xMax])
      .range([padding-30, w - padding+30]);

    let yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([h - padding, padding-90]);

    let yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.format("d"));

    let yAxisGroup = svg.append("g")
      .attr("transform", `translate(${padding-30}, 0)`)
      .attr("id", "y-axis")
      .call(yAxis);

    let xAxis = d3.axisBottom(xScale)
       .tickFormat(d3.format("d"));

    let xAxisGroup = svg.append("g")
      .attr("transform", `translate(0, ${h - padding+50})`)
      .attr("id", "x-axis")
      .call(xAxis);

    xAxisGroup.selectAll(".tick text")
      .classed("tick", true);
    yAxisGroup.selectAll(".tick text")
      .text((d, i)=> {
        return monthLabels[i]
      });

      dataSet.forEach((d)=> {
        if (d.year ===1753) {
          console.log("year with 1753: ", d)
        }
      });
    svg.selectAll("rect")
      .data(dataSet)
      .enter()
      .append("rect")
      .attr("y", d => yScale(d.month))
      .attr("x", d => xScale(d.year))
      .attr("width", 7)
      .attr("height",55)
      .attr("class", "cell")
      .attr("fill", ((d) => {
        let temp = data.baseTemperature + d.variance;
        if (d.year ===1753 ) {
          console.log("inside year with month 1753: ", d)
        };
        if (temp < 4 ) {
          return color1
        } else if (temp < 6) {
          return color2
        } if(temp < 8) {
          return color3
        } if(temp < 10) {
          return color4
        } if(temp < 12) {
          return color5
        } if(temp <= 14) {
          return color6
        } else {
          console.log("not in the range: ", d);
          return "black"
        }
      }))
      .attr("data-month", d => d.month)
      .attr("data-year", d => d.year)
      .attr("data-temp", d => d.variance)
      .on("mouseover", (event, d) => {
        let id = dataSet.indexOf(d);
        let temp = data.baseTemperature + d.variance;
        // Show tooltip
        tooltip.style.display = "block";
        // Calculate tooltip position based on mouse coordinates
        const xPosition = event.pageX;
        const yPosition = event.pageY;
        // Update tooltip content with date information
          let date = d.month;
          tooltip.innerHTML = "Year: " + d.year + "<br>" + "month: " + months[date] + "<br>"
                             + "Temperature: " + temp + "\u00B0C <br>";
        // Position the tooltip
        tooltip.setAttribute("data-year", d.year);
        tooltip.style.left = xPosition -30 + "px";
        tooltip.style.top = yPosition -90 + "px";
      })
      .on("mouseout", () => {
        // Hide tooltip
        tooltip.style.display = "none";

      });

  })
  .catch(err => {
    console.log("There was an error", err);
  });
