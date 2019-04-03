import mysql from 'mysql';
import { get } from 'lodash';

export const selectFormatter = ({ table, columns = [], variables = null, limit = null, order = null, useRaw = new Set() }) => {

    const cols = columns.length ? columns.map(() => '??').join(', ') : '*';
    const vars = variables ? ` WHERE ${Object.keys(variables).map(() => '?? = ?').join(', ')}` : '';
    const orders = order ? ` ORDER BY ${Object.values(order).map(direction => '?? '.concat(direction.toUpperCase())).join(', ')}` : '';
    const limits = limit ? ` LIMIT ${[limit.offset || 0, limit.count || 100].join(', ')}` : '';

    const sql = `SELECT ${cols} FROM ${table}`.concat(vars, orders, limits);

    let insert = [];
    if (columns.length) {
        insert = insert.concat(columns);
    }

    if (variables && Object.keys(variables).length) {
        Object.entries(variables).forEach(([key, value]) => {
            let val = value;
            if (useRaw.has(key)) {
                val = mysql.raw(value);
            }
            insert = insert.concat([key, val]);
        });
    }

    if (order && Object.keys(order).length) {
        Object.keys(order).forEach(column => {
            insert.push(column);
        });
    }

    return mysql.format(sql, insert);
};

export const insertFormatter = ({ table, variables }) => {
    if (!variables) {
        throw new Error('No variables provided for INSERT statement');
    }
    const sql = `INSERT INTO ${table} SET ?`;
    return mysql.format(sql, variables);
};

export const updateFormatter = ({ table, where, variables, useRaw = new Set() }) => {
    if (!variables) {
        throw new Error('No variables provided for UPDATE statement');
    }
    const rows = where ? ` WHERE ${Object.keys(where).map(() => '?? = ?').join(', ')}` : '';

    const sql = `UPDATE ${table} SET ?`.concat(rows);


    Object.entries(variables).forEach(([key, value]) => {
        if (useRaw.has(key)) {
            variables[key] = mysql.raw(value);
        }
    });

    let updates = [variables];

    Object.entries(where).forEach(column => {
        updates = updates.concat(column);
    });

    return mysql.format(sql, updates);
};

export const deleteFormatter = ({ table, where }) => {
    const rows = where ? ` WHERE ${Object.keys(where).map(() => '?? = ?').join(', ')}` : '';

    const sql = `DELETE FROM ${table}`.concat(rows);

    let deleter = [];
    Object.entries(where).forEach(column => {
        deleter = deleter.concat(column);
    });

    return mysql.format(sql, deleter);
};

export const usageFormatter = ({ variables, include }) => {

    let selectors = [];
    let isFirstSelector = true;

    const channels = include.map(channel => {
        isFirstSelector = false;
        selectors = selectors.concat(['channelID', channel.channelID]);
        return `?? = ?`;
    }).join(' OR ');
    const formattedChannels = ` (${channels})`;

    let where = ` WHERE${include.length ? formattedChannels : ''}`;

    const isAfter = get(variables, 'after', -1);
    const isBefore = get(variables, 'before', -1);


    if (isAfter > 0) {
        where = where.concat(`${!isFirstSelector ? ' AND' : ''} ?? >= ?`);
        selectors = selectors.concat(['time', new Date(isAfter)]);
        isFirstSelector = false;
    }

    if (isBefore > 0) {
        where = where.concat(`${!isFirstSelector ? ' AND' : ''} ?? <= ?`);
        selectors = selectors.concat(['time', new Date(isBefore)]);
        isFirstSelector = false;
    }

    const sql = `SELECT * FROM usages`.concat(where);

    return mysql.format(sql, selectors);
};
