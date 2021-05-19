import { FC } from "react";
import { Footer } from "../../components/landing/footer";
import { Header } from "../../components/landing/header";
import { SEO } from "../../components/landing/seo";

export const About: FC = () => {
  return (
    <>
      <SEO title="About" />
      <Header />
      <Footer />
    </>
  );
};
