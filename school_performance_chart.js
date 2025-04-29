export function school_performance_chart(svg, data){
    const width = 500;
    const height = 600;

    const chart = svg.append("g")
    .attr("transform", `translate(30, 50)`)
    .attr("width", width-30)
    .attr("height", height-100);

    const performance_values = ['advanced', 'proficient', 'partially proficient', 'not proficient'];
    const subjects = ["mathematics", "science", "reading"];

    var x = d3.scaleBand()
            .domain(performance_values)
            .range([0, width-30])
            .padding(0.1);

    var y = d3.scaleLinear()
        .domain([d3.min(data, (d) => { return +d.mean_lead_level})-2, d3.max(data, (d) => { return +d.mean_lead_level})])
        .range([ height-90, 30 ]);

    var ordinal = d3.scaleOrdinal().domain(subjects)
        .range(d3.schemePaired);

    svg.append('text')
        .attr('y', height - 5) 
        .attr('x', width/2 - 60)
        .text('Academic achievement');

    svg.append('text')
        .text('Mean blood lead level (μg/dL)')
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("x", -height / 2)
        .attr("y", 15)

    chart.append("g")
         .attr("transform", "translate(0," + (height-90) + ")")
         .call( d3.axisBottom(x).ticks(10).tickSize(-height-10))
         .call((g) => g.select(".domain").remove()); 
           
    chart.append("g")
    .attr("transform", "translate(20,0)")
         .call(d3.axisLeft(y).ticks(10).tickSize(-width-10))
         .call((g) => g.select(".domain").remove());

    chart.selectAll("circle")
         .data(data)
         .enter()
         .append("circle")
             .attr("cx", d => x(d.level) + x.bandwidth() / 2 )
             .attr("r", 15)
             .attr("opacity", 0.75)
             .attr("cy", function (d) { return y(+d.mean_lead_level); } )
             .attr("fill", function(d) { return ordinal(d.subject) });


    const legend = svg.append("g")
        .attr("transform", "translate(10, 30)");
         
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