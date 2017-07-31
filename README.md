# hyperhtml-app
Express like routing for hyperHTML

[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC) [![Build Status](https://travis-ci.org/WebReflection/hyperhtml-app.svg?branch=master)](https://travis-ci.org/WebReflection/hyperhtml-app) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/WebReflection/donate)

#### Minimalistic API

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
  * **app.navigate(pathname)** to push state and navigate to a different URL via standard History API.

#### Callbacks

Every callback will be invoked with a generic `context` object, a `next` function to invoke once everything is OK,
and in case of `app.param(name, fn)` the value, as third argument, for the specified parameter.

```js
app.use('/', function (ctx) {
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

#### Compatibility

You can test this library [live](https://webreflection.github.io/hyperhtml-app/test/).

The only relatively modern features your target browser should support are both [URL](http://caniuse.com/#feat=url) and [History API](http://caniuse.com/#feat=history).

You can use [polyfill.io](https://cdn.polyfill.io/v2/polyfill.js?features=default) link in case you need these polyfills.

