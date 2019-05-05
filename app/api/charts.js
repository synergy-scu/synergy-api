import uuidv4 from 'uuid/v4';
import { get } from 'lodash';

import { selectFormatter, insertFormatter, updateFormatter, deleteFormatter } from '../utils/formatters';

export const getCharts = (db, payload) => {
    const sql = selectFormatter({
        table: 'charts',
        ...payload,
    });

    const memberSql = selectFormatter({
        table: 'chartlings',
        ...payload,
    });

    return [
        db.query(sql),
        db.query(memberSql),
    ];
};

export const getChart = (db, payload) => {
    const chartID = payload.chartID;

    const sql = selectFormatter({
        table: 'charts',
        variables: { chartID },
    });

    const memberSql = selectFormatter({
        table: 'chartlings',
        variables: { chartID },
    });

    return [
        db.query(sql),
        db.query(memberSql),
    ];
};

export const createChart = (db, payload) => {
    // console.log(payload);
    const now = new Date();
    const chartID = uuidv4();
    const sql = insertFormatter({
        table: 'charts',
        variables: {
            chartID,
            name: get(payload, 'variables.name', null),
            chartType: get(payload, 'variables.chartType', null),
            usageType: get(payload, 'variables.usageType', null),
            members: get(payload, 'variables.members.length', 0),
            options: get(payload, 'variables.options', null),
            all: get(payload, 'variables.all', 0),
            created: now,
            updated: now,
        },
    });
    console.log(sql);

    const promises = get(payload, 'variables.members', []).map(member => {
        const memberSql = insertFormatter({
            table: 'chartlings',
            variables: {
                chartID,
                ...member,
                added: now,
            },
        });
        return db.query(memberSql);
    });

    promises.unshift(db.query(sql));

    return {
        queries: promises,
        id: chartID,
    };
};

export const updateChart = (db, payload) => {
    const now = new Date();
    const promises = [];

    const chartID = payload.chartID;
    const additions = get(payload, 'add', null);
    const removals = get(payload, 'remove', null);

    if (additions) {
        additions.forEach(member => {
            const sql = insertFormatter({
                table: 'chartlings',
                variables: {
                    chartID,
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
                table: 'chartlings',
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
        table: 'charts',
        where: { chartID },
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

export const deleteChart = (db, payload) => {
    const chartID = payload.chartID;

    const delChartSql = deleteFormatter({
        table: 'charts',
        where: { chartID },
    });

    const delChartingsSql = deleteFormatter({
        table: 'chartlings',
        where: { chartID },
    });

    return {
        queries: [
            db.query(delChartSql),
            db.query(delChartingsSql),
        ],
    };
};
