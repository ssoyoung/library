import { BooksService } from "../../service";
import { BooksRepository } from "../../repository";
import { Book, GetBooksOptions } from "../../types";
import * as booksData from "../../books.json";

describe("BooksService", () => {
  let booksService: BooksService;
  let mockBookRepository: jest.Mocked<BooksRepository>;

  const mockBooks: Book[] = [
    { id: "1", title: "Test Book 1", author: "Test Author 1", publicationYear: 2021 },
    { id: "2", title: "Test Book 2", author: "Test Author 2", publicationYear: 2022 },
    { id: "3", title: "Test Book 3", author: "Test Author 3", publicationYear: 2023 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockBookRepository = {
      getBookById: jest.fn(),
      getBooks: jest.fn(),
      addBook: jest.fn(),
    } as unknown as jest.Mocked<BooksRepository>;

    booksService = new BooksService(mockBookRepository);
  });

  it("should be defined", () => {
    expect(booksService).toBeDefined();
  });

  describe("getBooks", () => {
    it("should return an array of books", async () => {
      mockBookRepository.getBooks.mockResolvedValue(mockBooks);

      const result = await booksService.getBooks({ page: 1, limit: 10 });
      const expectedResult = {
        books: mockBooks,
        currentPage: 1,
        totalBooks: mockBooks.length,
        totalPages: 1
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe("getBooks with query", () => {
    const books: Book[] = booksData.books;

    beforeEach(() => {
      jest.spyOn(mockBookRepository, "getBooks").mockResolvedValue(books);
    });

    it("should filter and sort books based on search query and sort parameter", async () => {
      const testCases = [
        {
          query: { page: 1, limit: 2, search: "the", sort: "desc" },
          expected: {
            books: [
              { id: "8", title: "The Lord of the Rings", author: "J.R.R. Tolkien", publicationYear: 1954 },
              { id: "5", title: "The Hobbit", author: "J.R.R. Tolkien", publicationYear: 1937 }
            ],
            currentPage: 1,
            totalPages: 2,
            totalBooks: 4
          }
        },
        {
          query: { page: 2, limit: 3, search: "the", sort: "asc" },
          expected: {
            books: [
              { id: "8", title: "The Lord of the Rings", author: "J.R.R. Tolkien", publicationYear: 1954 }
            ],
            currentPage: 2,
            totalPages: 2,
            totalBooks: 4
          }
        }
      ];

      for (const { query, expected } of testCases) {
        const result = await booksService.getBooks(query as GetBooksOptions);
        expect(result).toEqual(expected);
      }
    });

    it("should return an empty array if no books are found", async () => {
      jest.spyOn(mockBookRepository, "getBooks").mockResolvedValue([]);

      const result = await booksService.getBooks({
        page: 1,
        limit: 10,
        search: "nonexistentbook",
        sort: "asc"
      });
      const expectedResult = {
        books: [],
        currentPage: 1,
        totalPages: 0,
        totalBooks: 0
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe("getBookById", () => {
    it("should return a book by id", async () => {
      const expectedBook = { id: "1", title: "Test Book", author: "Test Author", publicationYear: 2024 };
      jest.spyOn(mockBookRepository, "getBookById").mockResolvedValue(expectedBook);

      const result = await booksService.getBookById("1");
      expect(result).toEqual(expectedBook);
    });
  });
});