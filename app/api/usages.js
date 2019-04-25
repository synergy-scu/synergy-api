import { usageFormatter } from '../utils/formatters';

export const getUsage = (db, payload) => {

    const sql = usageFormatter({
        variables: payload.variables,
        include: payload.include,
    });
    // console.log(sql);

    return db.query(sql);
};

export const getLatestUsage = (db, payload) => {
    const promises = payload.channels.map(channel => {
        const sql = usageFormatter({
            channels: [channel],
            variables: {
                order: {
                    by: 'id',
                    direction: 'DESC',
                },
                limit: 1,
            },
        });
        // console.log(sql);

        return db.query(sql);
    });

    return promises;
};
