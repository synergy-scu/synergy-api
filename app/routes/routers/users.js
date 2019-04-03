import express from 'express';

import asyncMiddleware from '../../middleware/asyncMiddleware';
import { createUser, getUser, updateUser, deleteUser } from '../../api/users';

const router = express.Router({ mergeParams: true });

router.post('/', asyncMiddleware((req, res, next) => {
    res.send('User Router');
}));

router.post('/create', asyncMiddleware((req, res, next) => {
    createUser(req.app.locals.db, req.body)
        .then(() => {
            res.status(201).send();
        });
}));

router.post('/get', asyncMiddleware((req, res, next) => {
    getUser(req.app.locals.db, req.body)
        .then(([result]) => {
            res.json(result);
        });
}));

router.post('/update', asyncMiddleware((req, res, next) => {
    updateUser(req.app.locals.db, req.body)
        .then(() => {
            res.status(201).send();
        });
}));

router.post('/delete', asyncMiddleware((req, res, next) => {
    deleteUser(req.app.locals.db, req.body)
        .then(() => {
            res.status(204).send();
        });
}));

export default router;
