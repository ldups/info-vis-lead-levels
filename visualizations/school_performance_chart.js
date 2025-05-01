export function school_performance_chart(svg, data){
    const width = 500;
    const height = 600;

    const chart = svg.append("g")
    .attr("transform", `translate(30, 50)`)
    .attr("width", width-30)
    .attr("height", height-100);

    const performance_values = ['advanced', 'proficient', 'partially proficient', 'not proficient'];
    const performance_colors = {
        'advanced': '#2ca02c',
        'proficient': '#b2df8a',
        'partially proficient': '#fdb863',
        'not proficient': '#d7191c'
    };
    const subjects = ["mathematics", "science", "reading"];

    var y = d3.scaleBand()
            .domain(performance_values)
            .range([0, height-70])
            .padding(0.1);

    var x = d3.scaleLinear()
        .domain([d3.min(data, (d) => { return +d.mean_lead_level})-1, d3.max(data, (d) => { return +d.mean_lead_level})])
        .range([ 30, width-90]);

    var ordinal = d3.scaleOrdinal().domain(subjects)
        .range(d3.schemePaired);

    svg.append('text')
        .attr('y', height - 5) 
        .attr('x', width/2 - 120)
        .text('Mean blood lead level (μg/dL)');

    svg.append('text')
        .text('Academic achievement')
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("x", -height / 2)
        .attr("y", 15)

    chart.append("g")
         .attr("transform", "translate(0," + (height-90) + ")")
         .call( d3.axisBottom(x).ticks(10).tickSize(-height+120))
         .call((g) => g.select(".domain").remove()); 
           
    const yaxis = chart.append("g")
    .attr("transform", "translate(20,0)")
         .call(d3.axisLeft(y).ticks(10).tickSize(-width+100))
         .call((g) => g.selectAll("text")
            .attr("transform", "rotate(-65)")
            .style("text-anchor", "end"))
         .call((g) => g.select(".domain").remove());

    yaxis.selectAll("text")
        .style("fill", d => performance_colors[d])
        .attr("font-weight", "bold");

    const tooltip = d3.select("#tooltip");

    var circles = chart.selectAll("circle")
         .data(data)
         .enter()
         .append("circle")
             .attr("cx", function (d) { return x(+d.mean_lead_level); })
             .attr("r", 15)
             .attr("opacity", 0.75)
             .attr("cy",  d => y(d.level) + y.bandwidth() / 2 )
             .attr("fill", function(d) { return ordinal(d.subject) });

     circles
             .on("mouseover", (event, d) => {
                 tooltip.style("display", "block")
                     .html("Blood lead level - " + d.mean_lead_level + "μg/dL")
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
        .attr("transform", "translate(" + (width-130) +", 80)");
         
    subjects.forEach((subject, i) => {
           legend.append("circle")
               .attr("cx", 0)
               .attr("cy", i * 25)
               .attr("r", 7)
               .style("fill", ordinal(subject));
         
           legend.append("text")
               .attr("x", 15)
               .attr("y", i * 25 + 5)
               .text(subject)
               .attr("alignment-baseline", "middle");
         });
}