declare module LT {
    class LogTankClient {
        customerKey: string;
        apiKey: string;
        private xhrInitializer;
        private usingXhr2;
        constructor(customerKey?: string, apiKey?: string);
        initialize(customerKey: string, apiKey: string): void;
        log(message: any, tags?: string): void;
        private prepareMessage(message);
        private sendJsonData(xhr, message);
        private sendFormData(xhr, message);
        private initializeHttpRequest();
        private getUrl(tags?);
        private tryInitializeXHR();
        private tryInitializeActiveXHR();
    }
    var client: LogTankClient;
    function initialize(customerKey: string, apiKey: string): void;
    function log(message: any, tags: string): void;
}
