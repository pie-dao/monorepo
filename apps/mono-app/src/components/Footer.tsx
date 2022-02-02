import { useBlock } from "../hooks/useBlock";

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
      flex
      flex-col
      justify-end
      "
    >
      <div className="flex w-full align-bottom justify-between">
        <div className="flex justify-start align-bottom">
          <p>PieDAO {new Date().getFullYear()}</p>
        </div>
        <div className="flex justify-end">
          {block.blockNumber && <p>Block {block.blockNumber}</p>}
        </div>
      </div>
    </footer>
  );
};
export default Footer;
