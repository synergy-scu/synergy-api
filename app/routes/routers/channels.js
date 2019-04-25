import express from 'express';

import asyncMiddleware from '../../middleware/asyncMiddleware';
import { getChannel, getChannels, updateChannel } from '../../api/channels';
import { validResponse } from '../../utils/response';


const router = express.Router({ mergeParams: true });
router.post('/', asyncMiddleware((req, res, next) => {
    getChannels(req.app.locals.db, req.body)
        .then(result => {
            res.json(validResponse(result));
        }).catch(error => {
            res.json(error);
        });
}));

router.post('/get', asyncMiddleware((req, res, next) => {
    getChannel(req.app.locals.db, req.body)
        .then(result => {
            res.json(validResponse(result));
        }).catch(error => {
            res.json(error);
        });
}));

router.post('/update', asyncMiddleware((req, res, next) => {
    updateChannel(req.app.locals.db, req.body)
        .then(() => {
            res.status(201).send();
        }).catch(error => {
            res.json(error);
        });
}));

export default router;
