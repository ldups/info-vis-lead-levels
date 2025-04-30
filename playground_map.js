export function draw_playgrounds(svg, playgrounds, projection) {
    svg.append("g")
        .attr("class", "playground-dots")
        .selectAll("circle")
        .data(playgrounds)
        .join("circle")
        .attr("cx", d => projection([+d.X, +d.Y])[0])
        .attr("cy", d => projection([+d.X, +d.Y])[1])
        .attr("r", 3)
        .attr("fill", "#43A047")  
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .style("opacity", 0)
        .transition()
        .delay((d, i) => i * 5)
        .duration(300)
        .style("opacity", 1);
}
