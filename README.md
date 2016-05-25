# SideNav
> A mobile friendly sidenav implementation.

## Install

[![NPM](https://img.shields.io/npm/v/chialab-sidenav.svg)](https://www.npmjs.com/package/chialab-sidenav)
```
$ npm i chialab-sidenav --save
```
[![Bower](https://img.shields.io/bower/v/chialab-sidenav.svg)](https://github.com/chialab/sidenav-js)
```
$ bower i chialab-sidenav --save
```

## Example

```js
var element = document.getElementById('#sidenav');
var sidenav = new SideNav(element);
sidenav.options = { ... };
```

## Configuration

You can pass the following options to the constructor:
* *class*: the scope class for the element (default: `'sidenav'`);
* *position*: place the sidenav on the left or on the right of the page (default: `'left'`);
* *open*: the sidenav initial state (default: `true`);
* *swipe*: listen swipe gesture on touch devices (default: `true`)
* *swipeSensibility*: the range of valid pixels for swiping (default: `50`)

## Dev

[![Chialab es6-workflow](https://img.shields.io/badge/project-es6--workflow-lightgrey.svg)](https://github.com/Chialab/es6-workflow)
