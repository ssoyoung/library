import request from "supertest";
import { server } from "../../../index";
import { Book } from "../../types";

describe("Books API Integration Test", () => {

  beforeAll(() => {
  });
  
  afterAll((done) => {
    server.close(done);
  });

  it("should return a list of books with default page and limit", async () => {
    const response = await request(server).get("/books");
    expect(response.status).toBe(200);
    expect(response.body.books.length).toBe(10);
    expect(response.body.currentPage).toBe(1);  // default page is 1
    expect(response.body.totalPages).toBe(1);   // default limit is 10
    expect(response.body.totalBooks).toBe(10);
  });

  it("should return a list of books with search, sort, page and limit", async () => {
    const testCases = [
      { keyword: "i-am-a-invalid-keyword", sort: "asc", page: 1, limit: 2, expectedTotalPages: 0, expectedTotalBooks: 0 },
      { keyword: "the", sort: "asc", page: 1, limit: 10, expectedTotalPages: 1, expectedTotalBooks: 4 },
      { keyword: "", sort: "desc", page: 2, limit: 2, expectedTotalPages: 5, expectedTotalBooks: 10 },
    ];

    for (const { keyword, sort, page, limit, expectedTotalPages, expectedTotalBooks } of testCases) {
      const response = await request(server).get(`/books?search=${keyword}&sort=${sort}&page=${page}&limit=${limit}`);
      const { books, totalPages, totalBooks, currentPage } = response.body;

      expect(response.status).toBe(200);
      expect(totalPages).toBe(expectedTotalPages);
      expect(totalBooks).toBe(expectedTotalBooks);
      expect(currentPage).toBe(page);

      if (keyword === "the") {
        const filtered = books.filter((book: Book) => !(book.title.toLowerCase().includes("the") || book.author.toLowerCase().includes("the")));
        expect(filtered.length).toBe(0);
      }
    }
  });

  it("should return 400 error for invalid query parameters", async () => {
    const testCases = [
      { query: "sort=invalid", expectedError: "Invalid sort value. Allowed values are 'asc' or 'desc'." },
      { query: "page=0", expectedError: "Invalid page number. It must be a positive integer." },
      { query: "limit=0", expectedError: "Invalid limit number. It must be a positive integer." },
      { query: "page=abc", expectedError: "Invalid page number. It must be a positive integer." },
      { query: "limit=abc", expectedError: "Invalid limit number. It must be a positive integer." },
    ];

    for (const { query, expectedError } of testCases) {
      const response = await request(server).get(`/books?${query}`);
      expect(response.status).toBe(400);
      expect(response.body.error).toBe(expectedError);
    }
  });
});