import { MutableRefObject } from 'react';
export declare function useOutsideClick(containers: HTMLElement | MutableRefObject<HTMLElement | null> | (MutableRefObject<HTMLElement | null> | HTMLElement | null)[] | Set<HTMLElement>, cb: (event: MouseEvent | PointerEvent, target: HTMLElement) => void): void;
