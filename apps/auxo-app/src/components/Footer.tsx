import { useBlock } from '../hooks/useBlock';
import { AUXO_HELP_URL } from '../utils';
import ExternalUrl from './UI/url';

const logo = process.env.PUBLIC_URL + '/piedaologo.png';

const Footer = () => {
  const {
    block: { number: blockNumber },
  } = useBlock();
  return (
    <footer
      className="
        flex
        mb-10
        h-24
        w-full
        px-5 md:px-10 lg:px-20
        items-end
      "
    >
      <div className="w-24 sm:w-36 md:w-48 mr-3">
        <ExternalUrl to="https://piedao.org">
          <img
            alt="piedao-logo"
            src={logo}
            className=" object-contain max-w-24"
          />
        </ExternalUrl>
      </div>
      <div className=" items-end flex-grow">
        <section className="flex justify-end text-gray-700 w-full items-end">
          <ExternalUrl to={AUXO_HELP_URL}>
            <p className="text-baby-blue-dark mr-5">FAQ</p>
          </ExternalUrl>

          {blockNumber && (
            <p>
              <span className="hidden sm:inline-block mr-2">Block:</span>
              {blockNumber}
            </p>
          )}
        </section>
        <div className="hidden sm:block h-[1px] my-1 bg-gray-700" />
      </div>
    </footer>
  );
};
export default Footer;
