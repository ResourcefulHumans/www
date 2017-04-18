import {createClient} from 'contentful'
const $ = require('jquery')

export function TransformationContent (sections, nav) {
  const self = this
  self.transformationContentInited = false
  self.prItems = []
  self.trPage = 0
  self.sections = sections
  self.nav = nav
}

TransformationContent.prototype.load = function () {
  const self = this
  if (self.transformationContentInited) return
  self.transformationContentInited = true
  createClient({
    space: 'jsz2fojn9br4',
    accessToken: 'd38594b2e5df6ccaf29dbb2c05db81ea3b48f9d4d0cc0d2b3c05dd13f6007da6',
    host: 'cdn.contentful.com'
  })
    .getEntries({
      content_type: 'pr'
    })
    .then(payload => {
      self.prItems = payload.items.sort((a, b) => new Date(b.fields.publicationDate).getTime() - new Date(a.fields.publicationDate).getTime())
      self.showPage(0)
    })
}

TransformationContent.prototype.showPage = function (page) {
  const self = this
  const numPages = Math.ceil(self.prItems.length / self.sections.length)
  if (page < 0) page = 0
  if (page > numPages) page = 0
  self.trPage = page
  self.showOrHideEntry(page, 0)
  self.showOrHideEntry(page, 1)
  self.showOrHideEntry(page, 2)
  const button = self.nav.find('*[role="checkbox"]:first').clone()
  self.nav.text('')
  for (let i = 0; i < numPages; i++) {
    const b = button.clone().appendTo(self.nav)
    b.attr('aria-checked', i === page ? 'true' : 'false')
    b.on('click', self.showPage.bind(self, i))
  }
}

TransformationContent.prototype.showOrHideEntry = function (page, index) {
  const self = this
  if (self.prItems[index + (self.sections.length * page)]) {
    self.showEntry($(self.sections[index]), self.prItems[index + (self.sections.length * page)])
  } else {
    self.hideEntry($(self.sections[index]))
  }
}

TransformationContent.prototype.showEntry = function ($section, entry) {
  $section.find('*[role=heading]').text(entry.fields.title)
  $section.find('*[role=document]').text(entry.fields.description)
  const time = $section.find('time')
  const pubDate = new Date(entry.fields.publicationDate)
  time.text(pubDate.toLocaleString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}))
  time.attr('datetime', pubDate)
  const link = $section.find('*[role=link]').clone()
  const linkParent = $section.find('*[role=link]').parent()
  linkParent.text('')
  if (entry.fields.link) {
    let l = link.clone().appendTo(linkParent)
    l.attr('href', entry.fields.link)
    l.text(l[0].hostname)
  }
  if (entry.fields.downloads) {
    entry.fields.downloads.forEach(download => {
      let l = link.clone().appendTo(linkParent)
      l.attr('href', download.fields.file.url)
      l.text(download.fields.title)
    })
  }
  $section.show()
}

TransformationContent.prototype.hideEntry = function ($section) {
  $section.hide()
}
