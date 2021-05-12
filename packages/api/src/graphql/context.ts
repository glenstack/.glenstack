import type { ContextValueMaker } from "@glenstack/cf-workers-graphql";
import type { v4 as uuid } from "uuid";

type User = {
  id: typeof uuid;
  name: string;
  email: string;
  created_at: Date;
};

export type Context = {
  user?: User;
};

export const makeContextValue: ContextValueMaker = async (
  request
): Promise<Context> => {
  console.log(request);
  return {};
};
