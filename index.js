var hyperHTMLApp = (function () {'use strict';

  var onpushstate = require('onpushstate');
  var path2regexp = require('path-to-regexp');
  var app = HyperHTMLApplication.prototype;

  app.get = function get(path) {
    for (var
      keys = [],
      re = asPath2RegExp(path, keys),
      info = this._paths[re] || (this._paths[re] = {
        keys: keys,
        cb: [],
        re: re
      }),
      i = 1, length = arguments.length;
      i < length; i++
    ) {
      info.cb.push(arguments[i]);
    }
    return this;
  };

  app.delete = function del(path) {
    for (var
      re = asPath2RegExp(path, []),
      info = this._paths[re],
      i = 1, length = arguments.length;
      i < length; i++
    ) {
      var cb = arguments[i];
      var index = info ? info.cb.lastIndexOf(cb) : -1;
      if (-1 < index) info.cb.splice(index, 1);
    }
    return this;
  };

  app.use = function use(mount, cb) {
    if (typeof mount === 'function') {
      cb = mount;
      mount = '(.*)';
    }
    for (var
      paths = [].concat(mount),
      i = 0, length = paths.length;
      i < length; i++
    ) {
      this.get(paths[i], cb);
    }
    return this;
  };

  app.param = function param(name, cb) {
    for (var
      names = [].concat(name),
      i = 0, length = names.length;
      i < length; i++
    ) {
      this._params[names[i]] = cb;
    }
    return this;
  };

  app.navigate = function navigate(pathname, options) {
    switch (true) {
      case !!options:
        switch (true) {
          case !!options.replace:
          case !!options.replaceState:
            history.replaceState(history.state, document.title, pathname);
            break;
        }
        break;
      case pathname === (location.pathname + location.search):
        this.handleEvent({type: 'samestate'});
        break;
      default:
        var doc = document;
        var html = doc.documentElement;
        var navigator = doc.createElement('a');
        navigator.href = pathname;
        navigator.onclick = remove;
        html.insertBefore(navigator, html.firstChild);
        navigator.click();
        break;
    }
    return this;
  };

  app.handleEvent = function handleEvent(e) {
    var paths = this._paths;
    for (var key in paths) {
      if (paths.hasOwnProperty(key)) {
        var info = paths[key];
        var match = info.re.exec(location.pathname);
        if (match) {
          var invoked = [];
          var keys = [];
          var params = this._params;
          var ctx = {
            params: createParams(match, info.keys),
            type: e.type
          };
          var i = 0;
          var length = info.cb.length;
          for (key in ctx.params) {
            if (params.hasOwnProperty(key)) {
              keys.push(key);
            }
          }
          (function param() {
            if (keys.length) {
              key = keys.shift();
              params[key](ctx, param, ctx.params[key]);
            } else {
              (function next() {
                if (i < length) {
                  var cb = info.cb[i++];
                  if (invoked.lastIndexOf(cb) < 0) {
                    invoked.push(cb);
                    cb(ctx, next);
                  } else {
                    next();
                  }
                }
              }());
            }
          }());
          return;
        }
      }
    }
  };

  function asPath2RegExp(path, keys) {
    if (typeof path !== 'string') {
      path = path.toString();
      path = path.slice(1, path.lastIndexOf('/'));
    }
    return path2regexp(path, keys);
  }

  function createParams(match, keys) {
    for (var
      value,
      params = {},
      i = 1,
      length = match.length;
      i < length; i++
    ) {
      value = match[i];
      if (value) params[keys[i - 1].name] = value;
    }
    return params;
  }

  function remove() {
    this.parentNode.removeChild(this);
  }

  function HyperHTMLApplication() {
    this._params = {};
    this._paths = {};
    global.addEventListener('popstate', this, false);
    global.addEventListener('pushstate', this, false);
  }

  return function hyperHTMLApp() {
    return new HyperHTMLApplication();
  };

}());

module.exports = (global.hyperHTML || {}).app = hyperHTMLApp;