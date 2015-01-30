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
        LogTankClient.prototype.log = function (message, tags) {
            if (this.xhrInitializer) {
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
        return LogTankClient;
    })();
    LT.LogTankClient = LogTankClient;
    LT.client = new LogTankClient();
    function initialize(customerKey, apiKey) {
        LT.client.initialize(customerKey, apiKey);
    }
    LT.initialize = initialize;
    function log(message, tags) {
        LT.client.log(message, tags);
    }
    LT.log = log;
})(LT || (LT = {}));
