'use strict'

function PlayableVideo ($, el, ga) {
  const self = this
  self.$ = $
  self.el = $(el)
  self.ga = ga
  self.video = self.el.data('vide').getVideoObject()
  self.control = self.el.find('.control')
  self.control.on('click', ev => {
    ev.preventDefault()
    ev.stopPropagation()
    self.play()
  })
  self.el.on('click', ev => {
    if (!self.playing) return true
    ev.preventDefault()
    ev.stopPropagation()
    self.stop()
  })
  self.overlay = $(self.el.find('.play-overlay'))
  self.playing = false
}

PlayableVideo.prototype.play = function () {
  const self = this
  if (!self.video) return
  if (self.playing) return
  self.playing = true
  self.overlay.hide()
  self.video.play()
  self.el.trigger('playing')
  if (typeof self.ga !== 'undefined') self.ga('send', {hitType: 'event', eventCategory: 'Video', eventAction: 'played', eventLabel: self.el.attr('id')})
}

PlayableVideo.prototype.stop = function () {
  const self = this
  if (!self.video) return
  if (!self.playing) return
  self.playing = false
  self.overlay.show()
  self.video.pause()
  self.el.trigger('stopped')
  if (typeof self.ga !== 'undefined') self.ga('send', {hitType: 'event', eventCategory: 'Video', eventAction: 'stopped', eventLabel: self.el.attr('id')})
}

PlayableVideo.prototype.togglePlay = function () {
  const self = this
  if (self.playing) {
    self.stop()
  } else {
    self.play()
  }
}

module.exports = PlayableVideo
