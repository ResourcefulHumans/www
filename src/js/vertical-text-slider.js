'use strict'

function VerticalTextSlider ($, $window) {
  const self = this
  self.$window = $window
  self.$ = $
  self.slider = $('.vertical-text-slider')
  self.list = this.slider.find('*[role=list]')
  self.items = this.list.find('*[role=listitem]')
  self.height = $(this.items[0]).height()
  self.width = $(this.list).width()
  self.slider.css('height', this.height + 'px')
  self.slider.css('width', this.width + 'px')
  self.start()
  self.top = 0
  self.step = 0
}

VerticalTextSlider.prototype.start = function () {
  const self = this
  self.animation = self.$window[0].setInterval(self.next.bind(self), 2000)
}

VerticalTextSlider.prototype.reset = function () {
  const self = this
  self.list.animate({top: 0}, 1000)
  self.top = self.step = 0
  self.start()
}

VerticalTextSlider.prototype.next = function () {
  const self = this
  self.top = self.top - self.height
  self.list.animate({top: self.top}, 1000)
  self.step++
  if (self.step >= self.items.length - 1) {
    self.$window[0].clearInterval(self.animation)
    self.animation = null
    self.$window[0].setTimeout(self.reset.bind(self), 10000)
  }
}

module.exports = VerticalTextSlider
