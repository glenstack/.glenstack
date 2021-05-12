import { v4 as uuidv4 } from "uuid";

interface UserOptions {
  id: string;
  name: string;
  email: string;
  externals: Record<string, string>;
}
export class User {
  id: string;
  name: string;
  email: string;
  externals: Record<string, string> = {};

  private constructor({
    id,
    name,
    email,
    externals,
  }: { id: string } & UserOptions) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.externals = externals;
  }

  static async create(userOptions: Omit<UserOptions, "id">): Promise<User> {
    const id = uuidv4();
    const user = new User({ ...userOptions, id });
    // TODO: Save
    return user;
  }

  static async load({ id }: { id: string }): Promise<User | undefined> {
    // TODO: Load
    return users.find((user) => user.id === id);
  }
}

const users: User[] = [
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-ignore */
  new User({
    id: "38be66e1-b691-4c19-9509-cb442d5c695e",
    name: "Greg Brimble",
    email: "greg@glenstack.com",
    externals: { "0c02a840-37f0-4b07-a846-482a0ab619a7": "8484333" },
  }),
];
