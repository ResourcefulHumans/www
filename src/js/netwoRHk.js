'use strict'

/* global window, document, ga */

const $ = require('jquery')
require('tether')
require('bootstrap')
require('vide')
require('velocity')
const Navigation = require('resourceful-humans.com/src/js/module/navigation')
const Scroll = require('resourceful-humans.com/src/js/module/scroll')
const TrackLinkClicks = require('resourceful-humans.com/src/js/module/track-link-clicks')
const VerticalTextSlider = require('resourceful-humans.com/src/js/module/vertical-text-slider')
const PlayableVideo = require('resourceful-humans.com/src/js/module/playable-video')

$(() => {
  const $window = $(window)
  const $htmlBody = $('html, body')
  const $body = $(document.body)
  require('resourceful-humans.com/src/js/module/jquery-visible')($, $window)
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
