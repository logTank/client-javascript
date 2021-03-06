module LT {
    export var storeServerUrl = 'https://store.logtank.com/';

    interface IError {
        message: string;
        stack: string;
        name: string;
    }

    export class LogTankClient {
        public extendMessageBeforeSending: (message: any) => any;

        private xhrInitializer: () => XMLHttpRequest = null;
        private usingXhr2 = false;
        private logQueue: {
            dataPerTag: { [tag: string]: any[] };
            tags: string[];
        } = null;

        constructor(public customerKey?: string,
                    public apiKey?: string,
                    public defaultTags?: string,
                    public queueTimeoutLength: number = 2000) {
            this.initializeHttpRequest();
        }

        public initialize(customerKey: string, apiKey: string, defaultTags?: string) {
            this.customerKey = customerKey;
            this.apiKey = apiKey;
            this.defaultTags = defaultTags;
        }

        public defaultOnErrorExceptionHandler(baseObject?: any, tags?: string) {
            baseObject = baseObject || {};

            return (errorMsg: string, url: string, line: number, col: number, exception: Error) => {
                var message = LogTankClient.clone(baseObject);
                message.errorMsg = errorMsg;
                message.url = url;
                message.lineNumber = line;
                message.colNumber = col;
                message.error = LogTankClient.convertErrorToSimpleObject(<any>exception);

                this.log(message, tags, true);
            }
        }

        public defaultAngularExceptionHandler(baseObject?: any, tags?: string) {
            baseObject = baseObject || {};

            return (exception: Error, cause?: string) => {
                var message = LogTankClient.clone(baseObject);
                message.error = LogTankClient.convertErrorToSimpleObject(<any>exception);
                message.cause = cause;

                this.log(message, tags, true)
            };
        }

        public log(message: any, tags?: string, instantly?: boolean) {
            message = this.securelyExtendMessage(message);

            if (instantly || !this.queueTimeoutLength || this.queueTimeoutLength <= 0) {
                this.logNow(message, tags);
            } else {
                this.logLater(message, tags)
            }
        }

        private logLater(message: any, tags?: string) {
            tags = tags || '';

            if (!this.logQueue) {
                this.logQueue = { dataPerTag: {}, tags: [] }
                setTimeout(() => this.logLaterTimeout(), this.queueTimeoutLength);
            }
            if (!this.logQueue.dataPerTag[tags]) {
                this.logQueue.dataPerTag[tags] = [];
                this.logQueue.tags.push(tags);
            }
            this.logQueue.dataPerTag[tags].push(message);
        }

        private logLaterTimeout() {
            this.logQueue.tags.forEach(tags => {
                this.logNow(this.logQueue.dataPerTag[tags], tags);
            });
            this.logQueue = null;
        }

        private logNow(message: any, tags?: string) {
            if (this.xhrInitializer) {
                var strMessage = this.prepareMessage(message);
                var xhr = this.xhrInitializer();

                xhr.open('POST', this.getUrl(tags));
                if (this.usingXhr2) {
                    this.sendJsonData(xhr, strMessage);
                } else {
                    this.sendFormData(xhr, strMessage);
                }
            }
        }

        private securelyExtendMessage(message: any): any {
            if (this.extendMessageBeforeSending) {
                var newMessage = this.extendMessageBeforeSending(message);
                message = newMessage || message;
            }
            return message;
        }

        private prepareMessage(message: any): string {
            if (typeof message == 'string') {
                message = { message: message };
            }

            return JSON.stringify(message);
        }

        private sendJsonData(xhr: XMLHttpRequest, message: string) {
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(message);
        }

        private sendFormData(xhr: XMLHttpRequest, message: string) {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send('json=' + encodeURIComponent(message));
        }

        private initializeHttpRequest() {
            this.tryInitializeXHR();
            if (!this.xhrInitializer) {
                this.tryInitializeActiveXHR();
            }
            if (!this.xhrInitializer) {
                console.log("Couldn't initialize XHR, browser not supported.");
            }
        }

        private getUrl(tags?: string) {
            var ret = storeServerUrl + this.customerKey + '/' + this.apiKey;

            if (this.defaultTags) {
                ret = ret + '/' + this.defaultTags.replace(/\./g, '/');
            }
            if (tags) {
                ret = ret + '/' + tags.replace(/\./g, '/');
            }
            return ret;
        }

        private tryInitializeXHR() {
            try {
                var xhr = new XMLHttpRequest();
                if ("withCredentials" in xhr) {
                    this.usingXhr2 = true
                    this.xhrInitializer = () => new XMLHttpRequest();
                }
            } catch (ex) {
                this.xhrInitializer = null;
                this.usingXhr2 = false;
            }
        }

        private tryInitializeActiveXHR() {
            try {
                var xhr = new (<any>window).ActiveXObject("Microsoft.XMLHTTP")
                this.usingXhr2 = false;
                this.xhrInitializer = () => new (<any>window).ActiveXObject("Microsoft.XMLHTTP");
            } catch (ex) {
                this.xhrInitializer = null;
            }
        }

        private static clone<T>(source: T): T{
            var target: any = {};

            for (var p in source) {
                if (source.hasOwnProperty(p)) {
                    target[p] = source[p];
                }
            }

            return target;
        }

        private static convertErrorToSimpleObject(error: IError) {
            if (error) {
                return {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                }
            } else {
                return {}
            }
        }
    }

    export var defaultClient = new LogTankClient();

    export function initialize(customerKey: string, apiKey: string, defaultTags?: string,
                               extendMessageBeforeSending?: (message: any) => any,
                               queueTimeoutLength: number = 2000) {
        defaultClient.initialize(customerKey, apiKey, defaultTags);
        defaultClient.queueTimeoutLength = queueTimeoutLength;

        if (extendMessageBeforeSending) {
            defaultClient.extendMessageBeforeSending = extendMessageBeforeSending;
        }
    }

    export function log(message: any, tags?: string, instantly?: boolean) {
        defaultClient.log(message, tags, instantly)
    }

    export function defaultOnErrorExceptionHandler(baseObject?: any, tags?: string) {
        return defaultClient.defaultOnErrorExceptionHandler(baseObject, tags);
    }

    export function defaultAngularExceptionHandler(baseObject?: any, tags?: string) {
        return defaultClient.defaultAngularExceptionHandler(baseObject, tags);
    }
}