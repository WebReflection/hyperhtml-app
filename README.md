# hyperhtml-app
Express like routing for _pop_ and _push_ states.

[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC) [![Build Status](https://travis-ci.org/WebReflection/hyperhtml-app.svg?branch=master)](https://travis-ci.org/WebReflection/hyperhtml-app) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/WebReflection/donate)

Designed for [hyperHTML](https://github.com/WebReflection/hyperHTML), it works as **standalone** module too.

### V1 Breaking Changes

Path-To-RegExp [breaks compatibility with Express <= 4.x](https://github.com/pillarjs/path-to-regexp#compatibility-with-express--4x).

  * RegExp special characters can only be used in a parameter
    * Express.js 4.x used all RegExp special characters regardless of position - this considered a bug
  * Parameters have suffixes that augment meaning - *, + and ?. E.g. /:user*
  * No wildcard asterisk (*) - use parameters instead ((.*))


### Minimalistic API

This project uses [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) module,
the official Express JS path parser, and it combines it with an Express like API,
mixing in the ease of [page.js](https://visionmedia.github.io/page.js/) callbacks.

Based on the tiny, server side compatible, [onpushstate](https://github.com/WebReflection/onpushstate) module,
this module has been created to be an ideal companion for the [viperHTML tech fam](https://viperhtml.js.org/).

## API

  * **app.get('/path/:user', callback)** to react on paths and trap `ctx.params` such `user` or others.
  * **app.use(path, callback)** to add a generic middleware (similar to `app.get` but it accepts an array of paths)
  * **app.delete(path, callback)** to remove a specific callback
  * **app.param(name, callback)** to react once upfront whenever a specific parameter is passed along.
  * **app.navigate(pathname[, options])** to push state and navigate to a different URL via standard History API. If the pathname and the search string are the same, it'll trigger a `samestate` type event (as opposite of `popstate` and `pushstate`). If there is a second _options_ parameter and it has a `replace` or `replaceState` truthy property, it will not trigger a navigation event but it will replace the latest history with the current URL (shortcut for `history.replaceState(...)`).

### Callbacks

Every callback will be invoked with a generic `context` object, a `next` function to invoke once everything is OK,
and in case of `app.param(name, fn)` the value, as third argument, for the specified parameter.

```js
const hyperApp = require('hyperhtml-app');

const app = hyperApp();

app.get('/', function (ctx) {
  console.log('Welcome');
});

app.use('/:user', function (ctx, next) {
  console.log(ctx.params);
});

app.param('user', function (ctx, next, name) {
  console.log(name); // hyper
});

app.navigate('/hyper');
```

### Usage

`hyperhtml-app` lets you handle routing as you prefer, but the following is an example of how you might get started.

```js
const hyperHTML = require('hyperhtml')
const HyperHTMLApp = require('hyperhtml-app')

/**
 * Utility
 */
function getCurrentRoute() {
  return window.location.pathname.replace('index.html', '');
}

/**
 * Router configuration
 */
const routerOutletEl = document.createElement('div');
const router = new HyperHTMLApp();
const renderRoute = hyperHTML.bind(routerOutletEl);

router.get('/user/:name', ctx => {
  const userName = ctx.params.name
  
  renderRoute`
    <h1>Hello ${userName}</h1>
    <button onclick=${() => router.navigate('/')}>
      Go back
    </button>
  `
  render()
});
router.get('/', () => {
  renderRoute`
    <h1>Hello world</h1>
    <button onclick=${() => router.navigate('/user/Julia')}>
      See Julia
    </button>
    <button onclick=${() => router.navigate('/user/Andrea')}>
      See Andrea
    </button>
  `
  render()
});

/**
 * Declarative render of the application and the active route
 */
const html = hyperHTML.bind(document.getElementById('root'))
function render() {
  return html`
    <div>
      ${routerOutletEl}
    </div>
  `;
}

// Trigger route handler for the initial route
router.navigate(getCurrentRoute());
```

[Try it live](https://stackblitz.com/edit/hyperhtml-app)

### Compatibility

You can test this library [live](https://webreflection.github.io/hyperhtml-app/test/).

The only relatively modern features your target browser should support are both [URL](http://caniuse.com/#feat=url) and [History API](http://caniuse.com/#feat=history).

You can use [polyfill.io](https://cdn.polyfill.io/v2/polyfill.js?features=default) link in case you need these polyfills.

