/* global window, document, ga */

import 'babel-polyfill'
import loadFont from 'meownica-web-fonts-loader'
const $ = require('jquery')
require('tether')
require('bootstrap')
const Navigation = require('./module/navigation')
const Scroll = require('./module/scroll')
const TrackLinkClicks = require('./module/track-link-clicks')

$(() => {
  const $window = $(window)
  const $htmlBody = $('html, body')
  const $body = $(document.body)
  const vm = {}
  vm.scroll = new Scroll($, $window, $body)
  vm.navigation = new Navigation($, $htmlBody, window, document)
  if (typeof ga !== 'undefined') vm.trackLinkClicks = new TrackLinkClicks($, ga)
})

loadFont('//cloud.typenetwork.com/projects/316/fontface.css', 'font-loaded')
