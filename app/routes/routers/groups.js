import express from 'express';

import asyncMiddleware from '../../middleware/asyncMiddleware';
import { createGroup, getGroup, getGroups, updateGroup, deleteGroup } from '../../api/groups';

const router = express.Router({ mergeParams: true });

router.post('/', asyncMiddleware((req, res, next) => {
    getGroups(req.app.locals.db, req.body)
        .then(result => {
            res.json(result);
        }).catch(error => {
            res.json(error);
        });
}));

router.post('/create', asyncMiddleware((req, res, next) => {
    const results = createGroup(req.app.locals.db, req.body);

    Promise.all(results.queries)
        .then(() => {
            res.status(201).send();
        }).catch(error => {
            res.json(error);
        });
}));

router.post('/get', asyncMiddleware((req, res, next) => {
    getGroup(req.app.locals.db, req.body)
        .then(result => {
            res.json(result);
        }).catch(error => {
            res.json(error);
        });
}));

router.post('/update', asyncMiddleware((req, res, next) => {
    const results = updateGroup(req.app.locals.db, req.body);

    Promise.all(results.queries)
        .then(() => {
            res.status(201).send();
        }).catch(error => {
            res.json(error);
        });
}));

router.post('/delete', asyncMiddleware((req, res, next) => {
    const results = deleteGroup(req.app.locals.db, req.body);

    Promise.all(results.queries)
        .then(() => {
            res.status(204).send();
        }).catch(error => {
            res.json(error);
        });
}));

export default router;
