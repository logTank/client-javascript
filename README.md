# client-javascript / logtank-client
logTank client for JavaScript (Browser) to support ease of use

# Installation

- either download logtank.js from dist folder
- or via bower `bower install logtank-client --save`


# Usage

Simply include it via `<script src="logtank.min.js"></script>`
Initialize it with `LT.initialize('CUSTOMER_KEY', 'API_KEY')`

## Logging

    LT.log("simple string message", "tag.subtag");
    LT.log({ error: "error title", code: 123, exception: errObject }, "tag.errors.subsubtag");
    LT.log({ error: "error title", code: 123, exception: errObject });
    ...
    
### Parameters:

1. Parameter: Error message (simple string) or JSON object with properties. Any JSON object is valid. It will be serialized with `JSON.stringify`
2. Parameter: *tags*, which can be used by logTank to route the message to different sources. *Tags* can consit of lower-case characters and numbers and are seperated with dots (`.`).

## Logging exceptions

### To be able to log exceptions, you first need to catch them:

- [try/catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
- catch exceptions globaly with [window.onerror](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers.onerror)
- AngularJS has its own exception handling with [$exceptionHandler](https://docs.angularjs.org/api/ng/service/$exceptionHandler)
- Other client frameworks might use their own exception handling - in every case you just need to write `LT.log({...}, 'tag.subtag....')` whenever you manage to catch an exception.

### `defaultOnErrorExceptionHandler`

This gives you a default exception logger which you can assign to `window.onerror` like this:

    window.onerror = LT.defaultOnErrorExceptionHandler({ prop1: "global exception", prop2: 123 });
    window.onerror = LT.defaultOnErrorExceptionHandler({ prop1: "global exception", prop2: 123 }, 'tag.window.error');
    window.onerror = LT.defaultOnErrorExceptionHandler();

#### Parameters:

Both parameters are optional.

1. Parameter is the initial object, which can predefine some properties in order to recognize it later, that it's a globally caught exception for instance.
2. Parameter is the tag (see `LT.log` for details)

### `defaultAngularExceptionHandler`

Similar to `LT.defaultOnErrorExceptionHandler` just for angular's exception handling. Example usage based on [Angular's documentation](https://docs.angularjs.org/api/ng/service/$exceptionHandler):

    angular.module('exceptionOverride', []).factory('$exceptionHandler', function() {
        return LT.defaultAngularExceptionHandler({ type: "global angular exception" }, 'tag.angular.error');
    });

#### Parameters:

Same as in `LT.defaultOnErrorExceptionHandler`, both parameters are optional.

1. Parameter is the initial object, which can predefine some properties in order to recognize it later, that it's a globally caught exception for instance.
2. Parameter is the tag (see `LT.log` for details)

## Add dynamic parameters to all messages

Sometimes it is useful for all messages to have some additional parameters, in order to know where they came from, who the user is, ...
This can be done by setting a third parameter in `LT.initialize`. This is how we'd for instace add the user's browser's current location to every message, to find bugs easier:

    `LT.initialize('CUSTOMER_KEY', 'API_KEY', function (message) {
        message.location = {
            full: window.location.href,
            hash: window.location.hash,
            host: window.location.hostname,
            port: window.location.port
        };
        return message;
    );
    
# The `defaultClient`

`LT` exposes additionally to

- `initialize`
- `log`
- `defaultOnErrorExceptionHandler`
- `defaultAngularExceptionHandler`

also the `defaultClient` and `LogTankClient`. `defaultClient` is a single global instance of `LogTankClient`. If you need different clients with different configurations you can create them.

I believe, the best documentation is code, so [the typescript definition file for logtank-client](https://github.com/logTank/client-javascript/blob/master/dist/logtank.d.ts) is probably the best source to get all parameter and type informations. (Parameters with a `?` in the end are optional)

# Contribute

logtank-client itself is written in [TypeScript](http://www.typescriptlang.org/) which is a typed superset of JavaScript. This means, you can basically write JavaScript code and the TypeScript compiler won't have any problems with it, but you are encouraged to annotate it in order to check for type errors, ...

you can compile the TypeScript code to JavaScript and create the min-file simply by running `gulp`. This of course only after you've installed all dev-packages with `npm install` and you should have gulp installed globally (`npm install -g gulp`).
