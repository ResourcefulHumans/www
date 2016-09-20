'use strict'

module.exports = ($, ga) => {
  $('a[target=_blank]').on('click', ev => {
    const link = $(ev.target).closest('a')
    const text = '"' + (link.attr('title') || link.text()) + '" <' + link.attr('href') + '>'
    ga('send', {hitType: 'event', eventCategory: 'outbound', eventAction: 'click', eventLabel: text})
  })
}
