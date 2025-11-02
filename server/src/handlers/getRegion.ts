import { Request, Response } from 'express';
import { getRegionShpFile } from '../utils';

export const getRegion = async (request: Request, response: Response) => {
    console.log(request.params.id);
    if(!request.params.id)
        throw console.error("No region id provided");
        
    return await getRegionShpFile(request.params.id);
}