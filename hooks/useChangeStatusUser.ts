import { useBlockUserByIdMutation, useUnBlockUserByIdMutation } from 'src/redux/query/user.query';
import useApp from './useApp';
function useChangeStatusUser() {
  const { message } = useApp();
  const [blockUser, { isLoading: blockUserLoading }] = useBlockUserByIdMutation();
  const [unBlockUser, { isLoading: unBlockUserLoading }] = useUnBlockUserByIdMutation();

  const handleUnlock = (userId: string) => {
    unBlockUser(userId)
      .unwrap()
      .then((res) => {
        message.success(res.message);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  const handleLock = (userId: string) => {
    blockUser(userId)
      .unwrap()
      .then((res) => {
        message.success(res.message);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  const handleChangeUserStatus = (userId: string, status: string) => {
    if (status === 'lock') handleLock(userId);
    else handleUnlock(userId);
  };
  return {
    handleChangeUserStatus,
    blockUserLoading,
    unBlockUserLoading,
  };
}

export default useChangeStatusUser;
