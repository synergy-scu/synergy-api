import express from 'express';

import asyncMiddleware from '../../middleware/asyncMiddleware';
import { createChart, getChart, getCharts, updateChart, deleteChart } from '../../api/charts';

const router = express.Router({ mergeParams: true });

router.post('/', asyncMiddleware((req, res, next) => {
    getCharts(req.app.locals.db, req.body)
        .then(result => {
            res.json(result);
        });
}));

router.post('/create', asyncMiddleware((req, res, next) => {
    const results = createChart(req.app.locals.db, req.body);

    Promise.all(results.queries)
        .then(() => {
            res.status(201).send();
        });
}));

router.post('/get', asyncMiddleware((req, res, next) => {
    getChart(req.app.locals.db, req.body)
        .then(result => {
            res.json(result);
        });
}));

router.post('/update', asyncMiddleware((req, res, next) => {
    const results = updateChart(req.app.locals.db, req.body);

    Promise.all(results.queries)
        .then(() => {
            res.status(201).send();
        });
}));


router.post('/delete', asyncMiddleware((req, res, next) => {
    const results = deleteChart(req.app.locals.db, req.body);

    Promise.all(results.queries)
        .then(() => {
            res.status(204).send();
        });
}));

export default router;
