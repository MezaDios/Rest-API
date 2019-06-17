
import mysql from 'mysql';

import { promisify } from 'util';

import keys from './keys';

const pool = mysql.createPool(keys.database);

pool.getConnection((err, connection) => {
    if (err) {
        throw err;
    }
    else {
        connection.release();
        console.log('DB is connected.');
    }
})

export default pool;