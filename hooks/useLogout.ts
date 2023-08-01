import { useRouter } from 'next/router';
import { useLogoutMutation } from 'src/redux/query/auth.query';
import useApp from './useApp';

export default function useLogout() {
  const { notification } = useApp();
  const { replace } = useRouter();
  const [mutateLogout, { isLoading }] = useLogoutMutation();

  const handleLogout = () => {
    mutateLogout()
      .unwrap()
      .then(({ message }) => {
        notification.success({ message, placement: 'bottomLeft' });
        replace('/login');
      })
      .catch((err) => {});
  };
  return { isLoadingLogout: isLoading, handleLogout };
}
