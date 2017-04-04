'use strict'

const nconf = require('nconf')

nconf.use('memory')

nconf
// Allow overwrites from env
  .env({
    whitelist: [
      'app',
      'environment',
      'host',
      'port',
      'web_host',
      'api_endpoint'
    ],
    lowerCase: true,
    separator: '__'
  })

let host = nconf.get('host') || 'localhost'
let port = nconf.get('port') || 8080

// Set defaults
nconf.defaults({
  'app': 'RH',
  'environment': 'development',
  'port': port,
  'host': host,
  'api_endpoint': 'http://' + host + ':' + port,
  'web_host': 'http://' + host + ':' + port
})

module.exports = nconf
