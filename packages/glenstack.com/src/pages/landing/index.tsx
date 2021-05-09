import { FC } from "react";
import { Header } from "../../components/landing/header";
import { Features } from "../../components/landing/features";
import { Footer } from "../../components/landing/footer";

export const Homepage: FC = () => {
  return (
    <>
      <Header />
      <Features />
      <Footer />
    </>
  );
};
