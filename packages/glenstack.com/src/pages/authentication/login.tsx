import { FC } from "react";
import { Header } from "../../components/landing/header";
import { SEO } from "../../components/landing/seo";

export const Login: FC = () => {
  return (
    <>
      <SEO title="Sign In" description="Sign in to Glenstack" />
      <Header />
    </>
  );
};
