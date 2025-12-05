# Civic Mapper

[![License: CC BY-NC-ND 4.0](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-nd/4.0/)

## Description

Full stack application displaying elected officials across the US. Currently shows an overview of Federal Legislative Branch, each states federal representatives and each state's legislative branch.

**_DISCLAIMER_**
This app is not to be viewed as a source of truth, but a broad overview of the current representative makeup across America. This app uses the Open State's API which does not contain 100% of state officials. Many recent elections/special elections are slow to update, and thus there may apear to be vacancies where there are not at the state level, or a state's chamber may be missing a seat or two in it's proper count. This app is still a work in progress and hopes to fill these gaps, but currently they are plentyful.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Screenshots](#screenshots)
- [Updates](#Updates)
- [Usage](#usage)
- [Credits](#credits)
- [Future-Development](#future-development)
- [License](#license)

## Requirements

Currently not deployed. In order to run locally you will need Node 22, Python, a Congress API Key (free) and an Open States API Key (free).

- [Register for Open States API Key](https://open.pluralpolicy.com/accounts/profile/)
- [Register for Congress API Key](http://api.congress.gov/sign-up/)

## Installation

To setup locally:

Setup Frontend

```bash
cd client
npm i
```

Setup Backend

```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Add API Keys to env file

```bash
cd server
touch .env
```

Run the app from Root

```bash
npm run dev
```

## Screenshots

![Federal Overview](screenshots/National.png)

![Federal Leaflet Overview](screenshots/NationalLeaflet.png)

![Page Settings](screenshots/PageSettings.png)

![Illinois Federal Representation](screenshots/Illinois_Fed_reps.png)

![Indiana State Senate](screenshots/Indiana_state_senate.png)

![Michigan State House](screenshots/Michigan_state_house.png)

![Ohio Congressional District 9](screenshots/Ohio_CD_9.png)

![1234 North Ave Representatives](screenshots/AddressLookup.png)

![Crater Lake Representatives](screenshots/AddressLookup2.png)

## Updates

- Dark Mode and a choice of having a map backdrop have been added to allow users to customize their UI.

- Address lookup has been added allowing users to find all state and federal representatives at any given address.

- Better Map Caching has been implemented. Currently all state maps and congressional maps are cached for 30 days. Initial fetch and cache renewal can take several seconds to complete. Cache is saved to binary files on the backend, as there is so much data for every state. Should be enhanced in the future, to allow backend to automatically renew cache to avoid users having to wait.

- Better error handling has been implemented to avoid app craches. Currently if a vacant district is selected, the app will no longer crash, though better information is yet to be added on that district, such as "District is vacant" - (currently just no representative is shown).

- Tests have been implemented and backend is entirely covered, frontend is still a work in progress. Git actions have also been added to only allow PR that pass all tests.

## Usage

Initially the app will load federal legislative makeup, with the ability to click on any state to see that state's federal representatives (both house represenatives and senators).

At any point you can change the map data you want to see in the top header. You can currently view a given states lower chambers disticts (house of representatives) as well as any states upper chamber districts (senate), and of course federal congressional districts.

You can also view city boundaries, counties and sub-counties, though there is currently no representative data or polling attatched to these maps.

Within any of the congressional district maps, state senate maps, or the state house maps, you can click on any given district to view the representative. Currently not all representatives are tracked by the open states api that is being utilized due to recent special elections, vacancies or other reasons.

You can also now change the sidebar to search officials by address, which will return a list of senators, congressional house, state senate and state house representatives for that address, the map will also display the overlaping districts for those officials.

At any point you can also change the page settings in the top right of the screen. You can change the website to dark mode, and you can also change the map to use leaflet which will display the district maps over a real map of the world, can be very useful to get a sense of where these districts fall in a given state if you are less familiar with city and town locations.

## Credits

- [Open States API](https://docs.openstates.org/api-v3/) -> A great open source API to get state officials for each state accross America. (Some officials are missing or slow to update)

- [Congress API](https://www.congress.gov/help/using-data-offsite) -> Government owned API to get congressional representative data; both house and senate. Not the most descriptive data when it comes to each representative but provides the basics.

- [Census Maps API](https://www2.census.gov/) -> One of many census apis that provides map data. Only provides ShapeFile data which is not the most friendly to work with in most modern frontend languages.

- [Geopandas File Reader](https://geopandas.org/en/stable/docs/reference/api/geopandas.read_file.html) -> A great python library that provides the means to translate census shapefiles into a more readible, modern GeoJSON format, which works well with all modern frontend mapping tools.

- [D3 Map Projections](https://d3js.org/d3-geo/conic#geoAlbersUsa) -> D3 has multiple node packages which are utilized on the react frontend to display the census map data. Particularly the geoAlbersUsa projection is great to view the US as a better shape, having Alaska and Hawaii just under the rest of the states.

- [Leaflet](https://leafletjs.com/) -> Leaflet is an amazing open source javascript library for interactive maps, allowing for custom geojson to be placed on top of a real map tiles. While it's not compatible with d3 geoAlbers projection, due to leaflet being fixed to the mercator projection to display the world as it is, leaflet's real map allows users to select their prefered UI in the page settings of this webpage.

## Future-Development

This app is still in early development so there is much to be done:

- Add all territories to the map for better clarity and understanding of entire makeup of the USA. Currently Puerto Rico is implemented in the leaflet map, but not the d3 svg map. And some territories like Guam are not in either, due to Guam having a seperate Shapefile directory in the census database.

- Polish Execute Branch data. Currently only some executive branch data is implemented for each state, not federal. However there are plenty missing governors, and even more missing officials such as secretaries of state, lieutenant governors and attorney generals.

- Implement Judicial Branch overview. Not as important as executive branch officials, but would be nice to give users insight into local, state and federal judges.

- Attatch data to alternative maps already available. Counties, subcounties and city divisions are difficult and it may not be possible to implement all local governments and officials, but at the very least polling data should be added to county divisions as that data is more accessible.

- Add more data to the app beyond just representative data. There is space below the map that might showcase recent or important bills passed by a given government or representative. There are plenty of APIs to assist in this, but it would take extensive logic to implement and time to make the UI clean and proffesional.

- Better user navigation across different map districts. There currently is not a way to go back to the federal representative overview, other than reloading the page.

- Deploy the app through AWS or Azure.

## License

This project is licensed under the **Creative Commons Attribution–NonCommercial–NoDerivatives 4.0 International (CC BY-NC-ND 4.0)** license.

This means you are free to:

- **Share** — copy and redistribute the material in any medium or format

Under the following terms:

- **Attribution** — You must give appropriate credit.
- **NonCommercial** — You may not use the material for commercial purposes.
- **NoDerivatives** — You may not modify or build upon the material.

For full license details, see the official legal code:  
https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
