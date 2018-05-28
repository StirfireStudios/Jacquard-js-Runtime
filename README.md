# Jacquard - JS Runtime

This is the Javascript Runtime for executing the Jacquard bytecode format
 
## Usage

Install `jacquard-runtime` via your favourite javascript package tool.

API Docs are [here](https://stirfirestudios.github.io/Jacquard-js-Runtime/)

## Building/Developing

### How it works

See [here](https://github.com/StirfireStudios/Jacquard-YarnCompiler/blob/master/README.md) for a description of the bytecode format.

This Library allows you to import a Jacquard Logic and Dialogue file and run those files. Included is a tester for running them in browser.

### Dependencies

Jacquard - Yarn Parser requires the following dependencies be pre-installed:

* NodeJS (https://nodejs.org).
* Yarn package manager (https://yarnpkg.com).

First, you need to make sure that you have nodeJs and Yarn installed (see the dependencies section above and install the relevant version for your platform).

Currently we're using `node v8.9.4` and `yarn v1.5.1`.

### Spin up instructions

Using your command line, navigate to the directory you've cloned this repo into.

  1. Execute a `yarn install`. This will download all the necessary libraries you need.
  2. Checkout the [README.md](react-example/README.md) in the react-example directory for spin up on the example.
If you wish to rebuild the documentation, you'll need to have [documentation.js](http://documentation.js.org/) installed, which you can do via `npm install -g documentation` - then you can run `yarn serveDoc` to serve the docs locally or `yarn buildDoc` to build the docs directory
