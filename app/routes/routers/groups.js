import express from 'express';

import asyncMiddleware from '../../middleware/asyncMiddleware';
import { createGroup, getGroup, getGroups, updateGroup, deleteGroup } from '../../api/groups';
import { validResponse, errorResponse } from '../../utils/response';

const router = express.Router({ mergeParams: true });

router.post('/', asyncMiddleware((req, res, next) => {
    const results = getGroups(req.app.locals.db, req.body);

    Promise.all(results)
        .then(([groups, members]) => {
            res.json(validResponse({
                groups,
                members,
            }));
        }).catch(error => {
            res.json(errorResponse(error));
        });
}));

router.post('/create', asyncMiddleware((req, res, next) => {
    const results = createGroup(req.app.locals.db, req.body);

    Promise.all(results.queries)
        .then(() => {
            res.status(201).send();
        }).catch(error => {
            res.json(errorResponse(error));
        });
}));

router.post('/get', asyncMiddleware((req, res, next) => {
    const results = getGroup(req.app.locals.db, req.body);

    Promise.all(results)
        .then(([groups, members]) => {
            res.json(validResponse({
                groups,
                members,
            }));
        }).catch(error => {
            res.json(errorResponse(error));
        });
}));

router.post('/update', asyncMiddleware((req, res, next) => {
    const results = updateGroup(req.app.locals.db, req.body);

    Promise.all(results.queries)
        .then(() => {
            res.status(201).send();
        }).catch(error => {
            res.json(errorResponse(error));
        });
}));

router.post('/delete', asyncMiddleware((req, res, next) => {
    const results = deleteGroup(req.app.locals.db, req.body);

    Promise.all(results.queries)
        .then(() => {
            res.status(204).send();
        }).catch(error => {
            res.json(errorResponse(error));
        });
}));

export default router;
