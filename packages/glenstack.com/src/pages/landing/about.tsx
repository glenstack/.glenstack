import { FC } from "react";
import { Footer } from "../../components/landing/footer";
import { Header } from "../../components/landing/header";
import { SEO } from "../../components/landing/seo";
import { MagicLink } from "../../components/magicLink";

const faqs = [
  {
    question: "When is Glenstack launching?",
    answer:
      "We're actively building the data platform right now. We're currently hoping to launch in August, 2021, but that's liable to change a little.",
  },
  {
    question: "How much will Glenstack cost?",
    answer:
      "We're still working out exactly how to best price Glenstack, but we're confident that we'll be able to (at least) compete with existing data solutions.",
  },
  {
    question:
      "How are you building Glenstack? What technologies are you using?",
    answer: (
      <>
        Check out our{" "}
        <MagicLink
          href="/blog/how-we-re-building-glenstack"
          className="underline"
        >
          blog post
        </MagicLink>{" "}
        which goes into detail.
      </>
    ),
  },
  {
    question: "How can I find out more?",
    answer: (
      <>
        <MagicLink href="/contact" className="underline">
          Contact us
        </MagicLink>
        , or{" "}
        <MagicLink href="https://discord.gg/F2hV6AXy44" className="underline">
          say "Hi 👋" on Discord
        </MagicLink>
        .
      </>
    ),
  },
];

export const About: FC = () => {
  return (
    <>
      <SEO title="About" />
      <Header />
      <main className="bg-indigo-900">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="lg:max-w-2xl lg:mx-auto lg:text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              About
            </h2>
            <p className="mt-4 text-gray-400">
              Glenstack was founded in Edinburgh, UK, in 2020.
            </p>
          </div>
          <div className="mt-20">
            <dl className="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-10">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="font-semibold text-white">{faq.question}</dt>
                  <dd className="mt-3 text-gray-400">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
