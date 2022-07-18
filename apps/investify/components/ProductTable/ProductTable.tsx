import Image from 'next/image';
import { ProductTableData } from '../../hooks/useFormatDataForAssetsTable';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { motion, AnimatePresence } from 'framer-motion';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { setSwap } from '../../store/sidebar/sidebar.slice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../hooks';
import classNames from '../../utils/classnames';

export default function ProductTable({
  product,
}: {
  product: ProductTableData;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { hideBalance } = useAppSelector((state) => state.preferences);
  return (
    <Disclosure
      key={product.name.main}
      as="div"
      className="bg-gradient-primary shadow-md rounded-lg px-3 py-2 overflow-hidden"
      data-cy={`product-table-${product.name.main}`}
    >
      {({ open }) => (
        <>
          <Disclosure.Button as="div" className="cursor-pointer">
            <div className="flex items-center">
              <div className="min-w-0 flex-1 flex items-start">
                <div className="flex-shrink-0 self-start">
                  <Image
                    src={product.image}
                    alt={product.name.main}
                    height={40}
                    width={40}
                  />
                </div>
                <div className="min-w-0 flex-1 px-4 grid grid-cols-2 sm:grid-cols-4 sm:gap-4 items-center">
                  <div className="flex flex-col justify-between">
                    <p className="text-base font-bold" data-cy="name">
                      {product.name.main}
                    </p>
                    <p className="text-xs text-sub-dark hidden sm:block">
                      {product.name.sub}
                    </p>
                    <p className="text-base text-sub-dark block sm:hidden">
                      {product.balance} {product.name.main}
                    </p>
                  </div>
                  <div className="flex-col justify-between hidden sm:block">
                    <p className="text-base" data-cy="price">
                      {product.price.value}
                    </p>
                    <p className="text-xs text-secondary">
                      {product.price.twentyFourHours.price} /{' '}
                      {product.price.twentyFourHours.change}
                    </p>
                  </div>
                  <div className="flex-col justify-center text-right hidden sm:block">
                    <p
                      className={classNames(
                        `text-base text-primary`,
                        hideBalance && `hidden-balance-primary`,
                      )}
                      data-cy="balance"
                    >
                      {product.balance}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center text-right">
                    <p
                      className={classNames(
                        `text-base text-primary font-medium`,
                        hideBalance && 'hidden-balance-primary',
                      )}
                      data-cy="value"
                    >
                      {product.value}
                    </p>
                    <p className="text-base text-secondary block sm:hidden">
                      {product.price.twentyFourHours.price} /{' '}
                      {product.price.twentyFourHours.change}
                    </p>
                  </div>
                </div>
              </div>
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                <ChevronDownIcon
                  className="h-5 w-5 text-primary"
                  aria-hidden="true"
                />
              </motion.div>
            </div>
          </Disclosure.Button>
          <AnimatePresence initial={false}>
            {open && (
              <Disclosure.Panel
                as={motion.div}
                initial="collapsed"
                animate="open"
                static
                exit="collapsed"
                key={'panel-' + product.name.main}
                variants={{
                  open: { opacity: 1, height: 'auto' },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{
                  duration: 0.2,
                }}
                className="bg-background rounded-lg overflow-hidden"
              >
                <motion.div
                  variants={{
                    collapsed: { scale: 0.8 },
                    open: { scale: 1 },
                  }}
                  transition={{ duration: 0.3 }}
                  className="origin-top-center py-4 space-y-1"
                >
                  {product.subRows.map((subRow) => (
                    <div
                      className="min-w-0 flex-1 flex items-center"
                      key={subRow.balance}
                    >
                      <div className="flex-shrink-0 justify-center flex w-[40px]">
                        <Image
                          src={subRow.chainImage}
                          width={20}
                          height={20}
                          alt={subRow.chainName}
                        />
                      </div>
                      <div className="min-w-0 flex-1 sm:px-4 grid grid-cols-2 sm:grid-cols-4 sm:gap-4 items-center">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-x-2">
                          <p className="text-xs">{subRow.chainName}</p>
                          <p className="text-xs text-secondary hidden sm:block">
                            {subRow.allocationPercentage}
                          </p>
                          <p className="text-xs text-sub-dark block sm:hidden">
                            {subRow.balance} {product.name.main}
                          </p>
                        </div>
                        <div className="flex-col justify-between hidden sm:block"></div>
                        <div className="flex-col justify-center text-right hidden sm:block">
                          <p
                            className={classNames(
                              `text-xs text-sub-dark`,
                              hideBalance && `hidden-balance-sub-dark`,
                            )}
                          >
                            {subRow.balance}
                          </p>
                        </div>
                        <div className="flex flex-col justify-center text-right">
                          <p
                            className={classNames(
                              `text-xs text-primary`,
                              hideBalance && 'hidden-balance-primary',
                            )}
                          >
                            {subRow.value}
                          </p>
                          <p className="text-secondary block sm:hidden">
                            {subRow.allocationPercentage}
                          </p>
                        </div>
                      </div>
                      <div className="h-5 w-5"></div>
                    </div>
                  ))}
                </motion.div>
              </Disclosure.Panel>
            )}
          </AnimatePresence>
          <div className="min-w-0 flex-1 flex gap-4 flex-col sm:flex-row">
            <div className="flex flex-1 items-center gap-x-4">
              <div className="flex flex-1 bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-secondary h-1.5 rounded-full"
                  style={{ width: product.portfolioPercentage }}
                ></div>
              </div>
              <div className="text-sm" data-cy="percentage">
                {product.portfolioPercentage}
              </div>
            </div>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 0, width: 0 },
                    visible: { opacity: 1, width: 'auto' },
                  }}
                  transition={{ duration: 0.2 }}
                  className="gap-x-2 flex"
                >
                  <Link
                    href={`/products/${encodeURIComponent(product.symbol)}`}
                    passHref
                  >
                    <button className="w-full sm:w-auto px-8 py-1 text-base font-medium text-text bg-transparent rounded-2xl border border-text hover:bg-text hover:text-white">
                      {t('dashboard:discover')}
                    </button>
                  </Link>
                  <button
                    className="w-full sm:w-auto px-8 py-1 text-base font-medium text-text bg-transparent rounded-2xl border border-text hover:bg-text hover:text-white"
                    onClick={() =>
                      dispatch(
                        setSwap({
                          step: 'swap',
                          swap: {
                            from: 'default',
                            to: product.name.main,
                          },
                        }),
                      )
                    }
                  >
                    {t('Trade')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </Disclosure>
  );
}
