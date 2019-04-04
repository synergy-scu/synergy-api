import { usageFormatter } from '../utils/formatters';

export const getUsage = (db, payload) => {

    const sql = usageFormatter({
        variables: payload.variables,
        include: payload.include,
    });

    return db.query(sql);
};
