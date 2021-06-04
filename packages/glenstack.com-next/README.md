# glenstack.com

A [Next.js](https://nextjs.org/) app for the front-end of Glenstack. It lives at https://glenstack.com/.

## Scripts

- `npm run start`

  Starts a local, auto-hot-reloading, version of the front-end available at [http://localhost:3000/](http://localhost:3000/).

- `npm run test:watch`

  TODO

  Runs Jest interactively, defaulting to only checking files which have changed since the last commit.

- `npm run build`

  Creates a production bundle ([`./out`](./out)) ready to deploy. This is automatically run in [GitHub Actions](../../.github/workflows/deploy.yml), so you shouldn't ever need to run this manually.

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
