export function add_demolition_sites(svg, projection, demolitions, zip_centers){
    const clean_demolitions = [];
    const margins = { top: 30, right: 30, bottom: 55, left: 30 };

    const zip_center_map = new Map();
    zip_centers.forEach((zipcode) => {
        zip_center_map.set(zipcode.STD_ZIP5, [+zipcode.LAT, +zipcode.LON])
    })

    demolitions.forEach(d => {
        const coords = [+d.lng, +d.lat];
        if (projection(coords) !== null && d.start_date) {
            clean_demolitions.push(d);
        }
    });

    const startYear = 2007;
    const endYear = 2025;
    const zipMap = new Map();

    clean_demolitions.forEach(d => {
        const zip = d.zip.split('-')[0];
        if (zip && zip!== "88888"){
            const year = new Date(d.start_date).getFullYear();
            if (!zipMap.has(zip)) {
                const yearCounts = {};
                for (let y = startYear; y <= endYear; y++) {
                    yearCounts[y] = 0;
                }
                zipMap.set(zip, yearCounts);
            }
            zipMap.get(zip)[year]++;
            }
        });

    // scale for date started
    var date_scale = d3.scaleSequential(function(t) {
        return d3.interpolateCool(t/4+0.5) })
    .domain([2007, 2025])

    // scale for size
    var size_scale = d3.scaleSequential()
    .domain(d3.extent(Array.from(zipMap.values()).flatMap(d => Object.values(d))))
    .range([0, 30]);

    const tooltip = d3.select("#tooltip");

    const dots = svg.append("g")
        .attr("class", "demolition-dots")
        .selectAll("circle")
        .data(zipMap)
        .join("circle");

    const yearLabel = svg.append("text")
    .attr("class", "year-label")
            .attr("x", margins.left)
            .attr("y", margins.top)
            .text("")
            .style("font-size", "50px")
            .attr("alignment-baseline", "middle");

    svg.append("text")
            .attr("class", "year-label")
                    .attr("x", margins.left)
                    .attr("y", margins.top+40)
                    .text("")
                    .style("font-size", "20")
                    .attr("alignment-baseline", "middle")
                    .text("Demolitions by year");

    svg.append("rect")
                    .attr("width", 90)
                    .attr("height", 30)
                    .attr("rx", 6)
                    .attr("fill", "white")
                    .attr("x", margins.left)
                    .attr("y", margins.top+50)
                    .attr("stroke", "#004f7c")
                    .attr("stroke-width", 1.5)
                    .attr("opacity", 0.9);

    const replayButton = svg.append("text")
                    .attr("id", "replay-btn")
                    .attr("x", margins.left+5)
                    .attr("y", margins.top+71)
                    .attr("font-size", "20px")
                    .attr("fill", "black")
                    .style("cursor", "pointer")
                    .text("Replay");
    
    function animate(){
        let i =0;
    const interval = d3.interval(() => {
        if (i >= 19) {
            interval.stop();
            return;
        }
    
        dots 
        .attr("cx", function(d){
            const zip = d[0];
            const coords = zip_center_map.get(zip.toString());
            const lat = coords[0];
            const lon = coords[1];
            return projection([lon, lat])[0];
        } )
        .attr("cy",function(d){
            const zip = d[0];
            const coords = zip_center_map.get(zip.toString());
            const lat = coords[0];
            const lon = coords[1];
            return projection([lon, lat])[1];})
        .transition()
        .delay((d, i) => i * 10)
        .duration(1000)
        .attr("r", (d) => size_scale(d[1][2007+i]))
        .attr("fill", function(d){
            return date_scale(2007+i); 
        })
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .style("opacity", 1);

        dots.on("mouseover", (event, d) => {
            tooltip.style("display", "block")
                .html(d[1][2007+i])
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

        yearLabel.text(2007 + i).attr("fill", function(d){
            return date_scale(2007+i); 
        });
    
        i++;
    }, 1200);
    }

    replayButton.on("click", () => {
        animate();
    });

    animate();
    
}