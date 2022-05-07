import { useWeb3React } from '@web3-react/core';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setAlert, setAlertDisplay } from '../../store/app/app.slice';
import StyledButton from '../UI/button';
import { FaBell } from 'react-icons/fa';
import { useState } from 'react';
import { useEffect } from 'react';

const trimAccount = (account: string): string => {
  return account.slice(0, 6) + '...' + account.slice(38);
};

export const CreateAlert = () => {
  const dispatch = useAppDispatch();
  const onClick = () => {
    dispatch(
      setAlert({
        message:
          'Tehre was a problem connecting to the network etc etc etc etc blaj ffekekfekak  adalelglgl ',
        type: 'ERROR',
        action: 'SWITCH_NETWORK',
      }),
    );
  };
  return <button onClick={onClick}>Test Alert</button>;
};

export const AlertButton = (): JSX.Element => {
  const [notification, setNotification] = useState(false);
  const dispatch = useAppDispatch();
  const alert = useAppSelector((state) => state.app.alert);

  useEffect(() => {
    alert.message ? setNotification(true) : setNotification(false);
  }, [alert.message]);

  return (
    <button
      className="rounded-md shadow-md h-8 lg:h-10 w-auto p-2 flex items-center justify-center bg-white relative mb-1"
      onClick={() => {
        if (alert.message) {
          dispatch(setAlertDisplay(true));
          if (alert.action !== 'SWITCH_NETWORK') setNotification(false);
        }
      }}
    >
      <FaBell className="fill-baby-blue-dark w-full h-full" />
      {notification && (
        <div className="bg-alert-error rounded-full h-3 w-3 absolute -top-0 -right-1" />
      )}
    </button>
  );
};

export const AccountConnector = ({
  setShow,
}: {
  setShow: (s: boolean) => void;
}) => {
  const { active, account } = useWeb3React();
  const buttonText = active && account ? trimAccount(account) : 'Connect Web3';
  return (
    <StyledButton
      className="pt-1 mb-0 h-full px-8 mx-0 my-0 md:mx-5
        md:text-sm lg:text-base "
      onClick={() => {
        setShow(true);
      }}
    >
      {buttonText}
    </StyledButton>
  );
};
