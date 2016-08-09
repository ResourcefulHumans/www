'use strict'

function TestimonialSlider ($, $window, list) {
  const self = this
  self.$window = $window
  self.$ = $
  self.list = list
  self.slides = []
  this.list.find('*[role=listitem]').each((i, el) => {
    const slide = $(el)
    slide.attr('aria-expanded', i === 0 ? 'true' : 'false')
    slide.css('left', i === 0 ? '0' : '100%')
    self.slides.push(slide)
  })
  self.controls = []
  $('#' + this.list.attr('aria-controls')).find('*[role=checkbox]').each((i, el) => {
    const ctrl = $(el)
    ctrl.attr('aria-checked', i === 0 ? 'true' : 'false')
    self.controls.push(ctrl)
    ctrl.on('click', self.controlClicked.bind(self, i))
  })
  self.width = $(this.list).width()
  self.step = 0
  self.list.on('visibility.invisible', self.stop.bind(self))
  self.list.on('visibility.visible', self.start.bind(self))
}

TestimonialSlider.prototype.start = function () {
  const self = this
  if (self.animation) return
  self.animation = self.$window[0].setInterval(self.next.bind(self), 3000)
}

TestimonialSlider.prototype.stop = function () {
  const self = this
  if (!self.animation) return
  self.$window[0].clearInterval(self.animation)
  self.animation = null
}

TestimonialSlider.prototype.next = function () {
  const self = this
  self.showSlide(self.step + 1)
}

TestimonialSlider.prototype.controlClicked = function (slide) {
  const self = this
  self.stop()
  self.showSlide(slide)
  if (self.restartTimer) {
    self.$window[0].clearInterval(self.restartTimer)
  }
  self.restartTimer = self.$window[0].setTimeout(self.start.bind(self), 5000)
}

TestimonialSlider.prototype.showSlide = function (num) {
  const self = this
  if (self.step === num) return
  if (self.progress) return
  self.progress = true
  if (self.step > -1) {
    self.controls[self.step].attr('aria-checked', 'false')
    self.slides[self.step].attr('aria-expanded', 'false')
    self.slides[self.step].velocity({left: '-100%'}, {
      duration: 1000, complete: (elements) => {
        self.$(elements).css('left', '100%')
      }
    })
  }
  self.step = num
  if (self.step >= self.slides.length) {
    self.step = 0
  }
  self.controls[self.step].attr('aria-checked', 'true')
  self.slides[self.step].attr('aria-expanded', 'true')
  self.slides[self.step].velocity({left: '0%'}, {
    duration: 1000,
    complete: () => {
      self.progress = false
    }
  })
}

module.exports = TestimonialSlider
