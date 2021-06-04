import { AppProps } from "next/app";
import Head from "next/head";
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn:
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_SENTRY_DSN
      : "",
  release: process.env.NEXT_PUBLIC_VERSION,
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Glenstack</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
