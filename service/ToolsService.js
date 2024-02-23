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
exports.lookup_domain = function (domain, clientIp) {
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
            client_ip: clientIp,
            created_at: Date.now()
          }
          
          // insert into db before resolving promise
          pool.query(`insert into ${process.env.MYSQL_LOOKUP_TABLE} (domain_name, ipv4_addresses, client_ip) values(?, ?, ?)`, [domain, JSON.stringify(payload.addresses), clientIp], (err, result) => {
            if (err) {
              console.log(err)
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
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    resolve({
      status: ipv4Regex.test(request.ip)
    });
  });
}

