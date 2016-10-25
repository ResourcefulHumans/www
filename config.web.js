'use strict'

const path = require('path')
const config = require('./config')
const appConfig = require(path.join(process.cwd(), 'config.' + config.get('app') + '.json'))
const pjson = require('./package.json')

module.exports = {
  app: config.get('app'),
  environment: config.get('environment'),
  version: pjson.version,
  appName: appConfig.name,
  description: appConfig.description,
  apiIndex: config.get('api_host') + '/api',
  apiHost: config.get('api_host'),
  webHost: config.get('web_host'),
  baseHref: '/',
  mimeType: 'application/vnd.resourceful-humans.www.v1+json',
  ga: appConfig.ga
}
