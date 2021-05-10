import { ApolloServer } from "apollo-server";
import { schema } from "../index";

test("server", () => {
  new ApolloServer({ schema }).listen().then(({ url }) => console.log(url));
});
