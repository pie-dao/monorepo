import Image from 'next/image';
import veAUXOImage from '../../public/tokens/veAUXO.svg';
import xAUXOImage from '../../public/tokens/xAUXO.svg';
import DOUGHImage from '../../public/tokens/DOUGH.png';
import ArrowRight from '../../public/images/icons/arrow-right.svg';
import { useAppSelector } from '../../hooks';
import { formatBalance, toBalance } from '../../utils/formatBalance';
import { useMemo } from 'react';
import { addBalances } from '../../utils/balances';
import { BigNumber } from 'ethers';
import { MIGRATION_TYPE } from '../../store/migration/migration.types';
import { isEmpty } from 'lodash';

const imageMap = {
  veAUXO: veAUXOImage,
  xAUXO: xAUXOImage,
  DOUGH: DOUGHImage,
};
type Props = {
  token: 'veAUXO' | 'xAUXO';
  previewType: typeof MIGRATION_TYPE[keyof typeof MIGRATION_TYPE];
  isSingleLock: boolean;
  DOUGHInput?: string;
};

const PreviewMigration: React.FC<Props> = ({
  DOUGHInput,
  token,
  isSingleLock,
  previewType,
}) => {
  const { positions, estimatedOutput } = useAppSelector(
    (state) => state.migration,
  );

  const tokenName = {
    veAUXO: 'ARV',
    xAUXO: 'PRV',
  };

  const { defaultLocale } = useAppSelector((state) => state.preferences);

  const totalDOUGHConverted = useMemo(() => {
    if (isEmpty(positions)) return 0;
    if (isSingleLock) return positions[0].amount.label;
    return positions.reduce(
      (acc, position) => addBalances(acc, position.amount),
      toBalance(BigNumber.from(0), 18),
    ).label;
  }, [isSingleLock, positions]);

  return estimatedOutput?.[token]?.[previewType] ? (
    <div className="flex flex-col w-full text-center min-h-[3rem] border-y py-0.5">
      <div className="grid grid-cols-5 justify-items-center w-full py-2">
        <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2 justify-self-start col-span-2">
          <Image src={imageMap.DOUGH} alt="veDOUGH" width={24} height={24} />
          <span className="text-lg font-medium text-primary">
            {DOUGHInput ??
              formatBalance(
                totalDOUGHConverted,
                defaultLocale,
                4,
                'standard',
              )}{' '}
            {'DOUGH'}
          </span>
        </div>
        <div className="flex items-center">
          <Image src={ArrowRight} alt={'transfer'} width={24} height={24} />
        </div>
        <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2 justify-self-end col-span-2">
          <Image src={imageMap[token]} alt={token} width={24} height={24} />
          <span className="text-lg font-medium text-secondary">
            {formatBalance(
              estimatedOutput?.[token]?.[previewType]?.label,
              defaultLocale,
              4,
              'standard',
            )}{' '}
            {tokenName[token]}
          </span>
        </div>
      </div>
    </div>
  ) : null;
};

export default PreviewMigration;
