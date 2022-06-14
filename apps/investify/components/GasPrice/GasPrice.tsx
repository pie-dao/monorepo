import { useWeb3React } from '@web3-react/core';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function GasPrice() {
  const [gasPrice, setGasPrice] = useState('');
  const { library } = useWeb3React();

  useEffect(() => {
    const getGasPrice = async () => {
      const gasPrice = await library.getGasPrice();
      const formatted = +ethers.utils.formatUnits(gasPrice, 'gwei');
      setGasPrice(formatted.toFixed());
    };

    if (library) getGasPrice();
  }, [gasPrice, library, setGasPrice]);
  if (!gasPrice) return null;

  return (
    <div className="flex gap-x-1 text-sub-light items-center justify-center">
      <svg
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 13 14"
      >
        <path
          fill="currentColor"
          d="m12.3238 3.82775-1.2266-.61331v-.42752c0-.22524-.1827-.40773-.4078-.40773h-.95132v-.40772c0-.67448-.54869-1.223179-1.22318-1.223179H2.80672c-.67451 0-1.22318.548699-1.22318 1.223179V12.4365H1.1758c-.225161 0-.407734.1825-.407734.4077s.182549.4077.407734.4077h8.97c.2252 0 .4077-.1825.4077-.4077s-.1825-.4077-.4077-.4077h-.40772V8.08739h.40772c.2248 0 .4078.18291.4078.40773v1.90278c0 .6744.5486 1.2231 1.2231 1.2231.6745 0 1.2232-.5487 1.2232-1.2231V4.9218c0-.46625-.2591-.88554-.6761-1.09405ZM5.66134 10.2619c-.97419 0-1.76683-.79259-1.76683-1.7668 0-.35064.10272-.68978.29704-.98056l1.13082-1.69236c.15129-.22643.52664-.22643.67793 0l1.13082 1.69224c.19427.29093.29701.63004.29701.9807.00003.97419-.79261 1.76678-1.76679 1.76678Zm2.44582-5.84406c0 .22524-.18264.40774-.40773.40774H3.62217c-.22509 0-.40774-.1825-.40774-.40774V2.78692c0-.22524.18265-.40773.40774-.40773h4.07726c.22509 0 .40773.18249.40773.40773v1.63092Zm1.63092-1.22318h.54362v2.44636h-.54362V3.19466Zm2.44632 7.20314c0 .2248-.1829.4078-.4077.4078s-.4077-.183-.4077-.4078V8.4951c0-.67449-.5487-1.22318-1.2232-1.22318h-.40772v-.81545h.95142c.225 0 .4077-.1825.4077-.40774v-1.9225l.8619.43096c.1391.06943.2254.20916.2254.36458v5.47603h-.0001Z"
        />
      </svg>
      <div className="text-base font-medium rounded-full text-white bg-sub-light px-2 py-0.5">
        <span>{gasPrice}</span>
      </div>
    </div>
  );
}
