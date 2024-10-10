import { IBookRepository } from "./repository";

export class BooksService {
  constructor(private booksRepository: IBookRepository) {}

  public async getBooks() {
    return await this.booksRepository.getBooks();
  }

  public async getBookById(id: string) {
    return await this.booksRepository.getBookById(id);
  }
}