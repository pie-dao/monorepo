import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  AlertTypes,
  AppState,
  clearAlert,
  setAlert,
  setAlertDisplay,
} from '../../store/app/app.slice';
import { RiCloseCircleFill } from 'react-icons/ri';
import LoadingSpinner from '../UI/loadingSpinner';
import { chainMap, changeNetwork } from '../../utils/networks';
import { useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { SetStateType } from '../../types/utilities';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../../connectors';
import { ChainAndLogo } from '../UI/networkDropdown';

const alertColor = (type: AlertTypes) => {
  switch (type) {
    case 'SUCCESS': {
      return 'bg-alert-success';
    }
    case 'PENDING': {
      return 'bg-alert-pending';
    }
    case 'ERROR': {
      return 'bg-alert-error';
    }
    default: {
      return 'bg-alert-error';
    }
  }
};

function SwitchNetworkButton({
  setShow,
}: {
  show: boolean;
  setShow: SetStateType<boolean>;
}) {
  return (
    <button
      className="mx-4 text-white border-2 border-red-300 rounded-lg px-3 hover:bg-red-300 hover:text-alert-error"
      onClick={() => {
        setShow(true);
      }}
    >
      Switch Network
    </button>
  );
}

function ActionButton({
  alert,
  action,
}: {
  alert: AppState['alert'];
  action: { state: boolean; setter: SetStateType<boolean> };
}) {
  switch (alert.action) {
    case 'SWITCH_NETWORK': {
      return (
        <SwitchNetworkButton setShow={action.setter} show={action.state} />
      );
    }
    default: {
      return <></>;
    }
  }
}

export function NetworkSwitchModal({
  show,
  setShow,
}: {
  show: boolean;
  setShow: SetStateType<boolean>;
}) {
  const { activate } = useWeb3React();
  function closeModal() {
    setShow(false);
  }
  const dispatch = useAppDispatch();
  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Choose a network
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Please ensure Metamask is connected to switch networks via
                    the application. Alternatively, use a browser extension.
                  </p>
                </div>
                <div className="pt-3">
                  {Object.entries(chainMap).map(([id, chain]) => (
                    <button
                      key={id}
                      onClick={() => {
                        changeNetwork({ chainId: Number(id) })
                          .then(() => {
                            setShow(false);
                            dispatch(clearAlert());
                            activate(injected);
                          })
                          .catch(() =>
                            dispatch(
                              setAlert({
                                type: 'ERROR',
                                message: 'Problem Switching Networks',
                              }),
                            ),
                          );
                      }}
                      className="hover:bg-baby-blue-light hover:text-baby-blue-dark text-gray-700
                        flex justify-between rounded-md items-center w-full px-2 py-2 my-1 text-sm"
                    >
                      <ChainAndLogo chain={chain} />
                    </button>
                  ))}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

function AlertMessage(): JSX.Element {
  const alert = useAppSelector((state) => state.app.alert);
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // pending TX should show for duration
    if (alert.type === 'PENDING') return;
    const timeout = setTimeout(() => {
      dispatch(setAlertDisplay(false));
    }, 4000);
    return () => {
      clearTimeout(timeout);
    };
  }, [alert, dispatch]);

  return (
    <>
      <NetworkSwitchModal show={showModal} setShow={setShowModal} />
      <div
        className={`
        ${alert.show ? 'opacity-100 z-10' : 'opacity-0 -z-10'}
          transition ease-in-out shadow-lg
          absolute flex justify-center w-full
        `}
      >
        <div
          className={`${alertColor(alert.type)} 
          py-2 md:py-1 flex flex-wrap  
          justify-center rounded-lg w-full items-center`}
        >
          <p className="text-white mr-2 m-1 sm:m-0">{alert.message}</p>
          {alert.type === 'PENDING' && (
            <span className="mx-2">
              <LoadingSpinner
                spinnerClass="fill-white"
                className="text-white mx-2"
              />
            </span>
          )}
          {alert.action && (
            <ActionButton
              alert={alert}
              action={{ state: showModal, setter: setShowModal }}
            />
          )}
          <button
            onClick={() => {
              dispatch(setAlertDisplay(false));
            }}
          >
            <RiCloseCircleFill className="ml-2" color="white" />
          </button>
        </div>
      </div>
    </>
  );
}

export default AlertMessage;
