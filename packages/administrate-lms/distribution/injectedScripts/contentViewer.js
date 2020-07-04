((history) => {
  var monkeyPatch = function (type) {
    var orig = history[type];
    return function () {
      var rv = orig.apply(this, arguments);
      var e = new Event(type);
      e.arguments = arguments;
      window.dispatchEvent(e);
      return rv;
    };
  };

  history.pushState = monkeyPatch("pushState");
  history.replaceState = monkeyPatch("replaceState");
})(window.history);

(() => {
  const reportBack = ({ arguments }) => {
    window.ReactNativeWebView.postMessage(arguments[2]);
  };

  window.addEventListener("pushState", reportBack);
  window.addEventListener("replaceState", reportBack);
})();
