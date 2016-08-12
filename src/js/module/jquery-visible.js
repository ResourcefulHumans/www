'use strict'

module.exports = ($, $window) => {
  /**
   * Copyright 2012, Digital Fusion
   * Licensed under the MIT license.
   * http://teamdf.com/jquery-plugins/license/
   *
   * @author Sam Sehnert
   * @desc A small plugin that checks whether elements are within
   *     the user visible viewport of a web browser.
   *     only accounts for vertical position, not horizontal.
   */
  $.fn.visible = function (partial) {
    const $t = $(this)
    const viewTop = $window.scrollTop()
    const viewBottom = viewTop + $window.height()
    const _top = $t.offset().top
    const _bottom = _top + $t.height()
    const compareTop = partial === true ? _bottom : _top
    const compareBottom = partial === true ? _top : _bottom
    return ((compareBottom <= viewBottom) && (compareTop >= viewTop))
  }
}
