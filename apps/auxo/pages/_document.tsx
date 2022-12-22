import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class _Document extends Document {
  render() {
    return (
      <Html className="h-full">
        <Head>
          <link
            rel="preload"
            href="/fonts/Silka/silka-regular.woff2"
            as="font"
            type="font/woff2"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/Silka/silka-light.woff2"
            as="font"
            type="font/woff2"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/Silka/silka-medium.woff2"
            as="font"
            type="font/woff2"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/Silka/silka-bold.woff2"
            as="font"
            type="font/woff2"
            crossOrigin=""
          />
        </Head>
        <body data-theme="auxo" className="h-full">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
