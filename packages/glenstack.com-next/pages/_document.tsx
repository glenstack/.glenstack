import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentProps,
} from "next/document";
import type { ReactElement } from "react";
import { AmpScripts, AmpScriptsManager } from "react-amphtml/setup";
import styles from "styles/output.css";

export default class GlenstackDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const ampScripts = new AmpScripts();
    const { renderPage } = ctx;

    ctx.renderPage = () =>
      renderPage({
        enhanceApp: (App) => (props) =>
          (
            <AmpScriptsManager ampScripts={ampScripts}>
              <App {...props} />
            </AmpScriptsManager>
          ),
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      ampScriptElements: ampScripts.getScriptElements(),
      styles: (
        <>
          <style dangerouslySetInnerHTML={{ __html: styles }} />
          {initialProps.styles}
        </>
      ),
    };
  }

  render() {
    const { ampScriptElements } = this.props as DocumentProps & {
      ampScriptElements: ReactElement;
    };
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="theme-color" content="#161D2E" />
          <link rel="apple-touch-icon" href="/logo192.png" />
          <link rel="manifest" href="/manifest.json" />
          <meta
            name="description"
            content="Create, exchange, and collaborate on data"
          />
          <meta property="og:title" content="Glenstack" />
          <meta property="og:image" content="https://glenstack.com/tile.png" />
          <meta property="og:type" content="website" />
          <meta
            property="og:description"
            content="Create, exchange, and collaborate on data"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@glenstack" />
          <meta name="twitter:creator" content="@glenstack" />
          <meta
            name="twitter:description"
            content="Create, exchange, and collaborate on data"
          />
          <meta name="twitter:image" content="https://glenstack.com/tile.png" />
          {(this.props as any).ampScriptElements}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
