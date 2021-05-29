# Status

The status page for Glenstack. It lives at https://status.glenstack.com/.

## Scripts

- `npm run start`

  Starts a local version of the API with `wrangler dev` which auto-updates when a change is detected. It is available at [http://127.0.0.1:8787/](http://127.0.0.1:8787/).

  If for some reason you need or want it, you can also elect to run `npm run start:https` which serves this API at [https://127.0.0.1:8787/](https://127.0.0.1:8787/) using a self-signed certificate. You'll need `--insecure` if using cURL, and your browser might throw a warning.

- `npm run test:watch`

  Runs Jest interactively, defaulting to only checking files which have changed since the last commit.

- `npm run build`

  Creates a production bundle ([`./dist/index.js`](./dist/index.js)) ready to deploy to Cloudflare Workers. This is automatically run in [GitHub Actions](../../.github/workflows/deploy.yml), so you shouldn't ever need to run this manually.

- `npm run validate`

  Automatically run when before making a git commit, this script ensures the project is in a good state by running the following:

  - `npm run lint`

    Checks linting with ESLint (check out the [Recommended Extensions](../../README.md#recommended-extensions)).

  - `npm run check-types`

    Checks typings with TypeScript.

  - `npm run check-format`

    Checks formatting with Prettier (check out the [Recommended Extensions](../../README.md#recommended-extensions)).

  - `npm run build`

    Described above.
