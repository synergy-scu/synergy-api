import express from 'express';

import asyncMiddleware from '../../middleware/asyncMiddleware';

import { isValidUser } from '../../api/users';
import ErrorTypes from '../../utils/ErrorTypes';
import { validResponse, errorResponse } from '../../utils/response';

const router = express.Router({ mergeParams: true });

router.post('/', asyncMiddleware((req, res, next) => {
    isValidUser(req.app.locals.db, req.body)
        .then(([result]) => {
            const user = {
                ...result,
                password: result.password.toString('utf8'),
            };
            res.json(validResponse(user));
        }).catch(error => {
            const { type, message } = ErrorTypes.INVALID_USER;
            res.json(errorResponse({
                type,
                message,
                error,
            }));
        });
}));

export default router;
