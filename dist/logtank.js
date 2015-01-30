var LT;
(function (LT) {
    var LogTankClient = (function () {
        function LogTankClient(customerKey, apiKey) {
            this.customerKey = customerKey;
            this.apiKey = apiKey;
            this.xhr = null;
            this.usingXhr2 = false;
            this.initializeHttpRequest();
        }
        LogTankClient.prototype.initialize = function (customerKey, apiKey) {
            this.customerKey = customerKey;
            this.apiKey = apiKey;
        };
        LogTankClient.prototype.log = function (message, tags) {
            if (this.xhr) {
                var strMessage = JSON.stringify(message);
                this.xhr.open('POST', this.getUrl(tags));
                if (this.usingXhr2) {
                    this.sendJsonData(strMessage);
                }
                else {
                    this.sendFormData(strMessage);
                }
            }
        };
        LogTankClient.prototype.sendJsonData = function (message) {
            this.xhr.setRequestHeader('Content-Type', 'application/json');
            this.xhr.send(JSON.stringify(message));
        };
        LogTankClient.prototype.sendFormData = function (message) {
            this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            this.xhr.send('json=' + encodeURIComponent(message));
        };
        LogTankClient.prototype.initializeHttpRequest = function () {
            this.tryInitializeXHR();
            if (!this.xhr) {
                this.tryInitializeActiveXHR();
            }
            if (!this.xhr) {
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
                this.xhr = new XMLHttpRequest();
                if ("withCredentials" in this.xhr) {
                    this.usingXhr2 = true;
                }
                else {
                    this.xhr = null;
                    this.usingXhr2 = false;
                }
            }
            catch (ex) {
                this.xhr = null;
                this.usingXhr2 = false;
            }
        };
        LogTankClient.prototype.tryInitializeActiveXHR = function () {
            try {
                this.xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
                this.usingXhr2 = false;
            }
            catch (ex) {
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
