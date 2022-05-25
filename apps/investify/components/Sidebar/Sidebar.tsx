import { useAppSelector } from '../../hooks';

export default function Sidebar() {
  const { step } = useAppSelector((state) => state.sidebar);

  return <>{step && `Current step: ${step}`}</>;
}
