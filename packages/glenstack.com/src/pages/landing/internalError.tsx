import { FC } from "react";
import { Header } from "../../components/landing/header";

export const InternalError: FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col justify-center mx-auto prose lg:prose-lg xl:prose-xl">
        <h1>500: Internal Error</h1>
        <p>The Glenstack team have been alerted.</p>
      </main>
    </div>
  );
};
