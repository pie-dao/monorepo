import Image from "next/image";
import {
  DAIIcon,
  EthereumIcon,
  FRAXIcon,
  FTMLogo,
  MIMLogo,
  PolygonIcon,
  USDCIcon,
} from "../assets/icons/logos";
import Logo from "/public/auxo-icon-green.png";

const AuxoLogo = () => (
  <div className="h-8 w-auto">
    <Image alt="auxo-logo" src={Logo} className="object-contain max-w-24" />
  </div>
);

export const logoSwitcher = (
  identifier: string | undefined,
  props?: any
): JSX.Element => {
  if (!identifier) return <AuxoLogo {...props} />;
  switch (identifier.toLowerCase()) {
    case "usdc": {
      return <USDCIcon {...props} />;
    }
    case "frax": {
      return <FRAXIcon {...props} />;
    }
    case "ftm":
    case "wftm": {
      return <FTMLogo {...props} />;
    }
    case "dai": {
      return <DAIIcon {...props} />;
    }
    case "mim": {
      return <MIMLogo />;
    }
    case "matic":
    case "polygon": {
      return <PolygonIcon {...props} />;
    }
    case "eth": {
      return <EthereumIcon {...props} />;
    }
    default: {
      return <AuxoLogo {...props} />;
    }
  }
};
