const mysql = require('mysql');

var mysqlConfig;
if (require('./dbConfig.json').dbconfig) {
    mysqlConfig = require('./dbConfig.json').dbconfig;
} else {
    console.log("Mysql Configuration Not Found");
    process.exit();
}

const db = mysql.createPool(mysqlConfig);

module.exports.execQuery = function (query, values) {
    return new Promise(function (resolve, reject) {
        if (mysqlConfig.enable) {
            console.log('database', "".concat(query, "-- [", values, "]"));
            db.getConnection((error, connection) => {
                if (error) {
                    console.log("Error -> ", error);
                    reject(error)
                } else {

                    connection.query(query, values, function (err, rows, fields) {
                        connection.release();

                        if (err) {
                            console.log('rejecting ', query, values)
                            console.log(err)
                            reject(err)
                        } else {
                            resolve({ rows: rows, fields: fields })
                        }

                    })

                }
            })
        } else {
            resolve({});
        }
    })
}

module.exports.dbCheck = function () {
    return new Promise((resolve, reject) => {
        db.getConnection((err, connection) => {
            if (err) {
                console.log("Error -> ", err);
                if (err.code === 'ER_ACCESS_DENIED_ERROR') {
                    err = new Error('Could not access the database. Check MySQL config and authentication credentials');
                }
                if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_SEQUENCE_TIMEOUT') {
                    err = new Error('Could not connect to the database. Check MySQL host and port configuration');
                }
                resolve(err);
            } else {
                connection.release();
                resolve(true);
            }
        })
    });
}
