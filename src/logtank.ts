module LT {
    export class LogTankClient {
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

        public log(message: any, tags?: string) {
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
    }

    export var client = new LogTankClient();

    export function initialize(customerKey: string, apiKey: string) {
        client.initialize(customerKey, apiKey);
    }

    export function log(message: any, tags: string) {
        client.log(message, tags)
    }
}