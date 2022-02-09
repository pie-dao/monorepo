import React, { Fragment } from "react";
import { IoChevronBack, IoWarningOutline } from "react-icons/io5"
import { USDCIcon } from "../../assets/icons/logos";
import { Tab } from '@headlessui/react'
import { useLocation, useNavigate } from "react-router-dom";
import { getProof } from "../../utils/merkleProof";
import { useWeb3React } from "@web3-react/core";
import { useSelectedVault } from "../../hooks/useSelectedVault";
import { chainMap } from "../../utils/networks";
import DepositCard from "./Deposit";
import { useDepositor } from "./MerkleAuthCheck";
import CardItem from "../UI/cardItem";
import { prettyNumber } from "../../utils";
import { Vault } from "../../store/vault/Vault";

const Card = ({ children }: { children?: React.ReactNode }): JSX.Element => (
  <div className="
    p-5 rounded-lg shadow-md bg-white text-left">
    { children }
  </div>
)

const Switcher = () => {
  return (
    <div className="
      w-full h-full">
    <Tab.Group>
      <Tab.List className="
        flex justify-evenly items-center">
      {['OPT-IN', 'DEPOSIT', 'WITHDRAW'].map((t, i) => (<Tab key={i} as={Fragment}>
          {({ selected }) => (
            <button
              className={
                  `
              ${selected ? 'text-black border-purple-700' : 'text-gray-300 border-gray-300'} border-b-2  w-full py-2 font-semibold`}
            >
              {t}
            </button>
          )}
        </Tab>))}
      </Tab.List>
      <Tab.Panels className="
        flex items-center justify-center h-[80%]">
        <Tab.Panel>Here we show veDOUGH opt in</Tab.Panel>
        <Tab.Panel>Here is the approve/deposit button</Tab.Panel>
        <Tab.Panel>Here is the enter BB/exit bb</Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
    </div>
  )
}

const VEDoughChecker = (): JSX.Element => {
  const { account } = useWeb3React();
  const hasVedough = getProof(account);
  return (
    <div className="
      bg-white rounded-md p-2">
      {
      hasVedough 
        ? <div className="
          font-bold px-2 text-purple-700">Account is a veDOUGH holder</div>
        : <div className="
          font-bold px-2 text-red-700">Account is not a veDOUGH holder</div>
      }
    </div>
  )
}

const VaultSummaryUser = ({ loading, vault }: {
  loading: boolean,
  vault: Vault | undefined
}) => {
  if (!vault) return <p>Failed to Load</p> 
  return (
    <section className="
      flex flex-col w-full justify-evenly h-full items-center">
      <CardItem
          loading={loading}
          left={`Your Vault Token balance`}
          right={ prettyNumber(vault?.userBalances?.vault.label) }
      />
      <CardItem
          loading={loading}
          left="Last Harvested"
          right={ vault.stats?.lastHarvest.toString() ?? 'N/A' }
      />
      <div className="
        h-[1px] bg-gray-300 w-full "/>
      <CardItem
          loading={loading}
          left={`Your ${vault.symbol} Wallet balance`}
          right={ prettyNumber(vault?.userBalances?.wallet.label) }
      />
       <CardItem
          loading={loading}
          left={`Available to withdraw:`}
          right={ prettyNumber(vault?.userBalances?.batchBurn.available.label ?? 0 ) }
      />
    </section>     
  )
}

const VEDoughStatusRow = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-wrap items-center justify-center sm:justify-between">
        <div className="
          flex items-center text-purple-800">
          <button onClick={() => {navigate('/')}} className="
            bg-white rounded-md shadow-md p-3">
          <IoChevronBack />
          </button>
          <div className="
            flex items-center mx-5 bg-white font-bold rounded-md my-2 sm:my-0 p-2">
            <IoWarningOutline />
            <p className="ml-2 hidden sm:block">veDOUGH access only</p>
          </div>
        </div>
        <VEDoughChecker />
    </div>
  )
}

const PoolStats = ({ vault }: { vault: Vault | undefined }): JSX.Element => {
  return (
  <div className="flex items-center justify-center sm:justify-between m-3">
    <div className="flex h-6 justify-start  items-center">
      <div className="h-full flex">
        <USDCIcon colors={{bg: 'purple', primary: 'white'}}/>
      </div>
      <p className="
        ml-3 font-bold text-lg">{vault?.symbol} Pool <span className="font-extrabold text-pink-600 mr-3">{vault?.stats?.currentAPY ?? 'N/A'}% APY</span>
      </p>
    </div>
  </div>
  )
}

const VaultInfoCard = ({ vault }: { vault: Vault | undefined }) => {
  return (
    <Card>
      <h2 className="
        font-extrabold text-lg">Vault Info</h2>
      <a
          href={`${chainMap[vault?.network.chainId as number].blockExplorer}/address/${vault?.address}`}
          target="_blank"
          rel="noreferrer noopener"
          className="text-ellipsis truncate overflow-hidden"
        >
          <p className="truncate overflow-hidden">
            <span className="text-purple-700 underline mr-1 truncate overflow-hidden">{vault?.address}</span>
            &#8594;
          </p>
      </a>        
    </Card>
  )
} 

const VaultExtendedInformationCard = (): JSX.Element => {
  return (
    <Card>
      <h2 className="
        font-extrabold text-lg">About this Vault</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda et nihil dolor eum ducimus dignissimos. Ab officia error quisquam odit? Consectetur exercitationem, impedit asperiores veritatis dignissimos officiis debitis facilis repellat?
      </p>
    </Card>
  )
}

const VaultAssetExposureCard = () => {
  return (
    <Card>
      <h2 className="font-extrabold text-lg">Asset Exposure</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda et nihil dolor eum ducimus dignissimos. Ab officia error quisquam odit? Consectetur exercitationem, impedit asperiores veritatis dignissimos officiis debitis facilis repellat?
      </p>
    </Card>
  )
}

function VaultDetails(): JSX.Element {
  const vault = useSelectedVault();
  return (
    <section className="
      grid
      grid-cols-12
      grid-flow-rows
      gap-4
      m-5
      ">
      <section className="col-span-12 order-1">
        <VEDoughStatusRow />
      </section>
      <section className="col-span-12 order-2 row-span-1">
        <PoolStats vault={vault} />
      </section>      
      <div className="col-span-12 md:col-span:6 lg:col-span-8 order-3 row-span-1">
        <VaultExtendedInformationCard />
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-4 order-6 md:order-7 lg:order-3
        row-span-2
        flex justify-center items-center bg-white border-gradient rounded-md h-72
        ">
        <Switcher />
      </div>
      <div className="col-span-12 lg:col-span-8 order-4 md:order-6 row-span-1">
        <VaultAssetExposureCard />
      </div>
      <div className="col-span-12 md:col-span:6 lg:col-span-8 order-5">
       <VaultInfoCard vault={vault} />
      </div>
      <div className="
        col-span-12 md:col-span-6 lg:col-span-4 order-7 md:order-8
        flex justify-end items-center bg-white border-gradient rounded-md">
        <VaultSummaryUser vault={vault} loading={false} />
      </div>
    </section>
  )
}

export default VaultDetails
