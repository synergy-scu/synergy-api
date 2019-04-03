
import { selectFormatter, updateFormatter } from '../utils/formatters';

export const getChannels = (db, payload) => {
    const sql = selectFormatter({
        table: 'channels',
        variables: payload.variables,
        limit: payload.limit,
        order: payload.order,
    });

    return db.query(sql);
};

export const getChannel = (db, payload) => {
    const channelID = payload.channelID;

    const sql = selectFormatter({
        table: 'channels',
        variables: { channelID },
    });

    return db.query(sql);
};

export const updateChannel = (db, payload) => {
    const now = new Date();
    const channelID = payload.channelID;

    const sql = updateFormatter({
        table: 'channels',
        where: { channelID },
        variables: payload.variables,
        updated: now,
    });

    return db.query(sql);
};
