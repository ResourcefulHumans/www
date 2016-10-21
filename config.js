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
      'api_host',
      'aws__access_key_id',
      'aws__secret_access_key',
      'aws__website_bucket'
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
  'api_host': 'http://' + host + ':' + port,
  'web_host': 'http://' + host + ':' + port,
  'aws': {
    'region': 'eu-central-1'
  }
})

module.exports = nconf
