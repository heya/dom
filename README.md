# `dom`

[![Build status][travis-image]][travis-url]
[![Dependencies][deps-image]][deps-url]
[![devDependencies][dev-deps-image]][dev-deps-url]
[![NPM version][npm-image]][npm-url]

`heya-dom` is used on browser to simplify DOM-related tasks, especially construction, and modification of DOM.

Following modules are provided:

* [create](https://github.com/heya/dom/wiki/create) &mdash; largely based on venerable [Dojo](http://dojotoolkit.org). Includes creating DOM nodes with optional namespaces, setting attributes, properties, styles, and similar helpers.
* [build](https://github.com/heya/dom/wiki/build) &mdash; a Virtual DOM-inspired utility to create DOM fragments in one go using a simple array-based structure.
* [hyperscript](https://github.com/heya/dom/wiki/hyperscript) &mdash; an alternative for `build`, a minimalistic implementation of [Dominic Tarr](https://github.com/dominictarr)'s [hyperscript](https://github.com/dominictarr/hyperscript). It is there mostly to reuse existing tooling, and existing code created for other implementations.
* [fromHtml](https://github.com/heya/dom/wiki/fromHtml) &mdash; a helper to instantiate HTML snippets as `DocumentFragment`.

# Examples

We want to create the following simple list:

```html
<ul data-sort="asc">
  <li>one</li>
  <li class="x">two</li>
  <li>three</li>
</ul>
```

Let's do it with `create()` (low-level):

```js
var root = create('ul', {'data-sort': 'asc'});
create('li',   {$: {innerHTML: 'one'}},   root);
create('li.x', {$: {innerHTML: 'two'}},   root);
create('li',   {$: {innerHTML: 'three'}}, root);
```

Let's do it with `build()`:

```js
var root = build(['ul', {'data-sort': 'asc'},
  ['li', 'one'], ['li.x', 'two'], ['li', 'three']]);
```

Let's do it with `hyperscript()`:

```js
var h = hyperscript;

var root = h('ul', {dataset: {sort: 'asc'}},
  h('li', 'one'), h('li.x', 'two'), h('li', 'three'));
```

Let's do it with `fromHtml()`:

```js
var root = fromHtml(
  '<ul data-sort="asc">' +
    '<li>one</li>' +
    '<li class="x">two</li>' +
    '<li>three</li>' +
  '</ul>'
);
```

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

See [How to include](https://github.com/heya/dom/wiki/How-to-include) for more details.

# Documentation

All documentation can be found in [project's wiki](https://github.com/heya/dom/wiki).

# Versions

- 1.0.3 &mdash; *Refreshed dependencies.*
- 1.0.2 &mdash; *Consistently added options and dollar escapes.*
- 1.0.1 &mdash; *Cosmetic change: removed the missing main module.*
- 1.0.0 &mdash; *The initial public release as heya-dom.*

# License

BSD or AFL &mdash; your choice.


[npm-image]:      https://img.shields.io/npm/v/heya-dom.svg
[npm-url]:        https://npmjs.org/package/heya-dom
[deps-image]:     https://img.shields.io/david/heya/dom.svg
[deps-url]:       https://david-dm.org/heya/dom
[dev-deps-image]: https://img.shields.io/david/dev/heya/dom.svg
[dev-deps-url]:   https://david-dm.org/heya/dom?type=dev
[travis-image]:   https://img.shields.io/travis/heya/dom.svg
[travis-url]:     https://travis-ci.org/heya/dom
