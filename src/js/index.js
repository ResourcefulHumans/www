'use strict'

/* global window, document */

const $ = require('jquery')
require('tether')
require('bootstrap')
require('vide')
require('velocity')
const VerticalTextSlider = require('./vertical-text-slider')

$(() => {
  const $window = $(window)
  require('./jquery-visible')($, $window)
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
    $('.check-visibility').each((i, el) => {
      el = $(el)
      if (el.visible(true)) {
        if (!el.hasClass('is-visible')) {
          el.addClass('is-visible')
          el.trigger('visibility.visible')
        }
        el.addClass('was-visible')
      } else {
        if (el.hasClass('is-visible')) {
          el.removeClass('is-visible')
          el.trigger('visibility.invisible')
        }
      }
    })
  }
  $window.on('scroll', onScroll)
  onScroll()

  vm.slider = new VerticalTextSlider($, $window)
})
