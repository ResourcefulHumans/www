'use strict'

/* global window, document, ga */

const $ = require('jquery')
require('tether')
require('bootstrap')
require('vide')
require('velocity')
const Navigation = require('./module/navigation')
const Scroll = require('./module/scroll')
const TrackLinkClicks = require('./module/track-link-clicks')
const VerticalTextSlider = require('./module/vertical-text-slider')
const PlayableVideo = require('./module/playable-video')
import loadFont from './load-font'

$(() => {
  const $window = $(window)
  const $htmlBody = $('html, body')
  const $body = $(document.body)
  require('./module/jquery-visible')($, $window)
  const vm = {}
  vm.scroll = new Scroll($, $window, $body)
  vm.navigation = new Navigation($, $htmlBody, window, document)
  if (typeof ga !== 'undefined') vm.trackLinkClicks = new TrackLinkClicks($, ga)

  // Hero
  vm.heroSlider = new VerticalTextSlider($, $window)
  const positionRHWayLogo = () => {
    const theRHWay = $('.hero-video *[role=heading] h1 span')
    const theRHWayOffset = theRHWay.offset()
    const theRHWayHeight = theRHWay.height() * 0.875
    $('#rhcircle').css({
      top: theRHWayOffset.top - (theRHWayHeight / 2),
      left: theRHWayOffset.left - (theRHWayHeight * 2) + (theRHWayHeight * 0.25),
      height: theRHWayHeight * 2,
      width: theRHWayHeight * 2
    })
  }
  const onResize = () => {
    positionRHWayLogo()
  }
  $window.on('resize', onResize)
  $window.on('load', onResize)
  window.setTimeout(onResize, 100)

  // Playable videos
  vm.videos = []
  $('.playable-video').each((idx, el) => {
    vm.videos.push(new PlayableVideo($, el, typeof ga !== 'undefined' ? ga : undefined))
  })
})

loadFont('//cloud.typenetwork.com/projects/316/fontface.css')
