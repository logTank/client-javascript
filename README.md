# client-javascript
logTank client for JavaScript (Browser) to support ease of use

# Installation

- either download logtank.js from dist folder
- or via bower `bower install logtank-client --save`


# Usage

Simply include it via `<script src="logtank.min.js"></script>`
Initialize it with `LT.initialize('CUSTOMER_KEY', 'API_KEY')`

## Logging

    LT.log({ message: "simple string message" }, "tag.subtag");
    LT.log({ error: "error title", code: 123, exception: errObject }, "tag.errors.subsubtag");
    ...

## Logging exceptions

To be able to log exceptions, you first need to catch them:

- [try/catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
- catch exceptions globaly with [window.onerror](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers.onerror)
- AngularJS has its own exception handling with [$exceptionHandler](https://docs.angularjs.org/api/ng/service/$exceptionHandler)
- Other client frameworks might use their own exception handling - in every case you just need to write `LT.log({...}, 'tag.subtag....')` whenever you manage to catch an exception.