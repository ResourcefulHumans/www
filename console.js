'use strict'

const program = require('commander')
const Promise = require('bluebird')
const config = require('./config')

program
  .version(config.get('version'))
  .command('config [name]')
  .description('Print configuration')
  .action(name => {
    return Promise.try(() => {
      console.log(config.get(name))
    })
  })
program.parse(process.argv)
