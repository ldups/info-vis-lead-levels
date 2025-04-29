import { lead_map } from "./lead_map.js";
import { housing_map } from "./housing_age_map.js";

//grab our canvas 
let svg = d3.select("#canvas");

//set the width and height
svg.attr('width',600)
    .attr('height',600)

Promise.all([
    d3.json("./data//child_blood_lead_levels_by_zip.geojson"),
    d3.csv("./data//child_blood_lead_levels_by_zip.csv"),
    d3.csv("./data//philly_housing.csv"),
  ]).then((data) => { 
    const topology = data[0];
    const lead_levels_zipcode = data[1];
    const housing = data[2];

    const lead_dictionary = new Map();
    lead_levels_zipcode.forEach((zipcode) => {
        lead_dictionary.set(zipcode.zip_code, +zipcode.perc_5plus) 
    })

    const housing_dictionary = new Map();
    housing.forEach((zipcode) =>{
        let parsed_zipcode = zipcode.NAME.replace('ZCTA5 ','');
        let built_2020 = +zipcode.S2504_C03_009E;
        let built_2010_2019 = +zipcode.S2504_C03_010E;
        let built_2000_2009 = +zipcode.S2504_C03_011E;
        let built_1980_1999 = +zipcode.S2504_C03_012E;
        let built_1960_1979 = +zipcode.S2504_C03_013E;
        let built_1940_1959 = +zipcode.S2504_C03_014E;
        let built_1939 = +zipcode.S2504_C03_015E;
        let total_homes = built_2020+ built_2010_2019 + built_2000_2009+ built_1980_1999+built_1960_1979+built_1940_1959+built_1939;
        let before_1980 = built_1960_1979 + built_1940_1959 + built_1939;
        let perc_before_1980 = (before_1980 / total_homes) * 100;
        housing_dictionary.set(parsed_zipcode, perc_before_1980);
    })

    // === Scrollytelling boilerplate === //
    function scroll(n, offset, func1, func2){
        const el = document.getElementById(n)
        return new Waypoint({
            element: document.getElementById(n),
            handler: function(direction) {
                direction == 'down' ? func1() : func2();
            },
            //start 75% from the top of the div
            offset: offset
        });
        };


    //trigger these functions on page scroll
    //new scroll('div2', '75%', grid2, grid2);  //create a grid for div2
    new scroll('div3', '75%', display_lead_map, clear); //create a grid for div3
    new scroll('div4', '75%', display_housing_map, display_lead_map);  //create a grid for div4
    new scroll('div5', '75%', display_lead_map, grid4); //create a grid for div4

    function display_lead_map(){
        clear();
        lead_map(svg, lead_dictionary, topology);
    }

    function display_housing_map(){
        clear();
        housing_map(svg, housing_dictionary, topology);
    }

    function clear(){
        svg.selectAll('*').remove();
    }

    function grid3(){
    }

    function grid4(){
    }

})