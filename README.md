# server

[![Build Status](https://travis-ci.org/feathersjs/server.png?branch=master)](https://travis-ci.org/feathersjs/server)
[![Code Climate](https://codeclimate.com/github/feathersjs/server/badges/gpa.svg)](https://codeclimate.com/github/feathersjs/server)
[![Test Coverage](https://codeclimate.com/github/feathersjs/server/badges/coverage.svg)](https://codeclimate.com/github/feathersjs/server/coverage)
[![Dependency Status](https://img.shields.io/david/feathersjs/server.svg?style=flat-square)](https://david-dm.org/feathersjs/server)
[![Download Status](https://img.shields.io/npm/dm/server.svg?style=flat-square)](https://www.npmjs.com/package/server)

> 

## Installation

```
npm install server --save
```

## Documentation

TBD

## Complete Example

Here's an example of a Feathers server that uses `server`.

```js
const feathers = require('@feathersjs/feathers');
const plugin = require('example/server');

// Initialize the application
const app = feathers();

// Initialize the plugin
app.configure(plugin());
```

## License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE).
