import { Strategy, Vault } from "../../../store/vault/Vault";
import { chainMap, SUPPORTED_CHAIN_ID } from "../../../utils/networks";
import { Divider } from "../../UI/divider";
import ExternalUrl from "../../UI/url";
import { Disclosure, Transition } from "@headlessui/react";
import { BiChevronRight } from "react-icons/bi";
import { IoWarningOutline } from "react-icons/io5";
import { useMemo } from "react";

const Card = ({
  children,
  title,
}: {
  children?: React.ReactNode;
  title?: string;
}): JSX.Element => (
  <div
    className="
      p-5 rounded-lg shadow-md bg-white text-left text-xs sm:text-sm text-gray-600"
  >
    <h2 className="font-extrabold text-lg sm:text-xl mb-2">{title}</h2>
    {children}
  </div>
);

export const VaultStrategyDetails = ({
  strategy,
}: {
  strategy: Strategy;
}): JSX.Element => {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button
            className="flex items-center justify-between w-full font-bold 
                "
          >
            <div className="flex">
              <BiChevronRight
                className={`${
                  open ? "transform rotate-90" : ""
                } w-5 h-5 text-baby-blue-dark`}
              />
              <span className="flex items-center text-left ml-1">
                {strategy.name}
              </span>
            </div>
            <p className="font-bold text-return-100 flex no-wrap">
              {strategy.allocation * 100} <span>%</span>
            </p>
          </Disclosure.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="my-1">
              <div className="px-5 border-l-2 ml-2 border-l-baby-blue-light">
                <p>{strategy.description}</p>
                <p className="font-bold my-1">Links</p>
                <div className="px-5 border-l-2 border-l-baby-blue-light">
                  {strategy.links.map((link, id) => (
                    <div key={id}>
                      <ExternalUrl to={link.to}>
                        <p className="text-baby-blue-dark underline">
                          {link.name}
                        </p>
                      </ExternalUrl>
                    </div>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export const VaultStrategiesCard = ({
  vault,
}: {
  vault: Vault | undefined;
}) => {
  return (
    <Card title="Strategy Details">
      {vault &&
        vault.strategies.map((strat, id) => (
          <div key={id} className="my-5">
            <VaultStrategyDetails strategy={strat} />
          </div>
        ))}
    </Card>
  );
};

const ExperimentalWarning = (): JSX.Element => (
  <div className="text-alert-error border-2 border-alert-error p-2 flex flex-col w-full rounded-lg my-3 bg-white">
    <div className="flex mb-1 items-center">
      <IoWarningOutline fill="white" className="mr-2" size={15} />
      <p className="font-bold">Auxo Vaults are in early release</p>
    </div>
    <p className="w-full">
      Please bear in mind that the underlying contracts are unaudited and
      experimental
    </p>
  </div>
);

export const VaultExtendedInformationCard = ({
  vault,
}: {
  vault: Vault | undefined;
}): JSX.Element => {
  const chainId = vault?.network.chainId;

  const urls = useMemo(() => {
    const blockExplorer =
      chainId && `${chainMap[chainId].blockExplorerUrls[0]}/address/`;
    return (
      vault && {
        contract: blockExplorer + vault.address,
        token: blockExplorer + vault.token.address,
      }
    );
  }, [chainId, vault]);
  return (
    <Card title="About this Vault">
      <ExperimentalWarning />
      {vault ? (
        vault.description
      ) : (
        <p>
          We couldn't find any information about this vault - is the url
          correct?
        </p>
      )}
      <Divider className="my-3" />
      {urls && (
        <>
          <section className="flex justify-between my-1 mr-1">
            <p className="font-bold">Network:</p>
            <p className="text-baby-blue-dark">
              {chainMap[chainId as SUPPORTED_CHAIN_ID].chainName}
            </p>
          </section>
          <div className="flex justify-between w-full flex-wrap mb-2">
            <p className="font-bold">Contract:</p>
            <ExternalUrl to={urls.contract}>
              <p className="truncate overflow-hidden">
                <span className="text-baby-blue-dark underline mr-1 truncate overflow-hidden">
                  {vault?.address}
                </span>
              </p>
            </ExternalUrl>
          </div>
          <div className="flex justify-between w-full flex-wrap mb-2">
            <p className="font-bold">{vault?.symbol}</p>
            <ExternalUrl to={urls.token}>
              <p className="truncate overflow-hidden">
                <span className="text-baby-blue-dark underline mr-1 truncate overflow-hidden">
                  {vault?.token.address}
                </span>
              </p>
            </ExternalUrl>
          </div>
        </>
      )}
    </Card>
  );
};
