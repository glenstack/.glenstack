import { FC } from "react";
import { Footer } from "../../components/landing/footer";
import { Header } from "../../components/landing/header";
import { SEO } from "../../components/landing/seo";
import { MagicLink } from "../../components/magicLink";

export const Contact: FC = () => {
  return (
    <>
      <SEO title="Contact" description="Contact the Glenstack team." />
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 my-36 flex flex-col justify-center mx-auto prose lg:prose-lg xl:prose-xl">
        <h1>Coming Soon!</h1>
        <p>We'll be ready for enquires shortly.</p>
        <p>
          In the meantime, why not{" "}
          <MagicLink href="https://discord.gg/F2hV6AXy44">
            say "Hi 👋" in our Discord
          </MagicLink>
          ?
        </p>
      </main>
      <Footer />
    </>
  );
};
