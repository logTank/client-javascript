module LT {
    export class LogTankClient {
        private xhr: XMLHttpRequest = null;
        private usingXhr2 = false;

        constructor(public customerKey?: string,
                    public apiKey?: string) {
            this.initializeHttpRequest();
        }

        public initialize(customerKey: string, apiKey: string) {
            this.customerKey = customerKey;
            this.apiKey = apiKey;
        }

        public log(message: any, tags: string) {
            if (this.xhr) {
                var strMessage = JSON.stringify(message);
                this.xhr.open('POST', this.getUrl(tags));

                if (this.usingXhr2) {
                    this.sendJsonData(strMessage);
                } else {
                    this.sendFormData(strMessage);
                }
            }
        }

        private sendJsonData(message: string) {
            this.xhr.setRequestHeader('Content-Type', 'application/json');
            this.xhr.send(JSON.stringify(message));
        }

        private sendFormData(message: string) {
            this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            this.xhr.send('json=' + encodeURIComponent(message));
        }

        private initializeHttpRequest() {
            this.tryInitializeXHR();
            if (!this.xhr) {
                this.tryInitializeActiveXHR();
            }
            if (!this.xhr) {
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
                this.xhr = new XMLHttpRequest();
                if ("withCredentials" in this.xhr) {
                    this.usingXhr2 = true
                } else {
                    this.xhr = null;
                    this.usingXhr2 = false;
                }
            } catch (ex) {
                this.xhr = null;
                this.usingXhr2 = false;
            }
        }

        private tryInitializeActiveXHR() {
            try {
                this.xhr = new (<any>window).ActiveXObject( "Microsoft.XMLHTTP" )
                this.usingXhr2 = false;
            } catch (ex) {
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