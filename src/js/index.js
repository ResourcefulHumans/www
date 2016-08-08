'use strict'

/* global window, document */

const $ = require('jquery')
require('tether')
require('bootstrap')
require('vide')
const VerticalTextSlider = require('./vertical-text-slider')

$(() => {
  const $window = $(window)
  const $body = $(document.body)
  const vm = {}
  const onScroll = () => {
    if ($window.scrollTop() > 0) {
      $body.addClass('scrolling')
      $body.removeClass('attop')
    } else {
      $body.removeClass('scrolling')
      $body.addClass('attop')
    }
  }
  $window.on('scroll', onScroll)
  onScroll()

  vm.slider = new VerticalTextSlider($, $window)
})
