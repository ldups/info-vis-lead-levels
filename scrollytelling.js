import { lead_map } from "./lead_map.js";
import { housing_map } from "./housing_age_map.js";
import { smelter_map } from "./smelter_map.js";
import { school_performance_chart } from "./school_performance_chart.js";
import { bar_chart } from "./bar_chart.js";

//grab our canvas 
let svg = d3.select("#canvas");

//set the width and height
svg.attr('width', 500)
    .attr('height', 600)

Promise.all([
    d3.json("./data//child_blood_lead_levels_by_zip.geojson"),
    d3.csv("./data//child_blood_lead_levels_by_zip.csv"),
    d3.csv("./data//philly_housing.csv"),
    d3.csv("./data/smelters.csv"),
    d3.csv("./data//academic_performance.csv"),
    d3.csv("./data/lead_levels_by_city_2022.csv")
]).then((data) => {
    const topology = data[0];
    const lead_levels_zipcode = data[1];
    const housing = data[2];
    const smelters = data[3];
    const academic = data[4];
    const city_lead_levels = data[5];

    const lead_dictionary = new Map();
    lead_levels_zipcode.forEach((zipcode) => {
        lead_dictionary.set(zipcode.zip_code, +zipcode.perc_5plus)
    })

    const housing_dictionary = new Map();
    housing.forEach((zipcode) => {
        let parsed_zipcode = zipcode.NAME.replace('ZCTA5 ', '');
        let built_2020 = +zipcode.S2504_C03_009E;
        let built_2010_2019 = +zipcode.S2504_C03_010E;
        let built_2000_2009 = +zipcode.S2504_C03_011E;
        let built_1980_1999 = +zipcode.S2504_C03_012E;
        let built_1960_1979 = +zipcode.S2504_C03_013E;
        let built_1940_1959 = +zipcode.S2504_C03_014E;
        let built_1939 = +zipcode.S2504_C03_015E;
        let total_homes = built_2020 + built_2010_2019 + built_2000_2009 + built_1980_1999 + built_1960_1979 + built_1940_1959 + built_1939;
        let before_1980 = built_1960_1979 + built_1940_1959 + built_1939;
        let perc_before_1980 = (before_1980 / total_homes) * 100;
        housing_dictionary.set(parsed_zipcode, perc_before_1980);
    })

    // === Scrollytelling boilerplate === //
    function scroll(n, offset, func1, func2) {
        const el = document.getElementById(n)
        return new Waypoint({
            element: document.getElementById(n),
            handler: function (direction) {
                direction == 'down' ? func1() : func2();
            },
            //start 75% from the top of the div
            offset: offset
        });
    };


    //trigger these functions on page scroll
    new scroll('school-performance', '75%', display_school_performance_chart, clear);  //create a grid for div2
    new scroll('city-bar-chart', '75%', display_city_bar_chart, clear);
    new scroll('lead-zipcode-map', '75%', display_lead_map, clear); //create a grid for div3
    new scroll('housing-zipcode-map', '75%', display_housing_map, clear);  //create a grid for div4
    new scroll('smelting-map', '75%', display_smelter_map, clear); //create a grid for div4

    function display_lead_map() {
        clear();
        lead_map(svg, lead_dictionary, topology);
        document.getElementById("radius-button-container").style.display = "none";
    }

    function display_housing_map() {
        clear();
        housing_map(svg, housing_dictionary, topology);
        document.getElementById("radius-button-container").style.display = "none";
    }

    function display_city_bar_chart() {
        clear();
        const city_lead_clean = city_lead_levels.filter(d => d.value !== "" && !isNaN(+d.value));
        const top5 = city_lead_clean.sort((a, b) => +b.value - +a.value).slice(0, 5);
        const bottom5 = city_lead_clean.sort((a, b) => +a.value - +b.value).slice(0, 5);
        const combined = bottom5.concat(top5);

        bar_chart(svg, combined);
        document.getElementById("radius-button-container").style.display = "none";
    }

    function display_smelter_map() {
        clear();
        smelter_map(svg, topology, smelters);
        document.getElementById("radius-button-container").style.display = "block";
    }

    function clear() {
        svg.selectAll('*').remove();
    }

    function display_school_performance_chart() {
        clear();
        school_performance_chart(svg, academic);
    }


})