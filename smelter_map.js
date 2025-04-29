export function smelter_map(svg, topology, smelters) {
    // map constraints
    var projection = d3.geoAlbersUsa().fitSize([500, 500], topology);
    var path = d3.geoPath(projection);

    // draw zip codes
    svg.append("g")
        .selectAll("path")
        .data(topology.features)
        .join("path")
        .attr("d", path)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", "1px");

    const tooltip = d3.select("#tooltip");

    // draw smelters
    svg.append("g")
        .selectAll("circle")
        .data(smelters)
        .join("circle")
        .attr("cx", d => projection([+d.longitude, +d.latitude])[0])
        .attr("cy", d => projection([+d.longitude, +d.latitude])[1])
        .attr("r", 4)
        .attr("fill", "blue")
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .style("opacity", 0)
        .transition()
        .delay((d, i) => i * 50)
        .duration(500)
        .style("opacity", 1);

    svg.selectAll("circle")
        .on("mouseover", (event, d) => {
            if (d.site_name && d.site_name.trim() !== "") {
                tooltip.style("display", "block")
                    .html(d.site_name)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 20) + "px");
            }
        })
        .on("mousemove", (event, d) => {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", () => {
            tooltip.style("display", "none");
        });

     // set toggle state as false
     let radiusVisible = false;

     // button to display lead impact radius 
     document.getElementById("show-radius").onclick = function () {
         const btn = document.getElementById("show-radius");
 
         if (!radiusVisible) {
             svg.append("g")
                 .attr("class", "radius-circles")
                 .selectAll("circle")
                 .data(smelters)
                 .join("circle")
                 .attr("cx", d => projection([+d.longitude, +d.latitude])[0])
                 .attr("cy", d => projection([+d.longitude, +d.latitude])[1])
                 .attr("r", 0)
                 .attr("fill", "lightblue")
                 .attr("opacity", 0.3)
                 .attr("stroke", "blue")
                 .attr("stroke-width", "1px")
                 .style("pointer-events", "none") 
                 .transition()
                 .duration(600)
                 .attr("r", scaleRadius(500));
 
             btn.textContent = "Hide 500m Impact Zones";
             radiusVisible = true;
         } else {
             svg.selectAll(".radius-circles").remove();
             btn.textContent = "Show 500m Impact Zones";
             radiusVisible = false;
         }
     };
 
     // set meters per pixel (approximation)
     function scaleRadius(meters) {
         const metersPerPixel = 25; 
         return meters / metersPerPixel;
     }
 }