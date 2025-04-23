export function housing_map(svg, housing_dictionary, topology){
    // map constants
    var projection = d3.geoAlbersUsa().fitSize([500,500], topology);
    var path = d3.geoPath(projection);

    // scale for lead levels
    var housing_scale = d3.scaleSequential()
    .domain(d3.extent(housing_dictionary.values()))
    .range(["white", "chocolate"]);

    svg.append("g")
    .selectAll("path")
    .data(topology.features)
    .join("path")
    .transition()
    .delay((d, i) => 20 * i)
    .duration(400)
    .attr("d", path)
    .attr("fill", (d) => {
        return housing_scale(housing_dictionary.get("" + d.properties.zip_code))}
    )
    .attr("stroke", "black")
    .attr("stroke-width", "1px");
}