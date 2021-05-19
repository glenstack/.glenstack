import { FC } from "react";
import { Footer } from "../../components/landing/footer";
import { Header } from "../../components/landing/header";
import { MagicLink } from "../../components/magicLink";

export const MethodNotAllowed: FC = () => {
  return (
    <>
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 my-36 flex flex-col justify-center mx-auto prose lg:prose-lg xl:prose-xl">
        <h1>405: Method Not Allowed</h1>
        <p>
          Any action you took has not been saved. Please try again.{" "}
          <MagicLink href="/">Go Home?</MagicLink>
        </p>
      </main>
      <Footer />
    </>
  );
};
