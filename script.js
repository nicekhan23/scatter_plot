const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const width = 960;
const height = 500;
const padding = 60;

const svg = d3.select("#chart");
const tooltip = d3.select("#tooltip");

d3.json(url).then((data) => {
  data.forEach((d) => {
    d.Time = new Date(`1970-01-01T00:${d.Time}`);
    d.Year = new Date(d.Year.toString());
  });

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.Year))
    .range([padding, width - padding]);

  const yScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.Time))
    .range([padding, height - padding]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));

  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);

  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d) => d.Year.toISOString())
    .attr("data-yvalue", (d) => d.Time.toISOString())
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(d.Time))
    .attr("r", 6)
    .attr("fill", (d) => (d.Doping ? "orange" : "steelblue"))
    .on("mouseover", function (event, d) {
      tooltip.transition().style("opacity", 0.9);
      tooltip
        .html(
          `${d.Name} (${d.Nationality})<br/>
               Year: ${d.Year.getFullYear()}, Time: ${d3.timeFormat("%M:%S")(
            d.Time
          )}<br/>
               ${d.Doping ? d.Doping : "No doping allegations"}`
        )
        .attr("data-year", d.Year.toISOString())
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 40 + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().style("opacity", 0);
    });
});
