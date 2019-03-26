(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"onpushstate":2,"path-to-regexp":3}],2:[function(require,module,exports){
/*! (C) 2017 Andrea Giammarchi - @WebReflection - ISC License */
/**
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
 * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */
document.addEventListener('click', function (e) {
  // find the link node (even if inside an opened Shadow DOM)
  var target = e.target.shadowRoot ? e.path[0] : e.target;
  // find the anchor
  var anchor = (target.closest || function (A) {
    while (target && target.nodeName !== A) target = target.parentNode;
    return target;
  }).call(target, 'A');
  if (
    // it was found
    anchor &&
    // it's for the current page
    /^(?:_self)?$/i.test(anchor.target) &&
    // it's not a download
    !anchor.hasAttribute('download') &&
    // it's not a resource handled externally
    anchor.getAttribute('rel') !== 'external' &&
    // it's not a click with ctrl/shift/alt keys pressed
    // => (let the browser do it's job instead)
    !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey
  ) {
    // all states are simply fully resolved URLs
    // pushstate will be the new page with old one as state
    // popstate will be old page with previous one as state.
    var next = new URL(anchor.href);
    var curr = location;
    // only if in the same origin
    if (next.origin === curr.origin) {
      // verify it's not just an anchor change
      var redirect = next.pathname + next.search;
      var hash = next.hash;
      var scrollIntoView = true;
      // in every case prevent the default action
      e.preventDefault();
      // but don't stop propagation, other listeners
      // might want to be triggered regardless the history
      if (redirect === (curr.pathname + curr.search)) {
        // anchors should do what anchors do, only if valid
        // https://www.w3.org/TR/html4/types.html#type-name
        if (/^#[a-z][a-z0-9.:_-]+$/i.test(hash)) {
          var target = document.querySelector(
            hash + ',[name="' + hash.slice(1) + '"]'
          );
          if (target) {
            // verify if other listeners tried to prevent the default
            e.preventDefault = function () { scrollIntoView = false; };
            // after this event has captured and bubbled the DOM
            setTimeout(function () {
              // if nobody else prevented the default
              // simulate what an anchor would've done
              if (scrollIntoView) target.scrollIntoView(true);
            });
          }
        }
        // replace the history to ignore the popstate on anchor
        history.replaceState(history.state, document.title, redirect + hash);
      } else {
        // trigger a new pushstate notification
        var evt = new CustomEvent('pushstate');
        evt.state = curr.href;
        // being sure it happens after so the new location should be available
        setTimeout(function () {
          // dispatch the event
          dispatchEvent(evt);
          // also trigger Level 0 if possible
          if (window.onpushstate) onpushstate(evt);
        });
        history.pushState(evt.state, document.title, redirect + hash);
      }
    }
  }
}, true);

},{}],3:[function(require,module,exports){
/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp
module.exports.parse = parse
module.exports.compile = compile
module.exports.tokensToFunction = tokensToFunction
module.exports.tokensToRegExp = tokensToRegExp

/**
 * Default configs.
 */
var DEFAULT_DELIMITER = '/'

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // ":test(\\d+)?" => ["test", "\d+", undefined, "?"]
  // "(\\d+)"  => [undefined, undefined, "\d+", undefined]
  '(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = []
  var key = 0
  var index = 0
  var path = ''
  var defaultDelimiter = (options && options.delimiter) || DEFAULT_DELIMITER
  var whitelist = (options && options.whitelist) || undefined
  var pathEscaped = false
  var res

  while ((res = PATH_REGEXP.exec(str)) !== null) {
    var m = res[0]
    var escaped = res[1]
    var offset = res.index
    path += str.slice(index, offset)
    index = offset + m.length

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1]
      pathEscaped = true
      continue
    }

    var prev = ''
    var name = res[2]
    var capture = res[3]
    var group = res[4]
    var modifier = res[5]

    if (!pathEscaped && path.length) {
      var k = path.length - 1
      var c = path[k]
      var matches = whitelist ? whitelist.indexOf(c) > -1 : true

      if (matches) {
        prev = c
        path = path.slice(0, k)
      }
    }

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path)
      path = ''
      pathEscaped = false
    }

    var repeat = modifier === '+' || modifier === '*'
    var optional = modifier === '?' || modifier === '*'
    var pattern = capture || group
    var delimiter = prev || defaultDelimiter

    tokens.push({
      name: name || key++,
      prefix: prev,
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      pattern: pattern
        ? escapeGroup(pattern)
        : '[^' + escapeString(delimiter === defaultDelimiter ? delimiter : (delimiter + defaultDelimiter)) + ']+?'
    })
  }

  // Push any remaining characters.
  if (path || index < str.length) {
    tokens.push(path + str.substr(index))
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length)

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$')
    }
  }

  return function (data, options) {
    var path = ''
    var encode = (options && options.encode) || encodeURIComponent

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i]

      if (typeof token === 'string') {
        path += token
        continue
      }

      var value = data ? data[token.name] : undefined
      var segment

      if (Array.isArray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but got array')
        }

        if (value.length === 0) {
          if (token.optional) continue

          throw new TypeError('Expected "' + token.name + '" to not be empty')
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j], token)

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '"')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment
        }

        continue
      }

      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        segment = encode(String(value), token)

        if (!matches[i].test(segment)) {
          throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but got "' + segment + '"')
        }

        path += token.prefix + segment
        continue
      }

      if (token.optional) continue

      throw new TypeError('Expected "' + token.name + '" to be ' + (token.repeat ? 'an array' : 'a string'))
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$/()])/g, '\\$1')
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options && options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {Array=}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  if (!keys) return path

  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g)

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        pattern: null
      })
    }
  }

  return path
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = []

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source)
  }

  return new RegExp('(?:' + parts.join('|') + ')', flags(options))
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}  tokens
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  options = options || {}

  var strict = options.strict
  var start = options.start !== false
  var end = options.end !== false
  var delimiter = options.delimiter || DEFAULT_DELIMITER
  var endsWith = [].concat(options.endsWith || []).map(escapeString).concat('$').join('|')
  var route = start ? '^' : ''

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]

    if (typeof token === 'string') {
      route += escapeString(token)
    } else {
      var capture = token.repeat
        ? '(?:' + token.pattern + ')(?:' + escapeString(token.delimiter) + '(?:' + token.pattern + '))*'
        : token.pattern

      if (keys) keys.push(token)

      if (token.optional) {
        if (!token.prefix) {
          route += '(' + capture + ')?'
        } else {
          route += '(?:' + escapeString(token.prefix) + '(' + capture + '))?'
        }
      } else {
        route += escapeString(token.prefix) + '(' + capture + ')'
      }
    }
  }

  if (end) {
    if (!strict) route += '(?:' + escapeString(delimiter) + ')?'

    route += endsWith === '$' ? '$' : '(?=' + endsWith + ')'
  } else {
    var endToken = tokens[tokens.length - 1]
    var isEndDelimited = typeof endToken === 'string'
      ? endToken[endToken.length - 1] === delimiter
      : endToken === undefined

    if (!strict) route += '(?:' + escapeString(delimiter) + '(?=' + endsWith + '))?'
    if (!isEndDelimited) route += '(?=' + escapeString(delimiter) + '|' + endsWith + ')'
  }

  return new RegExp(route, flags(options))
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {Array=}                keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (path instanceof RegExp) {
    return regexpToRegexp(path, keys)
  }

  if (Array.isArray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), keys, options)
  }

  return stringToRegexp(/** @type {string} */ (path), keys, options)
}

},{}]},{},[1]);
