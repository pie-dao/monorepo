import { useBlock } from "../hooks/useBlock";
import logo from './logo.png'

const Footer = () => {
  const block = useBlock();
  return (
    <footer
      className="
      bg-white
      fixed
      bottom-0
      h-10
      z-10
      w-full
      px-5
      grid
      grid-rows-2
      grid-cols-12
      gap-1
      "
    >
      <div className="row-span-2 col-span-6 sm:col-span-3 md:col-span-2 h-4 sm:h-6 w-30 md:w-48 lg:flex justify-center">
      <img alt="piedao-logo" src={logo}
       className="h-6 w-30" />
      </div>
      <div className="row-span-1 col-span-6 sm:col-span-9 md:col-span-10">
          {block.blockNumber && <p className="flex justify-end"><span className="hidden sm:block mr-1">Block:</span>{block.blockNumber}</p>}
        <div className="hidden sm:block h-[1px] my-1 bg-black" />
      </div>
    </footer>
  );
};
export default Footer;
