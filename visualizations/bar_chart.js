export function bar_chart(svg, lead_data, draw35line=false) {
    svg.selectAll("*").remove(); // clear the canvas first

    const width = 500;
    const height = 500;
    const margin = { top: 60, right: 40, bottom: 100, left: 60 };

    lead_data.sort((a, b) => +a.value - +b.value);

    // create scales 
    const x = d3.scaleBand()
        .domain(lead_data.map(d => d.geo_label_citystate))
        .range([margin.left, width - margin.right])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(lead_data, d => +d.value)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // create x-axis 
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", "12px")
        .style("font-weight", "bold");


    // create y-axis
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("font-size", "12px")
        .style("font-weight", "bold");

    // draw bars 
    const rects = svg.append("g")
        .selectAll("rect")
        .data(lead_data)
        .join("rect")
        .attr("x", d => x(d.geo_label_citystate))
        .attr("y", d => y(+d.value))
        .attr("height", d => y(0) - y(+d.value))
        .attr("width", x.bandwidth())
        .attr("fill", d => d.geo_label_citystate === "Philadelphia, PA" ? "#67080C" : "#C51017");
    
    const tooltip = d3.select("#tooltip");

    rects.on("mouseover", (event, d) => {
            tooltip.style("display", "block")
                .html("<span class='tooltip-text-bold'>" + d.geo_label_citystate + "</span>" +" " + d.value + " μg/dL")
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

    if (draw35line){
        svg.append("line")
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
        .attr("y1", y(3.5))
        .attr("y2", y(3.5))
        .attr("stroke", "blue")
        .attr("stroke-dasharray", "4")
        .attr("stroke-width", 2);

        svg.append("text")
        .attr("x", margin.left + 5)
        .attr("y", y(3.5) - 8)
        .text("Elevated: 3.5 µg/dL")
        .attr("fill", "black")
        .style("font-size", "14px");
    }

    // median line
    svg.append("line")
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
        .attr("y1", y(0.6))
        .attr("y2", y(0.6))
        .attr("stroke", "blue")
        .attr("stroke-dasharray", "4")
        .attr("stroke-width", 2);

    // label for median line
    svg.append("text")
        .attr("x", margin.left + 5)
        .attr("y", y(0.6) - 8)
        .text("Median 0.6 µg/dL")
        .attr("fill", "black")
        .style("font-size", "14px");

    // label for y axis
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `rotate(-90)`)
        .attr("x", -(height / 2))
        .attr("y", margin.left - 45)
        .text("Blood Lead Level (µg/dL)")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", "black");

    // label for x axis
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height - margin.bottom + 100)
        .text("City")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", "black");
}
