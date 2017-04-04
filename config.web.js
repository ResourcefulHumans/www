'use strict'

const path = require('path')
const config = require('./config')
const appConfig = require(path.join(process.cwd(), 'config.' + config.get('app') + '.json'))
const pjson = require('./package.json')

process.stdout.write(JSON.stringify(
  {
    app: config.get('app'),
    environment: config.get('environment'),
    version: pjson.version,
    appName: appConfig.name,
    description: appConfig.description,
    apiIndex: config.get('api_endpoint') + '/api',
    apiEndpoint: config.get('api_endpoint'),
    webHost: config.get('web_host'),
    baseHref: '/',
    mimeType: 'application/vnd.resourceful-humans.www.v1+json',
    ga: appConfig.ga,
    jsonld: appConfig.jsonld
  },
  '\t',
  2
))
