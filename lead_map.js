export function lead_map(svg, lead_dictionary, topology){    
        // map constants
        var projection = d3.geoAlbersUsa().fitSize([500,500], topology);
        var path = d3.geoPath(projection);
    
        // scale for lead levels
        var lead_scale = d3.scaleSequential()
        .domain(d3.extent(lead_dictionary.values()))
        .range(["white", "red"]);

    
        svg.append("g")
        .selectAll("path")
        .data(topology.features)
        .join("path")
        .transition()
        .delay((d, i) => 20 * i)
        .duration(400)
            .attr("d", path)
            .attr("fill", (d) => lead_scale(d.properties.perc_5plus))
            .attr("stroke", "black")
            .attr("stroke-width", "1px");

}