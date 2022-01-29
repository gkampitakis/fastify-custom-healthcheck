# Fastify Custom Healthcheck

[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg)](https://github.com/standard/semistandard)
[![Build Status](https://travis-ci.com/gkampitakis/fastify-custom-healthcheck.svg?branch=master)](https://travis-ci.com/gkampitakis/fastify-custom-healthcheck)

`fastify-custom-healthcheck` is a plugin for creating a health route with custom evaluations.


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

fastify.listen(3000);
```

## API

### register plugin

```javascript
fastify.register(customHealthCheck, {
    path: '/health/check', // default health
    info: {}, // custom information object
});
```

### register options

-   `path`: path where you can reach health check route.
    -   default value: `'/health'`.
-   `info`: object where you can define custom information you would like to include in healthcheck response object.
-   exposeFailure: Flag that enables additional information to be presented in health check object when a check fails.
    -   default value: `false`

### Decorator

After registering plugin you can use the decorator for adding custom health checks.

```javascript
fastify.addHealthCheck(label, () => {}, { value: true });
```

### decorator options

-   value: If you add on `addHealthCheck` a value, when computing health check an equality check happens between evaluation and the value returned by the health check function. If the values are different health check fails.

## Example response 

```json
{
  "healthChecks": {
    "mongo": {
      "status": "FAIL",
      "reason": "MongoNetworkError: failed to connect to server [localhost:27017] on first connect [Error: connect ECONNREFUSED 127.0.0.1:27017\n    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1144:16) {\n  name: 'MongoNetworkError'\n}]"
    },
    "kafka": "HEALTHY",
    "redis": "HEALTHY" 
  },
  "stats": {
    "creationTime": "2020-08-04T19:16:29.766Z",
    "uptime": 0.303361107,
    "memory": {
      "rss": 50102272,
      "heapTotal": 29270016,
      "heapUsed": 16499104,
      "external": 20754444,
      "arrayBuffers": 19273278
    }
  },
  "info": {
    "example": "Response",
  }
}
```

## Acknowledgements

This module is inspired by [server-health](https://www.npmjs.com/package/server-health) and the need of having this functionality in fastify.

### Example

You can also check an [example](./example) usage.

### Issues

For any [issues](https://github.com/gkampitakis/fastify-custom-healthcheck/issues).

## License 

MIT License
