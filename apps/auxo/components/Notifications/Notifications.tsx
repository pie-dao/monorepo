import { Id, toast, ToastContainer } from 'react-toastify';
import Trans from 'next-translate/Trans';
import { XIcon } from '@heroicons/react/solid';

export const pendingNotification = ({
  title,
  subtitle,
  id,
}: {
  title?: string;
  subtitle?: string;
  id: Id;
}) =>
  toast(
    <>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-900">
          <Trans
            i18nKey={id ? `${id}Pending` : 'Pending...'}
            ns={'notifications'}
          />
        </p>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">
            <Trans i18nKey={subtitle} ns={'notifications'} />
          </p>
        )}
      </div>
    </>,
    {
      type: 'info',
      autoClose: false,
      toastId: `${id}Pending`,
    },
  );

export const NotificationDisplay = () => (
  <ToastContainer
    position="bottom-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    closeButton={CloseButton}
  />
);

export const CloseButton = ({ closeToast }) => (
  <XIcon className="w-5 h-5 text-sub-dark" onClick={closeToast} />
);

export const depositSuccessNotification = () => {
  toast.dismiss();
  toast('Deposit Successful', { type: 'success' });
};

export const approvalSuccessNotification = () => {
  toast.dismiss();
  toast('Approval Successful!', { type: 'success' });
};

export const errorNotification = (err: string) => {
  toast.dismiss();
  toast(`Deposit Failed... ${err}`, { type: 'error' });
};

export const walletSubmittedNotification = () => toast('Transaction approved!');

export const successNotificationUpdate = (toastId: Id) => {
  toast.dismiss(`${toastId}Pending`);
  toast(
    <>
      <div className="ml-3 flex-1" data-cy={`${toastId}Success`}>
        <p className="text-sm font-medium text-gray-900">
          <Trans
            i18nKey={toastId ? `${toastId}Success` : 'Success!'}
            ns={'notifications'}
          />
        </p>
      </div>
    </>,
    {
      type: 'success',
      autoClose: 10000,
      toastId: `${toastId}Success`,
    },
  );
};

export const errorNotificationUpdate = (toastId: Id, message: string) => {
  toast.dismiss(`${toastId}Pending`);
  toast(
    <>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-900">
          <Trans i18nKey={message || 'defaultError'} ns={'notifications'} />
        </p>
      </div>
    </>,
    {
      type: 'error',
      autoClose: 10000,
      toastId: `${toastId}Error`,
    },
  );
};

/**
 * To preserve backward comptability, we create a new notification for errors that
 * keys by id instead of message. In the future, we should merge both functions and just
 * use the id as the key to ensure i81n is working properly.
 */
export const errorNotificationUpdateById = (toastId: Id) => {
  toast.dismiss(`${toastId}Pending`);
  toast(
    <>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-900">
          <Trans
            i18nKey={toastId ? `${toastId}Error` : 'defaultError'}
            ns={'notifications'}
          />
        </p>
      </div>
    </>,
    {
      type: 'error',
      autoClose: 10000,
      toastId: `${toastId}Error`,
    },
  );
};
