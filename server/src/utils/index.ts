const regionshp = 'https://www2.census.gov/geo/tiger/GENZ2024/shp/';

// const stateshp = 'https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_${state?.id}_sldl_500k.zip';


export const getRegionShpFile = async (id: string) => {
    console.log("fetching shape file...");
    const censusShpFile: any = await loadShapefile(`https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_${id}_sldl_500k.zip`);
    const districts: any = censusShpFile.features;
    return districts;
}

export const getStateShpFile = async (id: string) => {
    
}

async function loadShapefile(zipUrl: string) {
    // console.log("parsing shape file...");
    console.log("fetching shape file...");

    const response = await fetch(zipUrl);
    if (!response.ok) 
        throw new Error(`Failed to download shapefile: ${response.status}`);

    const arrayBuffer = await response.arrayBuffer();

    // console.log("parsing shape file...");
    // const geojson = await shp.parseZip(arrayBuffer);

    // return geojson;
}