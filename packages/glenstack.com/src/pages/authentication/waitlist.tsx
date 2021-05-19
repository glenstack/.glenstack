import { FC } from "react";
import { Footer } from "../../components/landing/footer";
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
      <main>
        <form method="POST" action="https://auth.glenstack.com/waitlist">
          <input type="email"></input>
        </form>
      </main>
      <Footer />
    </>
  );
};
