import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { ComponentType } from 'react';
import PMLayout from 'src/components/layout/PMLayout';
import Navigate from 'src/components/shared/Navigate';
import { useAppSelector } from 'src/redux/store';

type IntrinsicAttributes = EmotionJSX.IntrinsicAttributes;

function WithAuth<T extends IntrinsicAttributes>(WrappedComponent: ComponentType<T>) {
  return function ComponentWithAuth(props: T) {
    const { refreshToken, userState } = useAppSelector((s) => ({
      refreshToken: s.auth.refreshToken,
      userState: s.user.data,
    }));

    if (!refreshToken || userState?.role !== 'PM') return <Navigate to='/login' />;

    return (
      <PMLayout>
        <WrappedComponent {...props} />
      </PMLayout>
    );
  };
}

export default WithAuth;
