import express from 'express';

import asyncMiddleware from '../../middleware/asyncMiddleware';
import { getUsageLegacy } from '../../api/usages';

const router = express.Router({ mergeParams: true });

router.post('/', asyncMiddleware((req, res, next) => {
    getUsageLegacy(req.app.locals.db, req.body)
        .then(result => {
            res.json(result);
        }).catch(error => {
            res.json(error);
        });
}));

export default router;
