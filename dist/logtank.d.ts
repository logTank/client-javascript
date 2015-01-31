declare module LT {
    class LogTankClient {
        customerKey: string;
        apiKey: string;
        extendMessageBeforeSending: (message: any) => any;
        private xhrInitializer;
        private usingXhr2;
        constructor(customerKey?: string, apiKey?: string);
        initialize(customerKey: string, apiKey: string): void;
        defaultOnErrorExceptionHandler(baseObject: any, tags?: string): (errorMsg: string, url: string, line: number, col: number, exception: Error) => void;
        defaultAngularExceptionHandler(baseObject: any, tags?: string): (exception: Error, cause?: string) => void;
        log(message: any, tags?: string): void;
        private prepareMessage(message);
        private sendJsonData(xhr, message);
        private sendFormData(xhr, message);
        private initializeHttpRequest();
        private getUrl(tags?);
        private tryInitializeXHR();
        private tryInitializeActiveXHR();
        private static clone<T>(source);
        private static convertErrorToSimpleObject(error);
    }
    var defaultClient: LogTankClient;
    function initialize(customerKey: string, apiKey: string, extendMessageBeforeSending?: (message: any) => any): void;
    function log(message: any, tags?: string): void;
    function defaultOnErrorExceptionHandler(baseObject: any, tags?: string): (errorMsg: string, url: string, line: number, col: number, exception: Error) => void;
    function defaultAngularExceptionHandler(baseObject: any, tags?: string): (exception: Error, cause?: string) => void;
}
