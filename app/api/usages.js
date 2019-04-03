import { usageFormatter } from '../utils/formatters';

export const getUsageLegacy = (db, payload) => {

    const sql = usageFormatter({
        variables: payload.variables,
        include: payload.include,
    });

    return db.query(sql);
};
