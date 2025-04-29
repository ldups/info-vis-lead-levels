import { color_legend } from "./helpers//color_legend.js";

export function housing_map(svg, housing_dictionary, topology){
    const width = 500;
    const height = 600; 
    // map constants
    var projection = d3.geoAlbersUsa().fitSize([width-75,height-75], topology);
    var path = d3.geoPath(projection);

    // scale for lead levels
    var housing_scale = d3.scaleSequential()
    .domain(d3.extent(housing_dictionary.values()))
    .range(["white", "black"]);

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

    const margins = { top: 10, right: 30, bottom: 40, left: 30 };

    const x_scale = d3.scaleLinear()
        .domain(d3.extent(housing_dictionary.values()))
        .range([margins.left, width - margins.right]);

    color_legend(svg, housing_scale, x_scale, margins, width, height, "Percent homes built before 1980");
}