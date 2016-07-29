'use strict'

let nconf = require('nconf')
let pjson = require('./package.json')

nconf.use('memory')

nconf
// Allow overwrites from env
  .env({
    whitelist: [
      'environment',
      'host',
      'port',
      'web_host',
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
  'environment': 'development',
  'mime_type': 'application/vnd.resourceful-humans.www.v1+json',
  'port': port,
  'host': host,
  'api_host': 'http://' + host + ':' + port,
  'web_host': 'http://' + host + ':' + port,
  'base_href': '/',
  'deployVersion': +new Date(),
  'version': pjson.version,
  'app': pjson.name,
  'appName': pjson.appName,
  'description': pjson.description,
  'aws': {
    'website_bucket': '2016.resourceful-humans.com',
    'region': 'eu-central-1',
    'access_key_id': 'secret',
    'secret_access_key': 'secret'
  }
})

module.exports = nconf
