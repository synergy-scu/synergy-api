import express from 'express';

import asyncMiddleware from '../../middleware/asyncMiddleware';
import { createChart, getChart, getCharts, updateChart, deleteChart } from '../../api/charts';
import { validResponse, errorResponse } from '../../utils/response';

const router = express.Router({ mergeParams: true });

router.post('/', asyncMiddleware((req, res, next) => {
    const results = getCharts(req.app.locals.db, req.body);

    Promise.all(results)
        .then(([charts, members]) => {
            res.json(validResponse({
                charts,
                members,
            }));
        }).catch(error => {
            res.status(500).json(errorResponse(error));
        });
}));

router.post('/create', asyncMiddleware((req, res, next) => {
    const results = createChart(req.app.locals.db, req.body);

    Promise.all(results.queries)
        .then(() => {
            res.status(201).send(validResponse({
                id: results.id,
            }));
        }).catch(error => {
            res.status(500).json(errorResponse(error));
        });
}));

router.post('/get', asyncMiddleware((req, res, next) => {
    const results = getChart(req.app.locals.db, req.body);

    Promise.all(results)
        .then(([charts, members]) => {
            res.json(validResponse({
                charts,
                members,
            }));
        }).catch(error => {
            res.status(500).json(errorResponse(error));
        });
}));

router.post('/update', asyncMiddleware((req, res, next) => {
    const results = updateChart(req.app.locals.db, req.body);

    Promise.all(results.queries)
        .then(() => {
            res.status(201).send();
        }).catch(error => {
            res.status(500).json(errorResponse(error));
        });
}));


router.post('/delete', asyncMiddleware((req, res, next) => {
    const results = deleteChart(req.app.locals.db, req.body);

    Promise.all(results.queries)
        .then(() => {
            res.status(204).send();
        }).catch(error => {
            res.status(500).json(errorResponse(error));
        });
}));

export default router;
