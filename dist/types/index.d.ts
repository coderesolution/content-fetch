export default class ContentFetch {
    constructor(options?: {});
    options: {
        loadingClass: any;
        loadedClass: any;
        errorClass: any;
        debugMode: any;
    };
    cache: Map<any, any>;
    controller: AbortController;
    log(message: any): void;
    fetchContent(url: any, sourceScope?: any, includeParent?: boolean): Promise<any>;
    from({ selector, url, includeParent, onStart, onEnd, onError }: {
        selector: any;
        url?: string;
        includeParent?: boolean;
        onStart: any;
        onEnd: any;
        onError: any;
    }): Promise<any>;
    to({ destination, data, mode, delay, onStart, onEnd, onError }: {
        destination: any;
        data: any;
        mode?: string;
        delay?: number;
        onStart: any;
        onEnd: any;
        onError: any;
    }): Promise<any>;
    fromTo(fromParams: any, toParams: any): void;
    abortFetch(): void;
}
