import { useBlock } from "../hooks/useBlock";

const logo = process.env.PUBLIC_URL + '/piedaologo.png'

const Footer = () => {
  const block = useBlock();
  return (
    <footer
      className="
        flex
        mb-10
        h-24
        w-full
        px-20
        items-end
      "
    >
      <div className="w-24 sm:w-36 md:w-48 mr-3">
        <img alt="piedao-logo" src={logo} className=" object-contain max-w-24" />
      </div>
      <div className=" items-end flex-grow">
        {block.blockNumber && (
          <p className="flex justify-end text-gray-700">
            <span className="hidden sm:block mr-2">Block:</span>
            {block.blockNumber}
          </p>
        )}
        <div className="hidden sm:block h-[1px] my-1 bg-gray-700" />
      </div>
    </footer>
  );
};
export default Footer;
