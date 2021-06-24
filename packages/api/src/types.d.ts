declare const FAUNA_ADMIN_KEY: string;
declare const SENTRY_DSN: string;
declare const VERSION: string;
declare const IUBENDA_ID: string;
declare const ENVIRONMENT: "production" | "development";

declare module "*.graphql" {
  import { DocumentNode } from "graphql";
  const Schema: DocumentNode;

  export default Schema;
}
