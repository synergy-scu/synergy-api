import express from 'express';

import asyncMiddleware from '../../middleware/asyncMiddleware';
import { getDevice, getDevices, updateDevice, deleteDevice } from '../../api/devices';
import { validResponse } from '../../utils/response';

const router = express.Router({ mergeParams: true });

router.post('/', asyncMiddleware((req, res, next) => {
    getDevices(req.app.locals.db, req.body)
        .then(result => {
            res.json(validResponse(result));
        }).catch(error => {
            res.json(error);
        });
}));

router.post('/get', asyncMiddleware((req, res, next) => {
    getDevice(req.app.locals.db, req.body)
        .then(result => {
            res.json(validResponse(result));
        }).catch(error => {
            res.json(error);
        });
}));

router.post('/update', asyncMiddleware((req, res, next) => {
    updateDevice(req.app.locals.db, req.body)
        .then(() => {
            res.status(201).send();
        }).catch(error => {
            res.json(error);
        });
}));

router.post('/delete', asyncMiddleware((req, res, next) => {
    const results = deleteDevice(req.app.locals.db, req.body);

    Promise.all(results.queries)
        .then(() => {
            res.status(204).send();
        }).catch(error => {
            res.json(error);
        });
}));

export default router;
