import { Request, Response, NextFunction } from "express";

export const getTaxis = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    try {
        // get current time in UTC and convert to SGT
        const SGT = new Date(Date.now() + 8 * 3600 * 1000);
        // change into ISO time format
        const formattedTime = SGT.toISOString().slice(0,19);

        // Build the API's URL
        const apiURL = `https://api.data.gov.sg/v1/transport/taxi-availability?date_time=${encodeURIComponent(formattedTime)}`;
        
        // Fetch data from the API (will be in string format)
        const response = await fetch(apiURL);
        
        // Convert data into JSON format
        const data = await response.json();
        
        // Only take the taxi coordinates [lng, lat]
        const taxis = data.features[0].geometry.coordinates;
        
        // Convert taxi coordinates into a more leaflet-friendly format [lat, lng]
        const coords = taxis.map(
            ([lng, lat]: [number, number]) => ({lat, lng})
        );
        
        // return coordinates to frontend in JSON format
        res.json(coords);

    } catch (error) {
        // throws any caught error to the errorHandler
        next(error);
    }
}