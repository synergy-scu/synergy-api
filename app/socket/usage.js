import uuidv4 from 'uuid/v4';
import { get } from 'lodash';

import IO from '../socket';
import app from '../app';
import { getUsage } from '../api/usages';

export const getLatestUsage = (variables, include, refreshRate) =>
    setInterval(() => {
        getUsage(app.locals.db, { variables, include })
            .then(result => {
                IO.emit('usage', { data: result });
            }).catch(error => {
                IO.emit('usage', { error });
            });
    }, refreshRate);

IO.connection('connection', socket => {
    const usageID = uuidv4();
    let usageLoopId = null;
    IO.emit('usageID', { usageID });

    socket.on('request', (from, data) => {
        const requestID = get(data, 'requestID', null);
        if (!requestID || requestID !== usageID) {
            return;
        }

        const refreshRate = get(data, 'refreshRate', 750);
        const variables = get(data, 'variables', {});
        const include = get(data, 'include', []);

        usageLoopId = getLatestUsage(variables, include, refreshRate);
    });

    socket.on('disconnect', () => {
        clearInterval(usageLoopId);
        console.log('Client disconnect');
    });
});
