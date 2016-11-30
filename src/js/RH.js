'use strict'

/* global window, document, alert, grecaptcha, ga */

const $ = require('jquery')
require('tether')
require('bootstrap')
require('vide')
require('velocity')
const VerticalTextSlider = require('./module/vertical-text-slider')
const TestimonialSlider = require('./module/testimonial-slider')
const Navigation = require('./module/navigation')
const Scroll = require('./module/scroll')
const TrackLinkClicks = require('./module/track-link-clicks')
const PlayableVideo = require('./module/playable-video')
import loadFont from './load-font'
import {TransformationContent} from './module/transformation'

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
  if (typeof ga !== 'undefined') vm.trackLinkClicks = new TrackLinkClicks($, ga)

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
  const resizeHeroVideo = () => {
    const video = vm.garageVideo.getVideoObject()
    if (video && !$body.hasClass('video-playing')) {
      video.play()
      vm.heroVideo.resize() // Playing the garage video resizes the page height, need to re-adjust the hero video
    }
  }
  $garage.on('visibility.visible', resizeHeroVideo)

  // Contact form
  let isCaptchaFilled = false
  let captchaToken
  window.reCaptchaLoaded = () => {
    grecaptcha.render('recaptcha', {
      'sitekey': $('script[src^="https://www.google.com/recaptcha/api.js"]').data('sitekey'),
      'callback': captchaFilled,
      'expired-callback': captchaExpired
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
    const role = $contact.find('input[name=role]:checked').val()
    $contact.find('button').attr('disabled', 'disabled')
    $
      .ajax({
        method: 'POST',
        url: $contact.attr('action'),
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
          role,
          email: $contact.find('input[type=email]').val(),
          token: captchaToken
        })
      })
      .done(() => {
        $contact.addClass('success')
        $htmlBody.animate({scrollTop: $contact.offset().top}, 1000)
        if (typeof ga !== 'undefined') ga('send', {hitType: 'event', eventCategory: 'ContactForm', eventAction: 'submitted', eventLabel: role})
      })
    return false
  }

  // Playable videos
  vm.videos = []
  $('.playable-video').each((idx, el) => {
    const $el = $(el)
    $el.on('playing', resizeHeroVideo)
    $el.on('visibility.visible', resizeHeroVideo)
    vm.videos.push(new PlayableVideo($, el, typeof ga !== 'undefined' ? ga : undefined))
  })

  // Transformation content
  const transformationContent = new TransformationContent($('#transformation section'), $('#transformation *[role=navigation]'))
  $('#transformation').on('visibility.visible', transformationContent.load.bind(transformationContent))
})

loadFont('//cloud.typenetwork.com/projects/316/fontface.css')
