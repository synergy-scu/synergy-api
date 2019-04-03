
import { selectFormatter, updateFormatter, deleteFormatter } from '../utils/formatters';

export const getDevices = (db, payload) => {
    const sql = selectFormatter({
        table: 'devices',
        variables: payload.variables,
        limit: payload.limit,
        order: payload.order,
    });

    return db.query(sql);
};

export const getDevice = (db, payload) => {
    const deviceID = payload.deviceID;

    const sql = selectFormatter({
        table: 'devices',
        variables: { deviceID },
    });

    return db.query(sql);
};

export const updateDevice = (db, payload) => {
    const now = new Date();
    const deviceID = payload.deviceID;

    const sql = updateFormatter({
        table: 'devices',
        where: { deviceID },
        variables: payload.variables,
        updated: now,
    });

    return db.query(sql);
};

export const deleteDevice = (db, payload) => {
    const deviceID = payload.deviceID;

    const delDeviceSql = deleteFormatter({
        table: 'devices',
        where: { deviceID },
    });

    const delChannelsSql = deleteFormatter({
        table: 'channels',
        where: { deviceID },
    });

    const delUsagesSql = deleteFormatter({
        table: 'usages',
        where: { deviceID },
    });

    return {
        queries: [
            db.query(delDeviceSql),
            db.query(delChannelsSql),
            db.query(delUsagesSql),
        ],
    };
};
