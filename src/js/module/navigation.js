'use strict'

module.exports = ($, $htmlBody, window, document) => {
  // Close navar on click
  const $navbarMobile = $('#navbar-mobile')
  $('.navbar *[href]').on('click', (ev) => {
    ev.preventDefault()
    $navbarMobile.collapse('hide')
    const a = $(ev.target).closest('a')
    const href = a.attr('href')
    const target = a.attr('target')
    const trg = href.split('#')
    if (trg.length === 2 && document.location.pathname === trg[0]) {
      $htmlBody.animate({scrollTop: $('#' + trg[1]).offset().top - 40}, 1000)
    } else {
      if (target === '_blank') {
        window.open(href)
      } else {
        window.location = href
      }
    }
  })
}
