import { faker, seedFaker } from "@/lib/faker";

describe("faker", () => {
  it("produces deterministic values when seeded", () => {
    seedFaker(1);
    const first = faker.commerce.productName();

    seedFaker(1);

    expect(faker.commerce.productName()).toBe(first);
  });
});
