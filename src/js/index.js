'use strict'

/* global window, document */

const $ = require('jquery')
require('tether')
require('bootstrap')
require('vide')

$(() => {
  const $window = $(window)
  const $body = $(document.body)
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
})
