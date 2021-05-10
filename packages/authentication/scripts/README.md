# Authentication Service Scripts

## `generate_jwt_es512_key.sh`

Generates a key to use to sign and verify JWTs.

### Prerequistes

- `openssl`

  On macOS, install with:

  ```sh
  brew install openssl
  ```

### Usage

**Note: this will change the production signing certificate and therefore invalidate all current sessions!**

`./generate_jwt_es512_key.sh`
