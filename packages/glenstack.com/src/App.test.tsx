import { render, screen } from "@testing-library/react";
import { App } from "./App";

test("renders the word 'Glenstack'", () => {
  render(<App />);
  const glenstackElements = screen.getAllByText(/Glenstack/i);
  expect(glenstackElements.length).toBeGreaterThan(0);
});
