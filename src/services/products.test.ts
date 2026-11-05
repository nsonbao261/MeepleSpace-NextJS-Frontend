import { getDailyPicks } from "@/services/products";

describe("getDailyPicks", () => {
  it("returns up to four in-stock picks without repeats", () => {
    const picks = getDailyPicks(new Date(2026, 0, 1));

    expect(picks.length).toBeGreaterThan(0);
    expect(picks.length).toBeLessThanOrEqual(4);
    expect(picks.every((pick) => pick.stock > 0)).toBe(true);
    expect(new Set(picks.map((pick) => pick.id)).size).toBe(picks.length);
  });

  it("rotates the picks with the day of year", () => {
    const today = getDailyPicks(new Date(2026, 0, 1));
    const tomorrow = getDailyPicks(new Date(2026, 0, 2));

    expect(tomorrow).not.toEqual(today);
  });
});
