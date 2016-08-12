'use strict'

module.exports = ($, $window, $body) => {
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
  $window[0].setTimeout(onScroll, 100)
}
