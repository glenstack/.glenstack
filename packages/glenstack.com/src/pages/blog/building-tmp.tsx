import { FC } from "react";
import { SEO } from "../../components/landing/seo";
import { MagicLink } from "../../components/magicLink";
import banner from "./how-we-re-building-glenstack/banner.jpg";
import { Latency } from "./how-we-re-building-glenstack/latency";

export const HowWereBuildingGlenstack: FC = () => {
  return (
    <>
      <SEO
        title="How We're Building Glenstack"
        description="Glenstack is a production-ready, modern data platform. And as such, we are embracing the latest and greatest technologies as we deliver our application quickly, securely, and with the features our customers demand."
        authorName="Greg Brimble"
        date="2021-05-19"
        year={2021}
        image={banner}
      />
      <div className="relative py-16 bg-white overflow-hidden">
        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
          <div
            className="relative h-full text-lg max-w-prose mx-auto"
            aria-hidden="true"
          >
            <svg
              className="absolute top-12 left-full transform translate-x-32"
              width={404}
              height={384}
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={384}
                fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)"
              />
            </svg>
            <svg
              className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32"
              width={404}
              height={384}
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={384}
                fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)"
              />
            </svg>
            <svg
              className="absolute bottom-12 left-full transform translate-x-32"
              width={404}
              height={384}
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="d3eb07ae-5182-43e6-857d-35c643af9034"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={384}
                fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)"
              />
            </svg>
          </div>
        </div>
        <main className="relative px-4 sm:px-6 lg:px-8">
          <div className="text-lg max-w-prose mx-auto">
            <span className="block text-base text-center text-pink-600 font-semibold tracking-wide uppercase">
              Writing About
            </span>
            <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              How We're Building Glenstack
            </span>
            <p className="mt-8 text-xl text-gray-500 leading-8">
              Glenstack is a production-ready, modern data platform. And as
              such, we are embracing the latest and greatest technologies as we
              deliver our application quickly, securely, and with the features
              our customers demand.
            </p>
            <p className="mt-6 prose prose-indigo prose-lg xl:prose-xl text-gray-500 mx-auto">
              <figure>
                <img
                  className="w-full rounded-lg"
                  src={banner}
                  alt=""
                  width="1310"
                  height="873"
                />
                <figcaption className="text-right">
                  Photo by{" "}
                  <MagicLink href="https://unsplash.com/@nasa">NASA</MagicLink>{" "}
                  on{" "}
                  <MagicLink href="https://unsplash.com/">Unsplash</MagicLink>.
                </figcaption>
              </figure>
            </p>
          </div>
          <article className="mt-6 prose prose-indigo lg:prose-lg xl:proxe-xl text-gray-500 mx-auto">
            <h2>Motivations</h2>
            <h3>Speed</h3>
            <p>
              We want Glenstack to be performant for users, regardless of where
              they are located. To us, this means we must be distributed. We
              can't have a single server in <code>us-east-1</code> because every
              single user would have to wait for a round-trip request to
              Virginia which is a significant delay for most of the world.
              Instead, we have multiple points-of-presence (PoPs) around the
              world which are each capable of serving Glenstack, more often than
              not, from the same country as the user.
            </p>
            <p>
              No distributed provider has more PoPs and faster performance than{" "}
              <MagicLink href="https://workers.cloudflare.com/">
                Cloudflare Workers
              </MagicLink>
              , which lets us be in 200 locations around the world, and within
              100 milliseconds of 99% of internet users.
            </p>
            <Latency />
            <p>
              This serverless architecture lets us compete with (and often
              outperform) the performance of many traditional database
              providers, all while also eliminating the single point of failure
              that a single cluster presents. We are entirely convinced that it
              is the future of not just application hosting but data handling as
              well, and that serverless environments will continue to see
              increased usage throughout the technology industry.
            </p>
            <h3>Security</h3>
            <p>
              We make every effort to ensure that Glenstack is secure. And we
              like to start with the worst-case scenario, disaster-recovery:
              what happens if our infrastructure fails.
            </p>
            <p>
              As already stated, the Glenstack application is serverless and
              distributed. So if one PoP is unreachable, your traffic is
              automatically re-routed to the next available data center. If all
              200 PoPs fail, we're in trouble, and this would constitute a truly
              global, internet-level event. Thankfully however, Cloudflare offer
              a 100% uptime SLA, and we're able to do the same for Glenstack
              customers. Please{" "}
              <MagicLink href="/contact">contact us</MagicLink> if you are
              interested in enterprise contracts.
            </p>
            <p>
              Data hosted on Glenstack is also guaranteed. We provide
              (C)onsistent and (P)artition-tolerant storage (of the{" "}
              <MagicLink href="https://en.wikipedia.org/wiki/CAP_theorem">
                CAP theorem
              </MagicLink>
              ) in order to support the full set of{" "}
              <MagicLink href="https://en.wikipedia.org/wiki/ACID">
                ACID
              </MagicLink>{" "}
              properties for transactions.
            </p>
            <p>
              We have multiple layers of redundancy in place to ensure that even
              if a single data node is unreachable, we are able to failover to
              another location, with the same data available. We also take
              routine off-site backups for even more peace-of-mind.
            </p>
            <p>
              We're exploring end-to-end (E2E) encryption and would also love to{" "}
              <MagicLink href="/contact">hear from you</MagicLink> if you have a
              compelling use-case. In the meantime however, all data is
              encrypted in transit, at rest, and when backed up. Again, please{" "}
              <MagicLink href="/contact">reach out</MagicLink> if there's a
              particular certification your business needs.
            </p>
            <h3>Functionality</h3>
            <p>
              Glenstack sees data compliance as one of the most interesting and
              rapidly evolving challenges for the technology industry. The
              General Data Protection Regulation (EU GDPR) is frankly old news,
              but it remains a difficult problem for thousands of organizations
              inside and outside of the European Union. Complex legislation is
              continually being drafted by governments around the world, and
              it's only going to get harder for businesses to stay compliant.
            </p>
            <p>
              Fortunately, Glenstack has data compliance built-in. There's no
              need to set up a specialized EU cluster and manage the overhead of
              synchronizing migrations. With Glenstack, you simply tag a data
              instance as belonging to a particular jurisdiction, and we
              guarantee that we'll never store or process that instance outside
              of that border. Personally identifiable information (PII) stays
              close to the individual, which has the added benefit of decreasing
              their latency!
            </p>
            <p>
              With compliance sorted, you can focus on the stuff that matters:
              your data. Glenstack offers a suite of tools to help make you
              productive:
            </p>
            <ul>
              <li>an easy-to-use no-code editor,</li>
              <li>
                collaborative workflows for both internal and external use,
              </li>
              <li>version control,</li>
              <li>
                and most importantly, an incredibly scalable, low latency,
                automatic GraphQL API.
              </li>
            </ul>
            <p>
              Read more about our features on{" "}
              <a href="/#features">our landing page</a>.
            </p>
            <hr />
            <h2>The Specifics of our System Design</h2>
            <p>
              For those wanting more detail, this section delves into some
              specifics about the technologies we're using to build Glenstack.
              If we don't cover something here, or if you have any other
              questions, please{" "}
              <MagicLink href="/contact">send us a message</MagicLink>, and we'd
              seriously love to chat to you more.
            </p>
            <h3>Data</h3>
            <p>
              We use a combination of Cloudflare's{" "}
              <MagicLink href="https://www.cloudflare.com/en-gb/products/workers-kv/">
                Workers KV
              </MagicLink>{" "}
              and{" "}
              <MagicLink href="https://blog.cloudflare.com/introducing-workers-durable-objects/">
                Durable Objects
              </MagicLink>
              , as well as{" "}
              <MagicLink href="https://fauna.com/">Fauna</MagicLink>, for
              hosting various Glenstack data. We support the full set of ACID
              properties and a complete transaction environment enabling you to
              build pretty much anything on top of Glenstack.
            </p>
            <h3>Payments</h3>
            <p>
              Leaving it to the industry-trusted experts, we use{" "}
              <MagicLink href="https://stripe.com/en-gb">Stripe</MagicLink> to
              handle payment transactions. They securely hold all sensitive
              information such as credit card numbers and bank details. In fact,
              we never even see this information—it goes straight to Stripe.
            </p>
            <h3>Authorization</h3>
            <p>
              With custom needs, we built our own authorization service which
              issues{" "}
              <MagicLink href="https://datatracker.ietf.org/doc/html/rfc7519">
                JSON Web Tokens (JWTs)
              </MagicLink>{" "}
              as{" "}
              <MagicLink href="https://datatracker.ietf.org/doc/html/rfc6749">
                OAuth2
              </MagicLink>{" "}
              Access Tokens. We act as both a consumer (for social login) and
              provider (for providing developers access to our{" "}
              <MagicLink href="#API">API</MagicLink>).
            </p>
            <h3 id="API">API</h3>
            <p>
              With support for massive datasets, Glenstack has to be able to
              efficiently respond to API requests. We use{" "}
              <MagicLink href="https://spec.graphql.org/June2018/">
                GraphQL
              </MagicLink>{" "}
              to allow users to specify exactly the data they require, and also
              navigate the complex relationships that can appear when working
              with embedded data.
            </p>
            <h3>Front-end</h3>
            <p>
              Finally, the Glenstack front-end is just a simple{" "}
              <MagicLink href="https://reactjs.org/">React</MagicLink>{" "}
              application. We use{" "}
              <MagicLink href="https://tailwindcss.com/">
                Tailwind CSS
              </MagicLink>{" "}
              and some{" "}
              <MagicLink href="https://tailwindui.com/">Tailwind UI</MagicLink>{" "}
              components to rapidly build out our UI, and we consume our{" "}
              <MagicLink href="#API">API</MagicLink> like any other developer
              using Glenstack. This{" "}
              <MagicLink href="https://en.wikipedia.org/wiki/Eating_your_own_dog_food">
                'dog-fooding'
              </MagicLink>{" "}
              helps us to better understand what developers need from Glenstack
              in order to build their apps.
            </p>
            <hr />
            <p>
              Glenstack will be launching later this winter, 2021. Please
              consider{" "}
              <MagicLink href="/waitlist">joining our waitlist</MagicLink> or{" "}
              <MagicLink href="/contact">getting in touch</MagicLink> if you
              have any questions. We're so excited for you to see what we've
              been building, and we hope Glenstack can help you to create,
              exchange and collaborate on data soon!
            </p>
          </article>
        </main>
      </div>
    </>
  );
};
