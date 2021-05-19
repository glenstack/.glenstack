import { FC } from "react";
import { Header } from "../../components/landing/header";
import { SEO } from "../../components/landing/seo";

export const WaitList: FC = () => {
  return (
    <>
      <SEO
        title="Join Waitlist"
        description="Join the Glenstack Waitlist before we launch in Summer, 2021."
      />
      <Header />
    </>
  );
};
