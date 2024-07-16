import { expect, test, vi } from "vitest";
import Login from "./page";
import { fireEvent, render, screen } from "@testing-library/react";

vi.mock("react-dom", () => ({
  useFormState: () => [{}, '/action'],
  useFormStatus: () => ({ pending: false }),
}));

test("Test login page", async () => {
  render(<Login />);
  const email = screen.getByLabelText("Email");
  const password = screen.getByLabelText("Password");
  expect(email).toBeDefined()
  expect(password).toBeDefined()
});

vi.clearAllMocks();
vi.mock('react-dom', () => ({
  useFormState: () => [{email: true}, '/action'],
  useFormStatus: () => ({ pending: true }),}))

test("Test Errors", () => {
  render(<Login />);
  const email = screen.getAllByText("Email not found");
  const loggingIn = screen.getAllByText("Logging in...");
  expect(email).toBeDefined();
  expect(loggingIn).toBeDefined();
})
