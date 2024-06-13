(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global["dom-inject"] = factory());
})(this, (function () {
  function _extends() {
    return _extends = Object.assign ? Object.assign.bind() : function (n) {
      for (var e = 1; e < arguments.length; e++) {
        var t = arguments[e];
        for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
      }
      return n;
    }, _extends.apply(null, arguments);
  }

  /**
   * Written by Elliott Mangham at Code Resolution. Maintained by Code Resolution.
   * made@coderesolution.com
   */
  var DomInject = /*#__PURE__*/function () {
    function DomInject(options) {
      if (options === void 0) {
        options = {};
      }
      this.options = _extends({
        loadingClass: options.loadingClass || 'loading',
        loadedClass: options.loadedClass || 'loaded',
        errorClass: options.errorClass || 'error'
      }, options);
    }
    var _proto = DomInject.prototype;
    _proto.fetchContent = function fetchContent(sourceUrl, sourceScope, includeParent) {
      if (sourceScope === void 0) {
        sourceScope = null;
      }
      if (includeParent === void 0) {
        includeParent = false;
      }
      var url = sourceUrl || window.location.href;
      return fetch(url).then(function (response) {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.text();
      }).then(function (data) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(data, 'text/html');
        var element = sourceScope ? doc.querySelector(sourceScope) : doc.body;
        if (!element) {
          throw new Error("Element not found for selector: " + sourceScope);
        }
        return includeParent && sourceScope ? element.outerHTML : element.innerHTML;
      });
    };
    _proto.loadContent = function loadContent(target, sourceUrl, sourceScope, _temp) {
      var _this = this;
      if (sourceUrl === void 0) {
        sourceUrl = null;
      }
      if (sourceScope === void 0) {
        sourceScope = null;
      }
      var _ref = _temp === void 0 ? {} : _temp,
        _ref$mode = _ref.mode,
        mode = _ref$mode === void 0 ? 'replace' : _ref$mode,
        _ref$beforeFetch = _ref.beforeFetch,
        beforeFetch = _ref$beforeFetch === void 0 ? null : _ref$beforeFetch,
        _ref$afterFetch = _ref.afterFetch,
        afterFetch = _ref$afterFetch === void 0 ? null : _ref$afterFetch,
        _ref$includeParent = _ref.includeParent,
        includeParent = _ref$includeParent === void 0 ? false : _ref$includeParent;
      var targetElement = typeof target === 'string' ? document.querySelector(target) : target;
      if (!targetElement) {
        console.error("Target element not found.");
        return;
      }
      this._toggleLoadingState(targetElement, true);
      if (beforeFetch) {
        beforeFetch(targetElement);
      }
      this.fetchContent(sourceUrl, sourceScope, includeParent).then(function (html) {
        if (mode === 'prepend') {
          targetElement.insertAdjacentHTML('afterbegin', html);
        } else if (mode === 'append') {
          targetElement.insertAdjacentHTML('beforeend', html);
        } else {
          // default to 'replace'
          targetElement.innerHTML = html;
        }
        _this._toggleLoadingState(targetElement, false);
        if (afterFetch) {
          afterFetch(targetElement);
        }
      })["catch"](function (error) {
        console.error('Error fetching content:', error);
        _this._toggleLoadingState(targetElement, false, true);
      });
    };
    _proto._toggleLoadingState = function _toggleLoadingState(element, isLoading, isError) {
      if (isError === void 0) {
        isError = false;
      }
      element.classList.toggle(this.options.loadingClass, isLoading);
      element.classList.toggle(this.options.loadedClass, !isLoading && !isError);
      element.classList.toggle(this.options.errorClass, isError);
    };
    return DomInject;
  }();

  return DomInject;

}));
