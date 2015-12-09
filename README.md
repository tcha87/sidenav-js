# SideNav

A mobile friendly sidenav implementation.

## Use in your App

Using bower:

```sh
bower install https://gitlab.com/chialab/sidenav-widget.git
```

Using npm:

```sh
npm install https://gitlab.com/chialab/sidenav-widget.git
```

Or download [here](https://gitlab.com/chialab/sidenav-widget/repository/archive.zip?ref=master)

## Initialization

Use the `SideNav` constructor:

    var element = document.getElementById('#sidenav');
    var sidenav = new SideNav(element, { ... });

## Configuration

You can pass the following options to the constructor:
* *class*: the scope class for the element (default: `'sidenav'`);
* *position*: place the sidenav on the left or on the right of the page (default: `'left'`);
* *open*: the sidenav initial state (default: `true`);
* *swipe*: listen swipe gesture on touch devices (default: `true`)
* *swipeSensibility*: the range of valid pixels for swiping (default: `50`)

## Development

### Install dependencies

#### Quick-start

With Node.js installed, run the following one liner from the root of the project:

```sh
npm install -g grunt bower && npm install && bower install
```

#### Prerequisites

The project requires the following major dependencies:

- Node.js, used to run JavaScript tools from the command line.
- npm, the node package manager, installed with Node.js and used to install Node.js packages.
- grunt, a Node.js-based task runner.

**To install dependencies:**

1)  Check your Node.js version.

```sh
node --version
```

2)  If you don't have Node.js installed, or you have a lower version, go to [nodejs.org](https://nodejs.org) and click on the big green Install button.

3)  Install `grunt` globally.

```sh
npm install -g grunt
```

This lets you run `grunt` from the command line.

4)  Install `bower` globally.

```sh
npm install -g bower
```

This lets you run `bower` from the command line.

5)  Install the project's local `npm` and `bower` dependencies.

```sh
npm install && bower install
```

### Build

Simply use grunt for compiling and building the module:

```sh
grunt build
```
