/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="next-images" />

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
    template: any;
    script: any;
  }
}

declare module "*.css" {
  export default string;
}
