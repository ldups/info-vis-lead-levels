export function draw_schools(svg, schools, projection) {
    svg.append("g")
        .attr("class", "school-dots")
        .selectAll("circle")
        .data(schools)
        .join("circle")
        .attr("cx", d => projection([+d.Longitude, +d.Latitude])[0])
        .attr("cy", d => projection([+d.Longitude, +d.Latitude])[1])
        .attr("r", 3)
        .attr("fill", "#1565C0")
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .style("opacity", 0)
        .transition()
        .delay((d, i) => i * 5)
        .duration(300)
        .style("opacity", 1);
}
