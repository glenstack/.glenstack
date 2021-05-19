import { FC } from "react";
import { Footer } from "../../components/landing/footer";
import { Header } from "../../components/landing/header";
import { MagicLink } from "../../components/magicLink";

export const NotFound: FC = () => {
  return (
    <>
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 my-36 flex flex-col justify-center mx-auto prose lg:prose-lg xl:prose-xl">
        <h1>404: Not Found</h1>
        <MagicLink href="/">Go Home?</MagicLink>
      </main>
      <Footer />
    </>
  );
};
