# Childhood Blood Lead Exposure in Philadelphia

This interactive web based data visualization explores the devastating and lasting effects of childhood blood lead exposure in Philadelphia. 

Through a series of scrollytelling transitions powered by D3.js, it connects blood lead levels to housing, historical practices, education, and playground infrastructure, all within the city’s geography.

## Demo

> Hosted at: https://ldups.github.io/info-vis-lead-levels/

---

## Features

- **Scrollytelling design** that synchronizes text and visuals as the user scrolls.
- **Horizontal Dot Plot** highlighting the connection between academic acheivement in younger children and blood lead levels.
- **Bar chart** showing comparative lead exposure in major U.S. cities.
- **Zip-code-level choropleths** showing:
    - Lead exposure in children across Philadelphia 
    - Housing age in Philadelphia, including an **animation of demolations from 2007 to 2025** 
- **Map overlays** highlighting:
  - **Historical lead smelter sites**
  - **500-meter impact zones** around each smelter
  - **Elementary schools** and **playgrounds** located within contaminated zones
- **Tooltip interactivity** showing site names on hover.
- **Proportional Symbol Map** with color encoding to show sites with safe/unsafe levels of soil, and **radius animation showing on quantitative soil lead content**

## How to Run Locally

1. Clone the repository.
2. Open the project in a code editor, such as VSCode.
3. Start a local server
    - From the project root directory (where index.html is located), run: python3 -m http.server 9000
4. Open browser and go to: 
    - http://localhost:9000

## Tools Used

- **D3.js v6** – Data visualization library to create dynamic SVG maps and charts  
- **Waypoints.js** – Library to trigger functions on scroll, enabling scrollytelling effects  
- **TopoJSON + GeoJSON** – For rendering and mapping spatial boundary data
- **CSV files** – For tabular data on smelters, housing, schools, playgrounds, soil samples, and more  

## Data Sources
- [City Lead Comparison - Big Cities Health Coalition](https://bigcitieshealthdata.org/compare/?city=6&cities=1%2C2%2C3%2C4%2C5%2C7%2C8%2C9%2C10%2C12%2C13%2C14%2C15%2C16%2C17%2C19%2C20%2C21%2C22%2C23%2C24%2C25%2C26%2C27%2C28%2C29%2C30%2C31%2C32%2C33%2C34%2C35%2C36%2C37&metrics=09-01-01&years=2022&groups=&sort=high&geoStrata=)
- [Playgrounds - Open Data Philly](https://opendataphilly.org/datasets/ppr-playgrounds/)
- [Elementary Schools - School District of Philadelphia](https://cdn.philasd.org/offices/performance/Open_Data/School_Information/School_List/2023-2024%20Master%20School%20List%20(20231003).csv)
- [Historical Smelting Sites - DeX Data Explorer](https://dex.edirepository.org/dex/profile/27788)
