import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { ComponentType } from 'react';
import Navigate from 'src/components/shared/Navigate';
import { useAppSelector } from 'src/redux/store';

type IntrinsicAttributes = EmotionJSX.IntrinsicAttributes;

function WithoutAuth<T extends IntrinsicAttributes>(WrappedComponent: ComponentType<T>) {
  return function ComponentWithoutAuth(props: T) {
    const { refreshToken, userState } = useAppSelector((s) => ({
      refreshToken: s.auth.refreshToken,
      userState: s.user.data,
    }));

    if (!!refreshToken && userState?.role === 'ADMIN') return <Navigate to='/admin' />;
    if (!!refreshToken && userState?.role === 'PM') return <Navigate to='/' />;

    return <WrappedComponent {...props} />;
  };
}

export default WithoutAuth;
