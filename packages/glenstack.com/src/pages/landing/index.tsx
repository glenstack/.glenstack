import { FC } from "react";
import { Header } from "../../components/landing/header";
import { Explainer } from "../../components/landing/explainer";
import { Features } from "../../components/landing/features";
import { Footer } from "../../components/landing/footer";

export const Homepage: FC = () => {
  return (
    <>
      <Header />
      <Explainer />
      <Features />
      <Footer />
    </>
  );
};
