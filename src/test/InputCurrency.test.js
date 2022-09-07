import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import InputCurrency from "../components/bodySwap/currencyManager/InputCurrency";

describe.only("<InputCurrency />", () => {
  const content = {
    getSwapPrice: () => {},
    balance: 0.2,
    symbols: ["", ""],
    symbol: "",
    loading: false,
    spinner: () => {},
    field: 10,
    defaultValue: 10,
    setTokenContract: () => {},
  };

  const renderer = () => {
    return render(<InputCurrency content={content} />);
  };

  beforeEach(() => {});

  it("Getting onBlur Input", () => {
    renderer();
    const onBlurInput = screen.getByPlaceholderText(/Filter by Symbol/i);
    expect(onBlurInput).toBeInTheDocument();
  });
});
