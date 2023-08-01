import { ThemeProvider } from '@emotion/react';
import { App, ConfigProvider as AntdConfigProvider, theme } from 'antd';
import { Suspense } from 'react';
import { useGetCurrentUserQuery } from 'src/redux/query/user.query';
import { useAppSelector } from 'src/redux/store';
import Loader from '../loader/Loader';

type TConfigProviderProps = {
  children: React.ReactNode;
};

const { darkAlgorithm, defaultAlgorithm } = theme;

function ConfigProvider({ children }: TConfigProviderProps) {
  const { mode, colorPrimary, generatedColors } = useAppSelector((s) => s.theme);
  const { refreshToken } = useAppSelector((s) => s.auth);
  const res = useGetCurrentUserQuery(
    { rt: !!refreshToken },
    {
      skip: !refreshToken,
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
    },
  );

  return (
    <Suspense fallback={<Loader />}>
      <AntdConfigProvider
        theme={{
          token: { colorPrimary },
          algorithm: mode === 'dark' ? darkAlgorithm : defaultAlgorithm,
        }}
      >
        <ThemeProvider theme={{ mode, colorPrimary, generatedColors }}>
          <App>{children}</App>
        </ThemeProvider>
      </AntdConfigProvider>
    </Suspense>
  );
}

export default ConfigProvider;
