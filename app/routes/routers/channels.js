import express from 'express';

import asyncMiddleware from '../../middleware/asyncMiddleware';
import { getChannel, getChannels, updateChannel, deleteChannel } from '../../api/channels';

const router = express.Router({ mergeParams: true });

router.post('/', asyncMiddleware((req, res, next) => {
    getChannels(req.app.locals.db, req.body)
        .then(result => {
            res.json(result);
        });
}));

router.post('/get', asyncMiddleware((req, res, next) => {
    getChannel(req.app.locals.db, req.body)
        .then(result => {
            res.json(result);
        });
}));

router.post('/update', asyncMiddleware((req, res, next) => {
    updateChannel(req.app.locals.db, req.body)
        .then(() => {
            res.status(201).send();
        });
}));

export default router;
