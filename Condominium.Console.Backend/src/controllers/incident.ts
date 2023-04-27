import { Request, Response } from "express";
import { IncidentService } from '../services';

export const createIncident = async (_req: Request, _res: Response) => {
    try {

        const { incidentName, description, incidentEvidence } = _req.body;

        const incidentService: IncidentService = _req.app.locals.incidentService;

        const id = await incidentService.insertRecord({
            incidentName,
            description,
            incidentEvidence
        });

        return _res.status(200).json({
            id,
            statusCode: 200
        });

    } catch (error) {
        return _res.status(400).json({
            statusCode: 400
        });
    }
};

export const getIncident = async (_req: Request, _res: Response) => {
    try {
        const { incidentId } = _req.params;

        const incidentService: IncidentService = _req.app.locals.incidentService;
        const incident = await incidentService.getRecord(parseInt(incidentId));
    
        if (!incident) {
            return _res.status(404).json({
                statusCode: 404
            });
        }
    
        return _res.status(200).json({
            incident,
            statusCode: 200
        });
    } catch (error) {
        return _res.status(400).json({
            statusCode: 400
        });
    }
};

export const updateIncident = async (_req: Request, _res: Response) => {

    const { id, incidentName, description, incidentEvidence } = _req.body;

    try {
        const incidentService: IncidentService = _req.app.locals.incidentService;

        const incidentDB = await incidentService.getRecord(id);

        if (!incidentDB) {
            return _res.status(404).json({
                statusCode: 404
            });
        };

        incidentDB.description = description;
        incidentDB.incidentName = incidentName;

        if (incidentEvidence) {
            incidentDB.incidentEvidence = incidentEvidence;
        }

        const updated = await incidentService.updateRecord(id, incidentDB);

        if (!updated) {
            return _res.status(400).json({
                statusCode: 400
            });
        };

        return _res.status(200).json({
            statusCode: 200
        });

    } catch (error) {
        return _res.status(400).json({
            statusCode: 400
        });
    };
};

export const deleteIncident = async (_req: Request, _res: Response) => {
    try {
        const { incidentId } = _req.params;

        const incidentService: IncidentService = _req.app.locals.incidentService;
        const incident = await incidentService.deleteRecord(parseInt(incidentId));
    
        if (!incident) {
            return _res.status(404).json({
                statusCode: 404
            });
        }
    
        return _res.status(200).json({
            incident,
            statusCode: 200
        });
    } catch (error) {
        return _res.status(400).json({
            statusCode: 400
        });
    }
};

export const getIncidents = async (_req: Request, _res: Response) => {

    try {
        const { pageSize = 10, page = 1 } = _req.body;
        const incidentService: IncidentService = _req.app.locals.incidentService;

        const { data, totalItems, currentPage, totalPages } = await incidentService.getRecords(page, pageSize);

        return _res.status(200).json({
            data,
            count: totalItems,
            page: currentPage,
            pages: totalPages,
            statusCode: 200
        });

    } catch (error) {
        return _res.status(400).json({
            data: [],
            count: 0,
            statusCode: 400
        });
    }

};