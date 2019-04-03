import { selectFormatter, insertFormatter, updateFormatter, deleteFormatter } from '../utils/formatters';

export const isValidUser = (db, payload) => {
    const sql = selectFormatter({
        table: 'users',
        columns: ['email', 'password'],
        variables: payload.variables,
    });

    return db.query(sql);
};

export const getUser = (db, payload) => {
    const sql = selectFormatter({
        table: 'users',
        columns: ['id', 'name', 'email', 'family_size', 'created', 'updated'],
        variables: { email: payload.email },
    });

    return db.query(sql);
};

export const createUser = (db, payload) => {
    const now = new Date();
    // Will return a 200 with { type: "ER_DUP_ENTRY" } when attempting to create a new user with an existing email
    const sql = insertFormatter({
        table: 'users',
        variables: {
            ...payload.variables,
            created: now,
            updated: now,
        },
    });

    return db.query(sql);
};

export const updateUser = (db, payload) => {
    const now = new Date();

    const sql = updateFormatter({
        table: 'users',
        where: { email: payload.email },
        variables: payload.variables,
        updated: now,
    });

    return db.query(sql);
};

export const deleteUser = (db, payload) => {

    const sql = deleteFormatter({
        table: 'users',
        where: { email: payload.email },
    });

    return db.query(sql);
};
