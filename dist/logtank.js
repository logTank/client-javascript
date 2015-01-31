var LT;
(function (LT) {
    var LogTankClient = (function () {
        function LogTankClient(customerKey, apiKey) {
            this.customerKey = customerKey;
            this.apiKey = apiKey;
            this.xhrInitializer = null;
            this.usingXhr2 = false;
            this.initializeHttpRequest();
        }
        LogTankClient.prototype.initialize = function (customerKey, apiKey) {
            this.customerKey = customerKey;
            this.apiKey = apiKey;
        };
        LogTankClient.prototype.defaultOnErrorExceptionHandler = function (baseObject, tags) {
            var _this = this;
            baseObject = baseObject || {};
            return function (errorMsg, url, line, col, exception) {
                var message = LogTankClient.clone(baseObject);
                message.errorMsg = errorMsg;
                message.url = url;
                message.lineNumber = line;
                message.colNumber = col;
                message.error = LogTankClient.convertErrorToSimpleObject(exception);
                _this.log(message, tags);
            };
        };
        LogTankClient.prototype.defaultAngularExceptionHandler = function (baseObject, tags) {
            var _this = this;
            baseObject = baseObject || {};
            return function (exception, cause) {
                var message = LogTankClient.clone(baseObject);
                message.error = LogTankClient.convertErrorToSimpleObject(exception);
                message.cause = cause;
                _this.log(message, tags);
            };
        };
        LogTankClient.prototype.log = function (message, tags) {
            if (this.xhrInitializer) {
                if (this.extendMessageBeforeSending) {
                    var newMessage = this.extendMessageBeforeSending(message);
                    message = newMessage || message;
                }
                var strMessage = this.prepareMessage(message);
                var xhr = this.xhrInitializer();
                xhr.open('POST', this.getUrl(tags));
                if (this.usingXhr2) {
                    this.sendJsonData(xhr, strMessage);
                }
                else {
                    this.sendFormData(xhr, strMessage);
                }
            }
        };
        LogTankClient.prototype.prepareMessage = function (message) {
            if (typeof message == 'string') {
                message = { message: message };
            }
            return JSON.stringify(message);
        };
        LogTankClient.prototype.sendJsonData = function (xhr, message) {
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(message);
        };
        LogTankClient.prototype.sendFormData = function (xhr, message) {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send('json=' + encodeURIComponent(message));
        };
        LogTankClient.prototype.initializeHttpRequest = function () {
            this.tryInitializeXHR();
            if (!this.xhrInitializer) {
                this.tryInitializeActiveXHR();
            }
            if (!this.xhrInitializer) {
                console.log("Couldn't initialize XHR, browser not supported.");
            }
        };
        LogTankClient.prototype.getUrl = function (tags) {
            var ret = 'http://store.logtank.com/' + this.customerKey + '/' + this.apiKey;
            if (tags) {
                ret = ret + '/' + tags.replace('.', '/');
            }
            return ret;
        };
        LogTankClient.prototype.tryInitializeXHR = function () {
            try {
                var xhr = new XMLHttpRequest();
                if ("withCredentials" in xhr) {
                    this.usingXhr2 = true;
                    this.xhrInitializer = function () { return new XMLHttpRequest(); };
                }
            }
            catch (ex) {
                this.xhrInitializer = null;
                this.usingXhr2 = false;
            }
        };
        LogTankClient.prototype.tryInitializeActiveXHR = function () {
            try {
                var xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
                this.usingXhr2 = false;
                this.xhrInitializer = function () { return new window.ActiveXObject("Microsoft.XMLHTTP"); };
            }
            catch (ex) {
                this.xhrInitializer = null;
            }
        };
        LogTankClient.clone = function (source) {
            var target = {};
            for (var p in source) {
                if (source.hasOwnProperty(p)) {
                    target[p] = source[p];
                }
            }
            return target;
        };
        LogTankClient.convertErrorToSimpleObject = function (error) {
            if (error) {
                return {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                };
            }
            else {
                return {};
            }
        };
        return LogTankClient;
    })();
    LT.LogTankClient = LogTankClient;
    LT.defaultClient = new LogTankClient();
    function initialize(customerKey, apiKey, extendMessageBeforeSending) {
        LT.defaultClient.initialize(customerKey, apiKey);
        if (extendMessageBeforeSending) {
            LT.defaultClient.extendMessageBeforeSending = extendMessageBeforeSending;
        }
    }
    LT.initialize = initialize;
    function log(message, tags) {
        LT.defaultClient.log(message, tags);
    }
    LT.log = log;
    function defaultOnErrorExceptionHandler(baseObject, tags) {
        return LT.defaultClient.defaultOnErrorExceptionHandler(baseObject, tags);
    }
    LT.defaultOnErrorExceptionHandler = defaultOnErrorExceptionHandler;
    function defaultAngularExceptionHandler(baseObject, tags) {
        return LT.defaultClient.defaultAngularExceptionHandler(baseObject, tags);
    }
    LT.defaultAngularExceptionHandler = defaultAngularExceptionHandler;
})(LT || (LT = {}));
