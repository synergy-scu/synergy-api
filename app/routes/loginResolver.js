import express from 'express';

import asyncMiddleware from '../middleware/asyncMiddleware';

import { isValidUser } from '../api/users';

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
                    type: 'Invalid User',
                    message: 'No user was found with this email address',
                    extra: error,
                },
            });
        });
}));

export default router;
