import { FC } from "react";
import { Header } from "../../components/landing/header";
import { Explainer } from "../../components/landing/explainer";
import { Features } from "../../components/landing/features";
import { FooterCTA } from "../../components/landing/footerCTA";
import { Footer } from "../../components/landing/footer";

export const Homepage: FC = () => {
  return (
    <>
      <Header />
      <Explainer />
      <Features />
      {/* <FooterCTA /> */}
      <Footer />
    </>
  );
};
