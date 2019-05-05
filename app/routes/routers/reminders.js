import express from 'express';

import asyncMiddleware from '../../middleware/asyncMiddleware';
import { getReminders, createReminder, getReminder, updateReminder, deleteReminder } from '../../api/reminders';
import { validResponse, errorResponse } from '../../utils/response';

const router = express.Router({ mergeParams: true });

router.post('/', asyncMiddleware((req, res, next) => {
    getReminders(req.app.locals.db, req.body)
        .then(result => {
            res.json(validResponse(result));
        }).catch(error => {
            res.status(500).json(errorResponse(error));
        });
}));

router.post('/create', asyncMiddleware((req, res, next) => {
    console.log(req.body);
    const request = createReminder(req.app.locals.db, req.body);

    request.query.then(() => {
        res.status(201).send(validResponse({
            reminderID: request.uuid,
        }));
    }).catch(error => {
        res.status(500).json(errorResponse(error));
    });
}));

router.post('/get', asyncMiddleware((req, res, next) => {
    getReminder(req.app.locals.db, req.body)
        .then(result => {
            res.json(validResponse(result));
        }).catch(error => {
            res.status(500).json(errorResponse(error));
        });
}));

router.post('/update', asyncMiddleware((req, res, next) => {
    updateReminder(req.app.locals.db, req.body)
        .then(() => {
            res.status(201).send();
        }).catch(error => {
            res.status(500).json(errorResponse(error));
        });
}));

router.post('/delete', asyncMiddleware((req, res, next) => {
    deleteReminder(req.app.locals.db, req.body)
        .then(() => {
            res.status(204).send();
        }).catch(error => {
            res.status(500).json(errorResponse(error));
        });
}));

export default router;
