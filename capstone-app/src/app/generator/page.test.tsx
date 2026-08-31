import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GeneratorPage from "./page";

describe("GeneratorPage", () => {
  it("keeps Generate disabled until name and role are filled", async () => {
    render(<GeneratorPage />);
    const btn = screen.getByRole("button", { name: /generate bio/i });
    expect(btn).toBeDisabled();

    await userEvent.type(screen.getByLabelText(/name/i), "A");
    await userEvent.type(screen.getByLabelText(/role/i), "B");
    expect(btn).toBeEnabled();
  });
});