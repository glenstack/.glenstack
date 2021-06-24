import { GraphQLResolveInfo } from "graphql";
import Toucan from "toucan-js";
import type { v4 as uuid } from "uuid";

type User = {
  id: typeof uuid;
  name: string;
  email: string;
  created_at: Date;
};

export type Context = {
  user?: User;
  sentry: Toucan;
  things?: number;
};

export const makeContextValue = async (
  request: Request,
  sentry: Toucan
): Promise<Context> => {
  return { sentry, things: 5 };
};

export interface Resolver<Return, Arguments = Record<string, unknown>> {
  (obj: Arguments, context: Context, info: GraphQLResolveInfo):
    | Promise<Return>
    | Return;
}
