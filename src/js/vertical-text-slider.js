'use strict'

function VerticalTextSlider ($, $window) {
  const self = this
  self.$window = $window
  self.$ = $
  self.slider = $('.vertical-text-slider')
  self.list = this.slider.find('*[role=list]')
  self.items = this.list.find('*[role=listitem]')
  self.height = $(this.items[1]).position().top - $(this.items[0]).position().top
  self.width = $(this.list).width()
  self.slider.css({
    'height': this.height + 'px',
    'width': this.width + 'px',
    'overflow': 'hidden'
  })
  self.start()
  self.top = 0
  self.step = 0
  self.slider.on('visibility.invisible', self.stop.bind(self))
  self.slider.on('visibility.visible', self.start.bind(self))
}

VerticalTextSlider.prototype.start = function () {
  const self = this
  if (self.animation) return
  self.animation = self.$window[0].setInterval(self.next.bind(self), 2000)
}

VerticalTextSlider.prototype.stop = function () {
  const self = this
  if (!self.animation) return
  self.$window[0].clearInterval(self.animation)
  self.animation = null
}

VerticalTextSlider.prototype.reset = function () {
  const self = this
  self.list.velocity({top: 0}, {duration: 1000})
  self.top = self.step = 0
  self.start()
}

VerticalTextSlider.prototype.next = function () {
  const self = this
  self.top = self.top - self.height
  self.list.velocity({top: self.top}, {duration: 1000})
  self.step++
  if (self.step >= self.items.length - 1) {
    self.stop()
    self.$window[0].setTimeout(self.reset.bind(self), 10000)
  }
}

module.exports = VerticalTextSlider
