import { FunctionComponent } from "react";
import { SUPPORTED_CHAIN_NAMES, NetworkDetail } from "../types/types";
interface Props {
    allowedChains?: SUPPORTED_CHAIN_NAMES[];
    showNetworkIcon?: boolean;
    showNetworkName?: boolean;
    className?: string;
}
interface ChainProps {
    chain: NetworkDetail | null | undefined;
}
export declare const ChainAndLogo: FunctionComponent<ChainProps>;
export declare const ChainSwitcher: FunctionComponent<Props>;
export {};
