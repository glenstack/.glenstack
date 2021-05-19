import { FC } from "react";
import { Footer } from "../../components/landing/footer";
import { Header } from "../../components/landing/header";

export const InternalError: FC = () => {
  return (
    <>
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 my-36 flex flex-col justify-center mx-auto prose lg:prose-lg xl:prose-xl">
        <h1>500: Internal Error</h1>
        <p>The Glenstack team have been alerted.</p>
      </main>
      <Footer />
    </>
  );
};
