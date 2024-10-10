export interface Book {
  id: string;
  title: string;
  author: string;
  publicationYear: number;
}

export type Sort = "asc" | "desc";

export interface GetBooksOptions {
    search?: string;
    sort?: Sort;
    page: number;
    limit: number;
}

export interface PaginatedBooks {
  books: Book[];
  currentPage: number;
  totalPages: number;
  totalBooks: number;
}

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}