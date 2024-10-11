import { validatePagination, validateSort } from "../../validation";

describe("Validation functions", () => {
  describe("validatePagination", () => {
    it("should return isValid true for valid pagination parameters", () => {
      const result = validatePagination(1, 10);
      expect(result.isValid).toBe(true);
    });

    it("should return isValid false for invalid page number", () => {
      const result = validatePagination(0, 10);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Invalid page number. It must be a positive integer.");
    });

    it("should return isValid false for invalid limit number", () => {
      const result = validatePagination(1, -5);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Invalid limit number. It must be a positive integer.");
    });

    it("should return isValid false for non-numeric value", () => {
      const result = validatePagination(NaN, 10);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Invalid page number. It must be a positive integer.");
    });
  });

  describe("validateSort", () => {
    it("should return isValid true for \"asc\" sort value", () => {
      const result = validateSort("asc");
      expect(result.isValid).toBe(true);
    });

    it("should return isValid true for \"desc\" sort value", () => {
      const result = validateSort("desc");
      expect(result.isValid).toBe(true);
    });

    it("should return isValid true for case-insensitive sort values", () => {
      expect(validateSort("ASC").isValid).toBe(true);
      expect(validateSort("DESC").isValid).toBe(true);
    });

    it("should return isValid false for invalid sort value", () => {
      const result = validateSort("InvaLid");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Invalid sort value. Allowed values are 'asc' or 'desc'.");
    });

    it("should return isValid false for empty string value", () => {
      const result = validateSort("");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Invalid sort value. Allowed values are 'asc' or 'desc'.");
    });
  });
});
