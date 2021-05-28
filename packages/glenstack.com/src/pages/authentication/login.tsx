import { FC } from "react";
import { Redirect } from "react-router";
import { SEO } from "../../components/landing/seo";

export const Login: FC = () => {
  return (
    <>
      <SEO title="Sign In" description="Sign in to Glenstack" />
      <Redirect to="/waitlist" />
    </>
  );
};
