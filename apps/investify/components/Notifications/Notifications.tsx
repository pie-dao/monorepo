import { Id, toast, ToastContainer, TypeOptions } from 'react-toastify';
import Trans from 'next-translate/Trans';

export const infoNotification = ({
  title,
  subtitle,
  id,
  type,
}: {
  title: string;
  subtitle?: string;
  id?: string | number;
  type?: TypeOptions;
}) =>
  toast(
    <>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-900">
          <Trans i18nKey={title} />
        </p>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">
            <Trans i18nKey={subtitle} />
          </p>
        )}
      </div>
    </>,
    {
      type: type ?? 'default',
      autoClose: 10_000,
      toastId: id ?? title,
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
  />
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

export const successNotificationUpdate = (toastId: Id) =>
  toast.update(toastId, {
    render: Trans({ i18nKey: `${toastId}Success` }),
    type: toast.TYPE.SUCCESS,
    autoClose: 5000,
  });
