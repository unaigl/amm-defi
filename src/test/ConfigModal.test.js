import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { prettyDOM } from "@testing-library/dom";
import ConfigModal from "../components/bodySwap/ConfigModal";

describe("<ConfigModal />", () => {
  const content = {
    onClose: () => {},
    slippageAmount: 0.2,
    setSlippageAmount: () => {},
    deadlineMinutes: 10,
    setDeadlineMinutes: () => {},
  };

  const renderer = () => {
    return render(<ConfigModal content={content} />);
  };

  beforeEach(() => {});

  it("Slippage input DOM element", () => {
    renderer();
    const modalBody = screen.queryByRole(/dialog/i);
    expect(modalBody).toBeInTheDocument();
  });

  it("Slippage amount is changed by user", () => {
    renderer();
    const slippageInput = screen.getByPlaceholderText("1.0%");
    // expect(slippageInput).toBeInTheDocument();
    // console.log("input", prettyDOM(slippageInput));

    console.log("slippageAmount", 1);
    slippageInput.placeholder = 1;
    console.log("slippageAmount", 1);
    // expect(newValue).not.toEqual();
  });
});
