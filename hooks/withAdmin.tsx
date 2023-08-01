import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { ComponentType } from 'react';
import AdminLayout from 'src/components/layout/AdminLayout';
import Navigate from 'src/components/shared/Navigate';
import { useAppSelector } from 'src/redux/store';

type IntrinsicAttributes = EmotionJSX.IntrinsicAttributes;

function WithAdmin<T extends IntrinsicAttributes>(WrappedComponent: ComponentType<T>) {
  return function ComponentWithAdmin(props: T) {
    const { refreshToken, userState } = useAppSelector((s) => ({
      refreshToken: s.auth.refreshToken,
      userState: s.user.data,
    }));

    if (!refreshToken || userState?.role !== 'ADMIN') return <Navigate to='/login' />;

    return (
      <AdminLayout>
        <WrappedComponent {...props} />
      </AdminLayout>
    );
  };
}

export default WithAdmin;
