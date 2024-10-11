import { IBookRepository } from "./repository";
import { Book, GetBooksOptions, PaginatedBooks } from "./types";

export class BooksService {
  private booksRepository: IBookRepository;
  constructor(booksRepository: IBookRepository) {
    this.booksRepository = booksRepository;
  }

  public async getBooks(options: GetBooksOptions): Promise<PaginatedBooks> {
    let books: Book[] = await this.booksRepository.getBooks();

    books = this.filterBooks(books, options.search);
    books = this.sortBooks(books, options.sort);

    const { paginatedBooks, totalPages } = this.paginateBooks(books, options.page, options.limit);

    return {
      books: paginatedBooks,
      currentPage: options.page!,
      totalPages,
      totalBooks: books.length,
    };
  }

  private filterBooks(books: Book[], search?: string): Book[] {
    if (!search) return books;
    // case insensitive search
    const keyword = search.toLowerCase();
    // search in author or title
    return books.filter(book => 
      book.author.toLowerCase().includes(keyword) || 
      book.title.toLowerCase().includes(keyword)
    );
  }

  private sortBooks(books: Book[], sort?: string): Book[] {
    if (!sort) return books;
    // sort by title
    return sort === "asc" 
      ? books.sort((a, b) => a.title.localeCompare(b.title)) 
      : books.sort((a, b) => b.title.localeCompare(a.title));
  }

  private paginateBooks(books: Book[], page: number = 1, limit: number = 10): { paginatedBooks: Book[], totalPages: number } {
    const totalBooks = books.length;
    const totalPages = Math.ceil(totalBooks / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBooks = books.slice(startIndex, endIndex);
    return { paginatedBooks, totalPages };
  }

  public async getBookById(id: string) {
    return await this.booksRepository.getBookById(id);
  }
}