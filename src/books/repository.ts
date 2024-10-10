import * as booksData from "./books.json";
import { Book } from "./types";

export interface IBookRepository {
  getBookById(id: string): Promise<Book | null>;
  getBooks(): Promise<Book[]>;
}

export class BooksRepository implements IBookRepository {
  private books: Book[] = [];

  constructor() {
    this.books = booksData.books;
  }

  async getBookById(id: string): Promise<Book | null> {
    return this.books.find((book) => book.id === id) || null;
  }

  async getBooks(): Promise<Book[]> {
    return this.books;
  }

  async addBook(book: Book): Promise<void> {
    if (this.books.find((b) => b.id === book.id)) {
      throw new Error("Book already exists");
    }
    this.books.push(book);
  }
}
