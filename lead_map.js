import { color_legend } from "./helpers//color_legend.js";

export function lead_map(svg, lead_dictionary, topology){   
        const width = 500;
        const height = 600; 
        // map constants
        var projection = d3.geoAlbersUsa().fitSize([width-75,height-75], topology);
        var path = d3.geoPath(projection);
    
        // scale for lead levels
        var lead_scale = d3.scaleSequential()
        .domain(d3.extent(lead_dictionary.values()))
        .range(["white", "red"]);

    
        var zips = svg.append("g")
        .selectAll("path")
        .data(topology.features)
        .join("path");

        const tooltip = d3.select("#tooltip");

        zips.on("mouseover", (event, d) => {
            tooltip.style("display", "block")
                .html(d.properties.zip_code + " - " +( d.properties.perc_5plus != null ?
                    d.properties.perc_5plus + "% above 5 μg/dL" :
                "No data"))
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
            .attr("fill", (d) => lead_scale(d.properties.perc_5plus))
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
        ;


        const margins = { top: 10, right: 30, bottom: 40, left: 30 };

        const x_scale = d3.scaleLinear()
            .domain(d3.extent(lead_dictionary.values()))
            .range([margins.left, width - margins.right]);

        color_legend(svg, lead_scale, x_scale, margins, width, height, "Percent children with blood lead levels >= 5 μg/dL");

        const legend = d3.select("#legend-svg");

        legend.append("rect")
            .attr("x", width-100)
            .attr("y", height-130)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", "black")
            .attr("stroke", "black");

        legend.append("text")
            .attr("x", width -70)
            .attr("y", height-120)
            .text("No data")
            .style("font-size", "12px")
            .attr("alignment-baseline", "middle");

}