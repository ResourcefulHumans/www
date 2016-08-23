'use strict'

/* global window, document, alert, grecaptcha */

const $ = require('jquery')
require('tether')
require('bootstrap')
require('vide')
require('velocity')
const VerticalTextSlider = require('./module/vertical-text-slider')
const TestimonialSlider = require('./module/testimonial-slider')
const Navigation = require('./module/navigation')
const Scroll = require('./module/scroll')

$(() => {
  const $window = $(window)
  const $htmlBody = $('html, body')
  require('./module/jquery-visible')($, $window)
  const $body = $(document.body)
  const vm = {}
  vm.scroll = new Scroll($, $window, $body)
  vm.heroSlider = new VerticalTextSlider($, $window)
  vm.testimonialSlider = new TestimonialSlider($, $window, $('#testimonials').find('article'))
  vm.navigation = new Navigation($, $htmlBody, window, document)

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

  // Play garage video once it becomes visible
  const $garage = $('#garage')
  vm.garageVideo = $garage.data('vide')
  vm.heroVideo = $('.hero-video').data('vide')
  $garage.on('visibility.visible', () => {
    const video = vm.garageVideo.getVideoObject()
    if (video) {
      video.play()
      vm.heroVideo.resize() // Playing the garage video resizes the page height, need to re-adjust the hero video
    }
  })

  // Contact form
  let isCaptchaFilled = false
  let captchaToken
  window.reCaptchaLoaded = () => {
    grecaptcha.render('recaptcha', {
      'sitekey': $('script[src^="https://www.google.com/recaptcha/api.js"]').data('sitekey'),
      'callback': captchaFilled,
      'expired-callback	': captchaExpired
    })
  }
  const captchaFilled = (token) => {
    isCaptchaFilled = true
    captchaToken = token
  }
  const captchaExpired = () => {
    isCaptchaFilled = false
    captchaToken = null
  }
  window.submitContactForm = () => {
    if (!isCaptchaFilled) {
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
        $htmlBody.animate({scrollTop: $contact.offset().top}, 1000)
      })
    return false
  }
})
