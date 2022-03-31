import { FunctionComponent } from "react";
import { icons } from "../../shared/icons";
declare const Icon: FunctionComponent<Props>;
interface Props {
    width?: string;
    height?: string;
    className?: string;
    icon: keyof typeof icons;
}
export default Icon;
