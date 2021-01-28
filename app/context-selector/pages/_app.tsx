import * as React from 'react';
import type { AppProps } from 'next/app';
// but, how do we get this to be dynamic?
import '@formik/app-shared/src/styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
