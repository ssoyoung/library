import { Sort } from "../common/types/CommonTypes";

export interface Book {
  id: string;
  title: string;
  author: string;
  publicationYear: number;
}

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
