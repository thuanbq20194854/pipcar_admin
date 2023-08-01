import 'antd/dist/reset.css';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import NextNProgress from 'nextjs-progressbar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Loader from 'src/components/loader/Loader';
import { persistor, store } from 'src/redux/store';
import '../styles/globals.css';

const ConfigProvider = dynamic(() => import('src/components/shared/ConfigProvider'), {
  loading: () => <Loader />,
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <NextNProgress color='#0D90F3' options={{ showSpinner: false }} />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConfigProvider>
            <Component {...pageProps} />
          </ConfigProvider>
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
