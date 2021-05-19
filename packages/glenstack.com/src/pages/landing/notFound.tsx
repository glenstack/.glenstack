import { FC } from "react";
import { Header } from "../../components/landing/header";
import { MagicLink } from "../../components/magicLink";

export const NotFound: FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col justify-center h-screen mx-auto prose lg:prose-lg xl:prose-xl">
        <h1>404: Not Found</h1>
        <MagicLink href="/">Go Home?</MagicLink>
      </main>
    </div>
  );
};
