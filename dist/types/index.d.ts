/**
 * Written by Elliott Mangham at Code Resolution. Maintained by Code Resolution.
 * made@coderesolution.com
 */
export default class DomInject {
    constructor(options?: {});
    options: {
        loadingClass: any;
        loadedClass: any;
        errorClass: any;
    };
    fetchContent(sourceUrl: any, sourceScope?: any, includeParent?: boolean): Promise<any>;
    loadContent(target: any, sourceUrl?: any, sourceScope?: any, { mode, beforeFetch, afterFetch, includeParent }?: {
        mode?: string;
        beforeFetch?: any;
        afterFetch?: any;
        includeParent?: boolean;
    }): void;
    _toggleLoadingState(element: any, isLoading: any, isError?: boolean): void;
}
