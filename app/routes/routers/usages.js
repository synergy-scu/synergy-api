import express from 'express';
import uuidv4 from 'uuid/v4';
import { get } from 'lodash';

import asyncMiddleware from '../../middleware/asyncMiddleware';
import { getLatestUsage, getUsage } from '../../api/usages';
import { validResponse, errorResponse } from '../../utils/response';

const router = express.Router({ mergeParams: true });

router.post('/history', asyncMiddleware((req, res, next) => {
    const chartID = get(req.body, 'chartID', null);

    if (!chartID) {
        res.json(errorResponse({
            message: 'Invalid request. Must include a chart ID',
        }));
    }

    const variables = get(req.body, 'variables', {});
    const channels = get(req.body, 'channels', []);

    const promises = getUsage(req.app.locals.db, { channels, variables });

    Promise.all(promises).then(results => {
        const usages = results.flat();
        res.json(validResponse({
            chartID,
            results: usages,
        }));
    }).catch(error => {
        res.status(500).json(errorResponse({
            chartID,
            error,
        }));
    });
}));

router.post('/stream', asyncMiddleware((req, res, next) => {
    const { io, sockets } = req.app.locals;

    const chartID = get(req.body, 'chartID', null);

    if (!chartID) {
        res.json(errorResponse({
            message: 'Invalid request. Must include a chart ID',
        }));
    }

    let stream;
    if (sockets.hasOwnProperty(chartID)) {
        stream = sockets[chartID].stream;
    } else {
        stream = io.of(`/${chartID}`);
        sockets[chartID] = { stream };
    }

    const refreshRate = get(req.body, 'refreshRate', 750);
    const variables = get(req.body, 'variables', {});
    const channels = get(req.body, 'channels', []);

    const streamID = uuidv4();
    res.json(validResponse({
        streamID,
    }));

    stream.on('connection', socket => {
        console.log('Connnected!!!');

        sockets[chartID].loopID = setInterval(() => {
            const promises = getLatestUsage(req.app.locals.db, { variables, channels });

            Promise.all(promises).then(results => {
                const usages = results.flat();
                socket.emit('usage', validResponse({
                    chartID,
                    streamID,
                    results: usages,
                }));
                console.log(usages);
            }).catch(error => {
                socket.emit('usage-error', errorResponse({
                    chartID,
                    streamID,
                    error,
                }));
            });
        }, refreshRate);

        socket.on('disconnect', reason => {
            if (reason === 'client namespace disconnect' || reason === 'transport close') {
                console.log('Client Disconnected');
                clearInterval(sockets[chartID].loopID);

                stream.removeAllListeners();
                Object.keys(stream.connected).forEach(socketID => {
                    stream.connected[socketID].disconnect();
                });
                delete io.nsps[`/${chartID}`];
                delete sockets[chartID];
            }
        });
    });

}));

export default router;
