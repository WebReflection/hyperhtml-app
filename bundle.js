(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

  app.navigate = function navigate(pathname) {
    var doc = document;
    var html = doc.documentElement;
    var navigator = doc.createElement('a');
    navigator.href = pathname;
    navigator.onclick = remove;
    html.insertBefore(navigator, html.firstChild);
    navigator.click();
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
          var ctx = {params: createParams(match, info.keys)};
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
},{"onpushstate":3,"path-to-regexp":4}],2:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],3:[function(require,module,exports){
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
  // find the link node
  var target = e.target;
  var closest = target.closest || function (A) {
    while (target && target.nodeName !== A) target = target.parentNode;
    return target;
  };
  var anchor = closest.call(target, 'A');
  if (
    // it was found
    anchor &&
    // it's for the current page
    /^(?:_self)?$/i.test(anchor.target) &&
    // it's not a download
    !anchor.hasAttribute('download') &&
    // it's not a resource handled externally
    anchor.getAttribute('rel') !== 'external'
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

},{}],4:[function(require,module,exports){
var isarray = require('isarray')

/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp
module.exports.parse = parse
module.exports.compile = compile
module.exports.tokensToFunction = tokensToFunction
module.exports.tokensToRegExp = tokensToRegExp

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
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
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
  var defaultDelimiter = options && options.delimiter || '/'
  var res

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0]
    var escaped = res[1]
    var offset = res.index
    path += str.slice(index, offset)
    index = offset + m.length

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1]
      continue
    }

    var next = str[index]
    var prefix = res[2]
    var name = res[3]
    var capture = res[4]
    var group = res[5]
    var modifier = res[6]
    var asterisk = res[7]

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path)
      path = ''
    }

    var partial = prefix != null && next != null && next !== prefix
    var repeat = modifier === '+' || modifier === '*'
    var optional = modifier === '?' || modifier === '*'
    var delimiter = res[2] || defaultDelimiter
    var pattern = capture || group

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    })
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index)
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path)
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
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
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

  return function (obj, opts) {
    var path = ''
    var data = obj || {}
    var options = opts || {}
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i]

      if (typeof token === 'string') {
        path += token

        continue
      }

      var value = data[token.name]
      var segment

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j])

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value)

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment
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
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
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
        partial: false,
        asterisk: false,
        pattern: null
      })
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = []

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source)
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options)
    keys = []
  }

  options = options || {}

  var strict = options.strict
  var end = options.end !== false
  var route = ''

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]

    if (typeof token === 'string') {
      route += escapeString(token)
    } else {
      var prefix = escapeString(token.prefix)
      var capture = '(?:' + token.pattern + ')'

      keys.push(token)

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*'
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?'
        } else {
          capture = prefix + '(' + capture + ')?'
        }
      } else {
        capture = prefix + '(' + capture + ')'
      }

      route += capture
    }
  }

  var delimiter = escapeString(options.delimiter || '/')
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?'
  }

  if (end) {
    route += '$'
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)'
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options)
    keys = []
  }

  options = options || {}

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

},{"isarray":2}]},{},[1]);
