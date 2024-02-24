'use strict';
const pool = require('../db/pool');

/**
 * List queries
 * List queries
 *
 * returns List
 **/
exports.queries_history = function() {
  return new Promise(function(resolve, reject) {
    pool.query(`select * from ${process.env.MYSQL_LOOKUP_TABLE} ${process.env.MYSQL_LOOKUP_TABLE} ORDER BY lookup_timestamp DESC LIMIT 20`, (err, result) => {
      if (err) {
        reject({
          message: err
        });      
      } else {
        resolve(result.map((row) => {
          return {
            addresses: JSON.parse(row.ipv4_addresses),
            domain: row.domain_name,
            created_at: row.lookup_timestamp,
            client_ip: row.client_ip??''
          }
        }));
      }
    });
});
}

