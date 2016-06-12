# `dom`

[![Build status][travis-image]][travis-url]
[![Dependencies][deps-image]][deps-url]
[![devDependencies][dev-deps-image]][dev-deps-url]
[![NPM version][npm-image]][npm-url]

# How to install

With npm:

```txt
npm install --save heya-dom
```

With bower:

```txt
bower install --save heya-dom
```

# How to use

`heya-dom` can be installed with `npm` or `bower` with files available from `node_modules/` or `bower_components/`. By default, it uses AMD:

```js
define(['heya-dom/build'], function (build) {
  document.body.appendChild(build([
    'p', 'Hello, world!'
  ]));
});
```

But it can be loaded with `<script>` tag from `dist/`:

```html
<script src='node_modules/heya-dom/dist/build.js'></script>
```

And used with globals like in examples above:

```js
document.body.appendChild(heya.dom.build([
  'p', 'Hello, world!'
]));
```

# Documentation

All documentation can be found in [project's wiki](https://github.com/heya/dom/wiki).

# Versions

- 1.0.0 &mdash; *The initial public release as heya-dom.*

# License

BSD or AFL &mdash; your choice.


[npm-image]:      https://img.shields.io/npm/v/heya-dom.svg
[npm-url]:        https://npmjs.org/package/heya-dom
[deps-image]:     https://img.shields.io/david/heya/dom.svg
[deps-url]:       https://david-dm.org/heya/dom
[dev-deps-image]: https://img.shields.io/david/dev/heya/dom.svg
[dev-deps-url]:   https://david-dm.org/heya/dom#info=devDependencies
[travis-image]:   https://img.shields.io/travis/heya/dom.svg
[travis-url]:     https://travis-ci.org/heya/dom
