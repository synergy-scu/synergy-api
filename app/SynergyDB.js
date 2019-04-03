/* eslint-disable arrow-body-style */
import mysql from 'mysql';

import dbConfig from './config/database';

export class Database {
    constructor() {
        this.pool = mysql.createPool(dbConfig);
    }

    query = sql => {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(async (err, connection) => {
                if (err) {
                    return reject(err);
                }
                await connection.query(sql, (error, rows) => {
                    connection.release();
                    if (error) {
                        reject(error);
                    }
                    resolve(rows);
                });
            });
        });
    };

    close = () => {
        return new Promise((resolve, reject) => {
            this.pool.end(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    };
}

const SynergyDB = new Database();

export default SynergyDB;
