import { render, screen } from "@testing-library/react";

import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders its label", () => {
    render(<Button>Add to cart</Button>);

    expect(screen.getByRole("button", { name: "Add to cart" })).toBeInTheDocument();
  });
});
