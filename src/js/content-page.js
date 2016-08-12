'use strict'

/* global window, document */

const $ = require('jquery')
require('tether')
require('bootstrap')
const Navigation = require('./module/navigation')
const Scroll = require('./module/scroll')

$(() => {
  const $window = $(window)
  const $htmlBody = $('html, body')
  const $body = $(document.body)
  const vm = {}
  vm.scroll = new Scroll($, $window, $body)
  vm.navigation = new Navigation($, $htmlBody, window, document)
})
