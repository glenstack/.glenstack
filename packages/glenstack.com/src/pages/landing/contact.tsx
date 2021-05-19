import { FC } from "react";
import { Header } from "../../components/landing/header";
import { SEO } from "../../components/landing/seo";

export const Contact: FC = () => {
  return (
    <>
      <SEO title="Contact" description="Contact the Glenstack team." />
      <Header />
    </>
  );
};
