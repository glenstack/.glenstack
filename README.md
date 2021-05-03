# glenstack

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## Rrerequisites

- [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) v0.38.0.

  Install with:

  ```sh
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
  ```

## Getting Started

1. `git clone git@github.com:glenstack/.glenstack.git`

1. `cd .glenstack`

1. `nvm use`

1. `npm i`

## Scripts

Unless otherwise specified, these scripts are run across all packages.

- `npm start`

  Runs everything.

- `npm run lint`

  Checks linting.

- `npm run format`

  Enforces linting.

- `npm test`

  Runs test suite.

- `npm run build`

  Builds artifacts.

- `npm run deploy`

  Builds and deploys artifacts.

- `npm run clean`

  Purges artifacts.
