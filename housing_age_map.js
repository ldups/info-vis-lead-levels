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
    .interpolator(d3.interpolateBuPu);

    var zips = svg.append("g")
    .selectAll("path")
    .data(topology.features)
    .join("path")
    .attr("stroke", "black")
    .attr("stroke-width", "1px");

    const tooltip = d3.select("#tooltip");

    zips.on("mouseover", (event, d) => {
        tooltip.style("display", "block")
            .html(d.properties.zip_code + " - " + housing_dictionary.get("" + d.properties.zip_code).toFixed(2) + "% built before 1980")
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

    zips.transition()
    .delay((d, i) => 20 * i)
    .duration(400)
    .attr("d", path)
    .attr("fill", (d) => {
        return housing_scale(housing_dictionary.get("" + d.properties.zip_code))}
    )

    const margins = { top: 10, right: 30, bottom: 55, left: 30 };

    const x_scale = d3.scaleLinear()
        .domain(d3.extent(housing_dictionary.values()))
        .range([margins.left, width - margins.right]);

    color_legend(svg, housing_scale, x_scale, margins, width, height, "Percent homes built before 1980");

    const legend = d3.select("#legend-svg");

    legend.append("text")
            .attr("x", margins.left)
            .attr("y", height-60)
            .text("(Lead paint in homes was banned in 1978.)")
            .style("font-size", "13px")
            .attr("alignment-baseline", "middle");
}