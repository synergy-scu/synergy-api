import uuidv4 from 'uuid/v4';
import { get } from 'lodash';

import { selectFormatter, insertFormatter, updateFormatter, deleteFormatter } from '../utils/formatters';

export const getGroups = (db, payload) => {
    const sql = selectFormatter({
        table: 'groups',
        limit: payload.limit,
        order: payload.order,
    });

    const memberSql = selectFormatter({
        table: 'groupings',
        limit: payload.limit,
        order: payload.order,
    });

    return [
        db.query(sql),
        db.query(memberSql),
    ];
};

export const getGroup = (db, payload) => {
    const groupID = payload.groupID;

    const sql = selectFormatter({
        table: 'groups',
        variables: { groupID },
    });

    const memberSql = selectFormatter({
        table: 'groupings',
        variables: { groupID },
    });

    return [
        db.query(sql),
        db.query(memberSql),
    ];
};

export const createGroup = (db, payload) => {
    const now = new Date();
    const groupID = uuidv4();
    const sql = insertFormatter({
        table: 'groups',
        variables: {
            groupID,
            name: get(payload, 'variables.name', null),
            members: get(payload, 'variables.members.length', 0),
            created: now,
            updated: now,
        },
    });

    const promises = get(payload, 'variables.members', []).map(member => {
        const memberSql = insertFormatter({
            table: 'groupings',
            variables: {
                groupID,
                ...member,
                added: now,
            },
        });
        return db.query(memberSql);
    });

    promises.unshift(db.query(sql));

    return {
        queries: promises,
        id: groupID,
    };
};

export const updateGroup = (db, payload) => {
    const now = new Date();
    const promises = [];

    const groupID = payload.groupID;
    const additions = get(payload, 'add', null);
    const removals = get(payload, 'remove', null);

    if (additions) {
        additions.forEach(member => {
            const sql = insertFormatter({
                table: 'groupings',
                variables: {
                    groupID,
                    ...member,
                    added: now,
                },
            });

            promises.push(db.query(sql));
        });
    }

    if (removals) {
        removals.forEach(member => {
            const sql = deleteFormatter({
                table: 'groupings',
                where: { uuid: member },
            });

            promises.push(db.query(sql));
        });
    }

    let sum = 0;
    let operator = null;
    if (additions || removals) {
        sum = get(payload, 'add.length', 0) - get(payload, 'remove.length', 0);
        if (sum > 0) {
            operator = '+';
        } else if (sum < 0) {
            operator = '-';
        }

        if (sum !== 0) {
            payload.variables.members = `members ${operator} ${sum}`;
        }
    }

    const sql = updateFormatter({
        table: 'groups',
        where: { groupID },
        variables: {
            ...payload.variables,
            updated: now,
        },
        useRaw: new Set(['members']),
    });

    promises.push(db.query(sql));

    return {
        queries: promises,
    };
};

export const deleteGroup = (db, payload) => {
    const groupID = payload.groupID;

    const delGroupSql = deleteFormatter({
        table: 'groups',
        where: { groupID },
    });

    const delGroupingsSql = deleteFormatter({
        table: 'groupings',
        where: { groupID },
    });

    return {
        queries: [
            db.query(delGroupSql),
            db.query(delGroupingsSql),
        ],
    };
};
