import Image from 'next/image';
import { useAppSelector } from '../../../hooks';
import useTranslation from 'next-translate/useTranslation';
import classNames from '../../../utils/classnames';
import { formatBalance } from '../../../utils/formatBalance';
import CardInfoList, {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from '../Card';
import { formatDate } from '../../../utils/dates';
import { userMergedPosition } from '../../../hooks/useEnanchedPools';
import { isEmpty } from 'lodash';
import { ParseMarkdown } from '../../ParseMarkdown/ParseMarkdown';

export const PoolCard = ({ pool }: { pool: userMergedPosition }) => {
  const { t } = useTranslation();
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  if (isEmpty(pool)) {
    return null;
  }
  return (
    <Card
      className={classNames(
        'bg-grsadient-primary flex-row',
        !pool?.attributes?.is_active && 'opacity-50 pointer-events-none',
      )}
    >
      <CardContent className="gap-4 flex-col lg:flex-row flex">
        <div className="flex relative overflow-hidden rounded-md items-center justify-center flex-shrink-0 h-48 lg:h-auto lg:w-[380px]">
          {pool?.attributes?.card_image?.data?.attributes?.url ? (
            <Image
              src={pool?.attributes?.card_image?.data?.attributes?.url}
              alt="eth"
              objectPosition={'top'}
              objectFit={'cover'}
              layout={'fill'}
              priority
            />
          ) : null}
          {pool?.attributes?.pool_token_image?.data?.attributes?.url ? (
            <div className="absolute">
              <Image
                src={pool?.attributes?.pool_token_image?.data?.attributes?.url}
                alt="eth"
                width={200}
                height={200}
              />
            </div>
          ) : null}
        </div>
        <CardDescription>
          <div className="text-primary bg-light-gray text-sm p-4 rounded-md relative">
            {ParseMarkdown(pool?.attributes?.description)}
            <div className="flex flex-wrap gap-2 mt-2">
              {pool?.attributes?.tags?.map(({ tag }, i) => (
                <span
                  key={i}
                  className="text-base text-white bg-gradient-major-secondary-predominant rounded-lg px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <CardInfoList
            className="text-primary bg-light-gray text-sm p-4 rounded-md"
            infos={[
              {
                title: t('currentTotalSupply'),
                value: (
                  <>
                    {formatBalance(
                      pool?.lastEpoch?.totalBorrow?.label,
                      defaultLocale,
                      2,
                      'standard',
                    )}{' '}
                    {pool?.attributes?.token?.data?.attributes?.symbol}
                  </>
                ),
              },
              {
                title: t('rewardsGenerated'),
                value: (
                  <>
                    {pool?.lastEpoch?.forClaims?.label !== 0
                      ? `${formatBalance(
                          pool?.lastEpoch?.forClaims?.label,
                          defaultLocale,
                          2,
                          'standard',
                        )} ${pool?.attributes?.token?.data?.attributes?.symbol}`
                      : t('N/A')}
                  </>
                ),
              },
              {
                title: t('withdrawIn'),
                value: (
                  <>
                    {formatDate(
                      pool.attributes?.date_until_next_state,
                      defaultLocale,
                    )}
                  </>
                ),
              },
              {
                title: t('startingDate'),
                value: (
                  <>{formatDate('2021-09-01T00:00:00.000Z', defaultLocale)}</>
                ),
              },
            ]}
          />
        </CardDescription>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};
