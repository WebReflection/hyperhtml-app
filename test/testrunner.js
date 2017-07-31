var url = 'test/index.html';
console.log('Loading: ' + url);
var page = require('webpage').create();
page.open(url, function (status) {
  if (status === 'success') {
    setTimeout(function () {
      var results = page.evaluate(function() {
        return {passed: document.documentElement.className === 'ok'};
      });
      if (results.passed) console.log(' OK');
      phantom.exit(results.passed ? 0 : 1);
    }, 1500);
  } else {
    phantom.exit(1);
  }
});