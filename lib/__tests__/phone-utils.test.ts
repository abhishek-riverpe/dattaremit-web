import { stripPhonePrefix } from "../phone-utils";

describe("stripPhonePrefix", () => {
  it("removes the exact prefix when it matches", () => {
    expect(stripPhonePrefix("+12025551234", "+1")).toBe("2025551234");
  });

  it("removes a multi-digit prefix when it matches", () => {
    expect(stripPhonePrefix("+919876543210", "+91")).toBe("9876543210");
  });

  it("falls back to stripping +<digits> (greedy, up to 4) when prefix doesn't match", () => {
    // user typed +44 but prefix state still says +1; the regex greedily
    // takes up to 4 digits so this is best-effort, not exact.
    expect(stripPhonePrefix("+44 7700900123", "+1")).toBe(" 7700900123");
  });

  it("strips +<digits> for a 1-digit country code in the fallback path", () => {
    expect(stripPhonePrefix("+12025551234", "+44")).toBe("5551234");
  });

  it("returns empty string when input is just the prefix", () => {
    expect(stripPhonePrefix("+1", "+1")).toBe("");
  });

  it("returns input unchanged when no leading + is present", () => {
    expect(stripPhonePrefix("2025551234", "+1")).toBe("2025551234");
  });
});
