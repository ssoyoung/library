import { IBookRepository } from "./repository";
import { Book, GetBooksOptions, PaginatedBooks } from "./types";

export class BooksService {
  private booksRepository: IBookRepository;
  constructor(booksRepository: IBookRepository) {
    this.booksRepository = booksRepository;
  }

  public async getBooks(options: GetBooksOptions): Promise<PaginatedBooks> {

    let books :Book[] = await this.booksRepository.getBooks();

     // Filter by search term in title or author
    if(options.search) {
        // case insenstivie
        const keyword = (options!.search).toLowerCase();
        books = books.filter((book) => book.author.toLowerCase().includes(keyword) || book.title.toLowerCase().includes(keyword));
    }

    // Sort books by title
    if (options.sort) {
        books = (options.sort === "asc") ? books.sort((a,b) => a.title.localeCompare(b.title)): books.sort((a,b) => b.title.localeCompare(a.title));
    }

    // Calculate pagination
    const totalBooks = books.length;
    const totalPages = Math.ceil(totalBooks / options.limit!);
    const startIndex = (options.page! - 1) * options.limit!;
    const endIndex = startIndex + options.limit!;
    const paginatedBooks = books.slice(startIndex, endIndex);

    return {
        books: paginatedBooks,
        currentPage: options.page!,
        totalPages,
        totalBooks,
    };
  }

  public async getBookById(id: string) {
    return await this.booksRepository.getBookById(id);
  }
}