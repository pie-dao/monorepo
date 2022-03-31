/// <reference types="ua-parser-js" />
export declare const userAgent: import("ua-parser-js").IResult;
export declare const isMobile: boolean;
export declare const IS_IN_IFRAME = false;
export declare function useEagerConnect(): boolean;
/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export declare function useInactiveListener(suppress?: boolean): void;
