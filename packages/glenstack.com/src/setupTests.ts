/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import "@testing-library/jest-dom";

window.scrollTo = (x, y) => {
  document.documentElement.scrollTop = y;
};
