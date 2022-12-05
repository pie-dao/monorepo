import Image from 'next/image';
import veAUXOImage from '../../public/tokens/veAUXO.svg';
import xAUXOImage from '../../public/tokens/xAUXO.svg';
import DOUGHImage from '../../public/tokens/DOUGH.png';
import ArrowRight from '../../public/images/icons/arrow-right.svg';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { useAppSelector } from '../../hooks';
import { formatBalance, toBalance } from '../../utils/formatBalance';
import { useMemo } from 'react';
import { addBalances } from '../../utils/balances';
import { BigNumber } from 'ethers';

const imageMap = {
  veAUXO: veAUXOImage,
  xAUXO: xAUXOImage,
  DOUGH: DOUGHImage,
};

type Props = {
  token: 'veAUXO' | 'xAUXO';
};

const PreviewMigration: React.FC<Props> = ({ token }) => {
  const { positions, isSingleLock, loadingPreview, estimatedOutput } =
    useAppSelector((state) => state.migration);

  const { defaultLocale } = useAppSelector((state) => state.preferences);

  const totalDOUGHConverted = useMemo(() => {
    if (isSingleLock) return positions[0].amount.label;
    return positions.reduce(
      (acc, position) => addBalances(acc, position.amount),
      toBalance(BigNumber.from(0), 18),
    ).label;
  }, [isSingleLock, positions]);

  return (
    <div className="flex flex-col w-full text-center pt-4 min-h-[3rem] pr-4">
      {loadingPreview && (
        <LoadingSpinner className="self-center h-full w-full py-2" />
      )}
      {!loadingPreview && estimatedOutput && (
        <div className="grid grid-cols-3 justify-items-center w-full py-2">
          <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2 justify-self-start">
            <Image src={imageMap.DOUGH} alt="veDOUGH" width={24} height={24} />
            <span className="text-xl font-medium text-primary">
              {formatBalance(totalDOUGHConverted, defaultLocale, 4, 'standard')}{' '}
              {'DOUGH'}
            </span>
          </div>
          <div className="flex items-center">
            <Image src={ArrowRight} alt={'transfer'} width={24} height={24} />
          </div>
          <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2 justify-self-end">
            <Image src={imageMap[token]} alt={token} width={24} height={24} />
            <span className="text-xl font-medium text-secondary">
              {formatBalance(
                estimatedOutput.label,
                defaultLocale,
                4,
                'standard',
              )}{' '}
              {token}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewMigration;
