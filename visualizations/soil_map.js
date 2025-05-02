export function soil_map(svg, soil, topology){
    const width = 500;
    const height = 600; 
    // map constants
    var projection = d3.geoAlbersUsa().fitSize([width-75,height-75], topology);
    var path = d3.geoPath(projection);

    const filtered_soil =  soil.filter((d) => !Number.isNaN(+d.Pb_Content));
    const safe_soil = filtered_soil.filter((d) => +d.Pb_Content < 400);
    const dangerous_soil = filtered_soil.filter((d) => +d.Pb_Content >= 400);
    // scale for lead levels
    var lead_contents_dangerous = dangerous_soil.map(a => +a.Pb_Content);
    var lead_contents = filtered_soil.map(a => +a.Pb_Content);
     
    const lead_scale = d3.scaleLog()
        .domain(d3.extent(lead_contents_dangerous))
        .range([d3.rgb("red"), d3.rgb("black")])
        .interpolate(d3.interpolateRgb);

    const lead_scale_radius = d3.scaleLinear()
        .domain(d3.extent(lead_contents))
        .range([1, 50]);

    svg.append("g")
        .selectAll("path")
        .data(topology.features)
        .join("path")
        .attr("d", path)
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("fill", "white");

        const safe_dots = svg.append("g")
        .attr("class", "soil-dots")
            .selectAll("circle")
            .data(safe_soil)
            .join("circle")
            .attr("cx", d => projection([+d.Longitude, +d.Latitude])[0])
            .attr("cy", d => projection([+d.Longitude, +d.Latitude])[1])
            .attr("r", 2)
            .attr("fill", "green")  
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .style("opacity", 1);

    const dangerous_dots = svg.append("g")
    .attr("class", "soil-dots")
        .selectAll("circle")
        .data(dangerous_soil)
        .join("circle")
        .attr("cx", d => projection([+d.Longitude, +d.Latitude])[0])
        .attr("cy", d => projection([+d.Longitude, +d.Latitude])[1])
        .attr("r", 2)
        .attr("fill", d => lead_scale(+d.Pb_Content))  
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .style("opacity", 1);

    dangerous_dots.transition()
        .attr("r", (d) => lead_scale_radius(+d.Pb_Content))
        .style("opacity", 0.5)
        .duration(10000);

    safe_dots.transition()
        .attr("r", (d) => lead_scale_radius(+d.Pb_Content))
        .style("opacity", 0.5)
        .duration(10000);

    const tooltip = d3.select("#tooltip");

        dangerous_dots.on("mouseover", (event, d) => {
            tooltip.style("display", "block")
                .html(d.Pb_Content + " mg/kg")
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

        safe_dots.on("mouseover", (event, d) => {
            tooltip.style("display", "block")
                .html(d.Pb_Content + " mg/kg")
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

    const legend = svg.append("g")
        .attr("transform", "translate(0, 80)");
         
    legend.append("circle")
               .attr("cx", 15)
               .attr("cy", 5)
               .attr("r", 7)
               .style("fill", "red");
         
    legend.append("text")
            .attr("x", 30)
            .attr("y", 6)
            .text("< 400 mg/kg")
            .attr("alignment-baseline", "middle");
    
    legend.append("circle")
            .attr("cx", 15)
            .attr("cy", 30)
            .attr("r", 7)
            .style("fill", "green");
         
    legend.append("text")
            .attr("x", 30)
            .attr("y", 31)
            .text(">= 400 mg/kg")
            .attr("alignment-baseline", "middle");

    svg.append("text")
            .attr("x", 15)
            .attr("y", 550)
            .text("(Radius proportional to lead level)")
            .style("font-size", "16px")
            .attr("alignment-baseline", "middle");
}