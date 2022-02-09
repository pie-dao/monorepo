import { useSelectedVault } from "../../../hooks/useSelectedVault";
import DepositWithdrawSwitcher from "./DepositWithdrawSwitcher";
import { VaultAssetExposureCard, VaultExtendedInformationCard, VaultInfoCard } from "./Cards";
import VaultSummaryUser from "./VaultSummaryUser";
import { VaultPoolStatsRow, VEDoughStatusRow } from "./StatusRows";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


function VaultDetails(): JSX.Element {
  const vault = useSelectedVault();
  const navigate = useNavigate();
  useEffect(() => {
    if (!vault) navigate('/');
  }, [vault, navigate]);
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
        <VaultPoolStatsRow vault={vault} />
      </section>      
      <div className="col-span-12 md:col-span:6 lg:col-span-8 order-3 row-span-1">
        <VaultExtendedInformationCard />
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-4 order-6 md:order-7 lg:order-3
        row-span-2
        flex justify-center items-center bg-white border-gradient rounded-md h-72
        ">
        <DepositWithdrawSwitcher vault={vault}/>
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
