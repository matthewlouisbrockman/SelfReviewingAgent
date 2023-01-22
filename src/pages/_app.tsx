import { AppProps } from 'next/app';

import '../styles/global.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  // if no window, return null
  if (typeof window === 'undefined') return <> </>;

  return <Component {...pageProps} />;
};

export default MyApp;
