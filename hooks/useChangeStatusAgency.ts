import { useBlockAgencyMutation, useUnBlockAgencyMutation } from 'src/redux/query/agency.query';
import useApp from './useApp';
function useChangeStatusAgency() {
  const { message } = useApp();
  const [block, { isLoading: blockLoading }] = useBlockAgencyMutation();
  const [unBlock, { isLoading: unBlockLoading }] = useUnBlockAgencyMutation();

  const handleUnlock = (userId: string) => {
    unBlock(userId)
      .unwrap()
      .then((res) => {
        message.success(res.message);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  const handleLock = (userId: string) => {
    block(userId)
      .unwrap()
      .then((res) => {
        message.success(res.message);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  const handleChangeStatus = (userId: string, status: string) => {
    if (status === 'lock') handleLock(userId);
    else handleUnlock(userId);
  };
  return {
    handleChangeStatus,
    blockLoading,
    unBlockLoading,
  };
}

export default useChangeStatusAgency;
