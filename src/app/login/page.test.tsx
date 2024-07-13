import { expect, test, vi } from "vitest";
import Login from "./page";
import { fireEvent, render, screen } from "@testing-library/react";

vi.mock("react-dom", () => ({
  useFormState: () => [{}, '/action'],
  useFormStatus: () => ({ pending: false }),
}));

test("Check login page", async () => {
  render(<Login />);
  const email = screen.getByLabelText("Email");
  const password = screen.getByLabelText("Password");
  fireEvent.change(email, { target: { value: "some@email.com" } });
  fireEvent.change(password, { target: { value: "password" } });
  fireEvent.keyDown(email, { key: "Enter", code: "Enter" });  
});
