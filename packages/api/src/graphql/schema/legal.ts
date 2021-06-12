import type { Resolvers } from "../__generated__/graphql";
import typeDefs from "./legal.graphql";
import { ONE_DAY } from "./../../utils";

export { typeDefs };
export const resolvers: Resolvers = {
  Query: {
    legal: () => ({}),
  },
  LegalDocuments: {
    privacyPolicy: async (parent, obj, { sentry }) => {
      try {
        // https://www.iubenda.com/en/help/78-privacy-policy-direct-text-embedding-api#full-privacy-policy-embedding
        const response = await fetch(
          `https://www.iubenda.com/api/privacy-policy/${IUBENDA_ID}`,
          { cf: { cacheEverything: true, cacheTtl: ONE_DAY } }
        );
        const { content } = await response.json();

        if (content === undefined) throw new Error(`Undefined Privacy Policy`);
        return content;
      } catch (error) {
        sentry.captureException(error);
        return `<a href="https://www.iubenda.com/privacy-policy/${IUBENDA_ID}" target="_blank">Privacy Policy</a>`;
      }
    },

    termsOfService: async (parent, obj, { sentry }) => {
      try {
        // https://www.iubenda.com/en/help/19253-integrate-terms-and-conditions-on-your-site-and-app#api
        const response = await fetch(
          `https://www.iubenda.com/api/terms-and-conditions/${IUBENDA_ID}`,
          { cf: { cacheEverything: true, cacheTtl: ONE_DAY } }
        );
        const { content } = await response.json();

        if (content === undefined)
          throw new Error("Undefined Terms of Service");
        return content;
      } catch (error) {
        sentry.captureException(error);
        return `<a href="https://www.iubenda.com/terms-and-conditions/${IUBENDA_ID}" target="_blank">Terms of Service</a>`;
      }
    },
  },
};
