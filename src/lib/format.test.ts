import { formatDate, formatDateTime, formatVnd } from "@/lib/format";

describe("format", () => {
  it("formats dates with the default pattern", () => {
    expect(formatDate(new Date(2026, 0, 2))).toBe("02/01/2026");
  });

  it("formats date-times with the default pattern", () => {
    expect(formatDateTime(new Date(2026, 0, 2, 15, 4))).toBe("02/01/2026 15:04");
  });

  it("formats VND amounts", () => {
    expect(formatVnd(250000)).toContain("250.000");
  });
});
