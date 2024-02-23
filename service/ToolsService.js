'use strict';
require('dotenv').config();
const dns = require('dns');
const pool = require('../db/pool');
const { respondWithCode } = require('../utils/writer');
/**
 * Lookup domain
 * Lookup domain and return all IPv4 addresses
 *
 * domain String Domain name
 * returns model.Query
 **/
exports.lookup_domain = function (domain) {
  return new Promise(function (resolve, reject) {

    // Lookup the IP addresses associated with the domain
    dns.lookup(domain, {family: 4, all: true}, (err, addresses, family) => {
      if (err) {
        reject(respondWithCode(404, { // overwrite default error code of 400 from callee
          message: 'Unable to resolve domain'
        }));
      } else {
        // check if found
        if (addresses) {
          const payload = {
            addresses: addresses.map((ip) => {
              return {ip: ip.address}
            }),
            domain: domain,
            created_at: Date.now()
          }
          
          // insert into db before resolving promise
          console.log('process.env.MYSQL_LOOKUP_TABLE', process.env.MYSQL_LOOKUP_TABLE)
          pool.query(`insert into ${process.env.MYSQL_LOOKUP_TABLE} (domain_name, ipv4_addresses) values(?, ?)`, [domain, JSON.stringify(payload.addresses)], (err, result) => {
            if (err) {
              console.log('err', err)
              reject({
                message: 'Unable to insert into db'
              });      
            } else {
              resolve(payload);
            }
          });
        }
      }
    });
  });
}


/**
 * Simple IP validation
 * Simple IP valication
 *
 * request Handler.ValidateIPRequest IP to validate
 * returns handler.ValidateIPResponse
 **/
exports.validate_ip = function (request) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = { "empty": false };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

