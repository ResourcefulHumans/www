'use strict'

/* global window, document, alert */

const $ = require('jquery')
require('tether')
require('bootstrap')
require('vide')
require('velocity')
const VerticalTextSlider = require('./vertical-text-slider')
const TestimonialSlider = require('./testimonial-slider')

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
  window.setTimeout(onScroll, 100)

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

  vm.heroSlider = new VerticalTextSlider($, $window)
  vm.testimonialSlider = new TestimonialSlider($, $window, $('#testimonials').find('*[role=list]'))

  // Play garage video once it becomes visible
  const $garage = $('#garage')
  vm.garageVideo = $garage.data('vide')
  $garage.on('visibility.visible', () => {
    const video = vm.garageVideo.getVideoObject()
    if (video) {
      video.play()
    }
  })

  // Contact form
  let captchaFilled = false
  let captchaToken
  window.captchaFilledCallback = (token) => {
    captchaFilled = true
    captchaToken = token
  }
  window.captchaExpiredCallback = () => {
    captchaFilled = false
    captchaToken = null
    console.log('captcha expired')
  }
  window.submitContactForm = () => {
    if (!captchaFilled) {
      alert('Please fill the reCAPTCHA!')
      return false
    }
    const $contact = $('#contact')
    $contact.find('button').attr('disabled', 'disabled')
    $
      .ajax({
        method: 'POST',
        url: $contact.attr('action'),
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
          role: $contact.find('input[name=role]:checked').val(),
          email: $contact.find('input[type=email]').val(),
          token: captchaToken
        })
      })
      .done(() => {
        $contact.addClass('success')
      })
    return false
  }
})
