declare module LT {
    var storeServerUrl: string;
    class LogTankClient {
        customerKey: string;
        apiKey: string;
        defaultTags: string;
        queueTimeoutLength: number;
        extendMessageBeforeSending: (message: any) => any;
        private xhrInitializer;
        private usingXhr2;
        private logQueue;
        constructor(customerKey?: string, apiKey?: string, defaultTags?: string, queueTimeoutLength?: number);
        initialize(customerKey: string, apiKey: string, defaultTags?: string): void;
        defaultOnErrorExceptionHandler(baseObject?: any, tags?: string): (errorMsg: string, url: string, line: number, col: number, exception: Error) => void;
        defaultAngularExceptionHandler(baseObject?: any, tags?: string): (exception: Error, cause?: string) => void;
        log(message: any, tags?: string, instantly?: boolean): void;
        private logLater(message, tags?);
        private logLaterTimeout();
        private logNow(message, tags?);
        private securelyExtendMessage(message);
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
    function initialize(customerKey: string, apiKey: string, defaultTags?: string, extendMessageBeforeSending?: (message: any) => any, queueTimeoutLength?: number): void;
    function log(message: any, tags?: string, instantly?: boolean): void;
    function defaultOnErrorExceptionHandler(baseObject?: any, tags?: string): (errorMsg: string, url: string, line: number, col: number, exception: Error) => void;
    function defaultAngularExceptionHandler(baseObject?: any, tags?: string): (exception: Error, cause?: string) => void;
}
