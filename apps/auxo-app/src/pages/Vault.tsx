import { useSelectedVault } from '../hooks/useSelectedVault';
import DepositWithdrawSwitcher from '../components/Vault/Actions/DepositWithdrawSwitcher';
import {
  VaultExtendedInformationCard,
  VaultStrategiesCard,
} from '../components/Vault/Details/Cards';
import VaultSummaryUser from '../components/Vault/Details/VaultSummaryUser';
import {
  VaultPoolAPY,
  VEDoughStatusRow,
  FloatingBackground,
} from '../components/Vault/Details/StatusRows';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Vault } from '../store/vault/Vault';
import { useAppDispatch } from '../hooks';
import { setSelectedVault } from '../store/vault/vault.slice';
import VaultCapSlider from '../components/Vault/Details/VaultCapSlider';

function VaultContentBlocks({
  vault,
}: {
  vault: Vault | undefined;
}): JSX.Element {
  return (
    <section className="grid grid-cols-1 gap-4">
      <VaultExtendedInformationCard vault={vault} />
      {vault && vault.strategies.length > 0 && (
        <VaultStrategiesCard vault={vault} />
      )}
    </section>
  );
}

function VaultActionBlocks({
  vault,
}: {
  vault: Vault | undefined;
}): JSX.Element {
  return (
    <section className="grid grid-cols-1 gap-4">
      <div className="min-h-[20rem] bg-white border-gradient rounded-xl shadow-md">
        <DepositWithdrawSwitcher vault={vault} />
      </div>
      <div className="bg-white rounded-xl shadow-md p-5">
        <VaultSummaryUser vault={vault} loading={false} />
      </div>
    </section>
  );
}

function VaultDetails(): JSX.Element {
  const vault = useSelectedVault();
  const params = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!vault && params && params.vaultId) {
      dispatch(setSelectedVault(params.vaultId));
    }
  }, [vault, dispatch, params]);

  return (
    <section className="">
      <VEDoughStatusRow />
      <FloatingBackground />
      <section
        className="
          grid
          grid-cols-12
          grid-flow-rows
          gap-4
          relative
          mx-1 md:mx-5
        "
      >
        <div
          className="
            col-span-12 lg:col-span-6 xl:col-span-6
            order-2 lg:order-1 text-gray-700
          "
        >
          <VaultPoolAPY vault={vault} />
          <VaultContentBlocks vault={vault} />
        </div>
        <div
          className="
          col-span-12 lg:col-span-6 xl:col-span-6
          order-1 lg:order-2 text-gray-700
          "
        >
          <VaultCapSlider />
          <VaultActionBlocks vault={vault} />
        </div>
      </section>
    </section>
  );
}

export default VaultDetails;
