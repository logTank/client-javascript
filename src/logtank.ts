module LT {
    interface IError {
        message: string;
        stack: string;
        name: string;
    }

    export class LogTankClient {
        public extendMessageBeforeSending: (message: any) => any;

        private xhrInitializer: () => XMLHttpRequest = null;
        private usingXhr2 = false;

        constructor(public customerKey?: string,
                    public apiKey?: string) {
            this.initializeHttpRequest();
        }

        public initialize(customerKey: string, apiKey: string) {
            this.customerKey = customerKey;
            this.apiKey = apiKey;
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

                this.log(message, tags);
            }
        }

        public defaultAngularExceptionHandler(baseObject?: any, tags?: string) {
            baseObject = baseObject || {};

            return (exception: Error, cause?: string) => {
                var message = LogTankClient.clone(baseObject);
                message.error = LogTankClient.convertErrorToSimpleObject(<any>exception);
                message.cause = cause;

                this.log(message, tags)
            };
        }

        public log(message: any, tags?: string) {
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
                } else {
                    this.sendFormData(xhr, strMessage);
                }
            }
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
            var ret = 'http://store.logtank.com/' + this.customerKey + '/' + this.apiKey;

            if (tags) {
                ret = ret + '/' + tags.replace('.', '/');
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

    export function initialize(customerKey: string, apiKey: string,
                               extendMessageBeforeSending?: (message: any) => any) {
        defaultClient.initialize(customerKey, apiKey);

        if (extendMessageBeforeSending) {
            defaultClient.extendMessageBeforeSending = extendMessageBeforeSending;
        }
    }

    export function log(message: any, tags?: string) {
        defaultClient.log(message, tags)
    }

    export function defaultOnErrorExceptionHandler(baseObject?: any, tags?: string) {
        return defaultClient.defaultOnErrorExceptionHandler(baseObject, tags);
    }

    export function defaultAngularExceptionHandler(baseObject?: any, tags?: string) {
        return defaultClient.defaultAngularExceptionHandler(baseObject, tags);
    }
}