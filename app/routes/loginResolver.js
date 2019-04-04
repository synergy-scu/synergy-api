import express from 'express';

import asyncMiddleware from '../middleware/asyncMiddleware';

import { isValidUser } from '../api/users';
import ErrorTypes from '../utils/ErrorTypes';

const router = express.Router();

router.post('/', asyncMiddleware((req, res, next) => {
    isValidUser(req.app.locals.db, req.body)
        .then(([result]) => {
            const user = {
                ...result,
                password: result.password.toString('utf8'),
            };
            res.json(user);
        }).catch(error => {
            res.json({
                error: {
                    ...ErrorTypes.INVALID_USER,
                    error,
                },
            });
        });
}));

export default router;
