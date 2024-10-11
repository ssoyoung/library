import { ValidationResult } from "../common/types/CommonTypes";

export function validatePagination(page: number, limit: number): ValidationResult {
    if (isNaN(page) || page <= 0) {
      return { isValid: false, error: "Invalid page number. It must be a positive integer." };
    }
    if (isNaN(limit) || limit <= 0) {
      return { isValid: false, error: "Invalid limit number. It must be a positive integer." };
    }
    return { isValid: true };
  }
  
export function validateSort(sort: string): ValidationResult{
    sort = sort?.toLowerCase();
    if (sort !== "asc" && sort !== "desc") {
        return { isValid: false, error: "Invalid sort value. Allowed values are 'asc' or 'desc'." };
    }
    return { isValid: true };
}