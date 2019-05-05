import uuidv4 from 'uuid/v4';
import { get } from 'lodash';

import { selectFormatter, insertFormatter, updateFormatter, deleteFormatter } from '../utils/formatters';

export const getReminders = (db, payload) => {
    const sql = selectFormatter({
        table: 'reminders',
        ...payload,
    });

    return db.query(sql);
};

export const getReminder = (db, payload) => {
    const reminderID = payload.reminderID;

    const sql = selectFormatter({
        table: 'reminders',
        variables: { reminderID },
    });

    return db.query(sql);
};

export const createReminder = (db, payload) => {
    const now = new Date();
    const reminderID = uuidv4();
    const sql = insertFormatter({
        table: 'reminders',
        variables: {
            reminderID,
            channelID: get(payload, 'variables.channelID', null),
            message: get(payload, 'variables.message', null),
            time: get(payload, 'variables.time', null),
            created: now,
            updated: now,
        },
    });

    return {
        query: db.query(sql),
        uuid: reminderID,
    };
};

export const updateReminder = (db, payload) => {
    const now = new Date();
    const reminderID = payload.reminderID;

    const sql = updateFormatter({
        table: 'reminders',
        where: { reminderID },
        variables: payload.variables,
        updated: now,
    });

    return db.query(sql);
};

export const deleteReminder = (db, payload) => {
    const reminderID = payload.reminderID;

    const sql = deleteFormatter({
        table: 'reminders',
        where: { reminderID },
    });

    return db.query(sql);
};
