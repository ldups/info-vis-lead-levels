export function draw_schools(svg, schools, projection) {
    const dots = svg.append("g")
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
        .style("opacity", 0);
        
    dots.transition()
        .delay((d, i) => i * 5)
        .duration(300)
        .style("opacity", 1);

        const tooltip = d3.select("#tooltip");

        dots.on("mouseover", (event, d) => {
            tooltip.style("display", "block")
                .html("<span class='tooltip-text-blue'>" + d.Publication_Name + " ("+ d.School_Level + ")</span>")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mousemove", (event, d) => {
            tooltip.style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", () => {
            tooltip.style("display", "none");
        });
}
