export function color_legend(svg, scale, x_scale, margin, width, height, legend_title){
    const barHeight = 15;

    const legend_svg = svg.append("g")
        .attr("transform", `translate(0,${margin.bottom})`)
        .attr("id", "legend-svg");

    const defs = legend_svg.append("defs");

    const linearGradient = defs.append("linearGradient")
      .attr("id", "linear-gradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "100%").attr("y2", "0%");

    const stops = scale.ticks(10).map((t, i, n) => ({
      offset: `${100 * i / (n.length - 1)}%`,
      color: scale(t)
    }));

    linearGradient.selectAll("stop")
      .data(stops)
      .enter().append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    legend_svg.append("rect")
      .attr("x", margin.left)
      .attr("y", height - 2*margin.bottom - barHeight)
      .attr("width", width - margin.left - margin.right)
      .attr("height", barHeight)
      .style("fill", "url(#linear-gradient)");

    const x_axis = d3.axisBottom(x_scale)
      .ticks(10);

    svg.append("g")
      .attr("transform", `translate(0,${height-margin.bottom})`)
      .call(x_axis);

    svg.append("g")
        .attr("transform", `translate(0,${margin.bottom -5})`)
        .append("text")
        .attr("x", margin.left)
        .attr("y", height - margin.bottom)
        .text(legend_title);
}