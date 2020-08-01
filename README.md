# Fastify Custom Healthcheck

[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/standard/semistandard)

`fastify-custom-healthcheck` is a plugin for creating a health route with custom evaluations.

Supports Fastify versions `3.x`.

## Install

```bash
npm i fastify-custom-healthcheck
```

## Usage

Require the module and just register it as any other fastify plugin. From `fastify-custom-healthcheck` on decorator is going to be added to your server for adding custom health checks.

```javascript
const fastify = require('fastify')();
const customHealthCheck = require('fastify-custom-healthCheck');

fastify.register(customHealthCheck, options).then(() => {
    fastify.addHealthCheck('metric', () => {
        return new Promise((resolve) => setTimeout(resolve, 5000));
    });
});

fastify.lister(3000);
```

## API

### register plugin

```javascript
fastify.register(customHealthCheck, {
    path: '/health/check', // default health
    info: {}, // custom information object
});
```

### Decorator

After registering plugin you can use the decorator for adding custom health checks.

```javascript
fastify.addCustomHealthCheck(label, () => {});
```

### register options

-   `path`: path where you can reach health check route.
    -   default value: `'/health'`.
-   `info`: object where you can define custom information you would like to include in healthcheck response object.

### decorator options

## Acknowledgements

This module is inspired by [server-health](https://www.npmjs.com/package/server-health) and the need of having this functionality in fastify.