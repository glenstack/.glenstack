import { v4 as uuidv4 } from "uuid";
import { serialize as cookieSerialize } from "cookie";

interface UserOptions {
  id: string;
  name: string;
  email: string;
  externals?: Record<string, string>;
}
export class User {
  id: string;
  name: string;
  email: string;
  externals: Record<string, string>;

  private constructor({
    id,
    name,
    email,
    externals = {},
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

  static async find({ email }: { email: string }): Promise<User | undefined> {
    // TODO: Find
    return users.find((user) => user.email === email);
  }

  async login(): Promise<Response> {
    const headers = new Headers();
    headers.set("Location", "https://glenstack.com/");

    // TODO
    // "Set-Cookie": cookieSerialize("glenstack_accessToken", ),
    headers.append(
      "Set-Cookie",
      cookieSerialize("glenstack_signup", "", {
        secure: true,
        expires: new Date(0),
        sameSite: "strict",
        domain: "glenstack.com",
        path: "/",
      })
    );

    return new Response(null, {
      status: 302,
      headers,
    });
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
