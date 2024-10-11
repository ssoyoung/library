import { Request, Response, Router } from "express";
import { BooksService } from "./service";
import { GetBooksOptions, PaginatedBooks } from "./types";
import { Sort, ValidationResult } from "../common/types/CommonTypes";
import { validatePagination, validateSort } from "./validation";
import { IController } from "../common/interfaces/IController";

const DEFAULT_SORT: Sort = "asc";
const DEFAULT_PAGE: number = 1;
const DEFAULT_LIMIT: number = 10;

export class BooksController implements IController {
    private router: Router;
    private booksService: BooksService;
    private basePath: string = "/books";
  
    constructor(router: Router, booksService: BooksService, basePath: string = "/books") {
      this.router = router;
      this.booksService = booksService;
      this.basePath = basePath;
    }

  public registerRoutes(): void {
    /**
     * @swagger
     * /books:
     *   get:
     *     summary: Retrieve a list of books
     *     description: Get a paginated list of books with optional search and sorting
     *     parameters:
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *         description: (Optional) Search term for books
     *       - in: query
     *         name: sort
     *         schema:
     *           type: string
     *           enum: [asc, desc]
     *         description: (Optional) Sort order for books by title
     *         default: asc
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: (Optional) Page number for pagination
     *         default: 1
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: (Optional) Number of books per page
     *         default: 10
     *     responses:
     *       200:
     *         description: Successful response with paginated books
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PaginatedBooks'
     *       400:
     *         description: Bad request due to invalid parameters
     *       500:
     *         description: Internal server error
     * 
     * /books/{id}:
     *   get:
     *     summary: Get a book by ID
     *     description: Retrieve a single book by its ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the book
     *     responses:
     *       200:
     *         description: Successful response with book details
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Book'
     *       404:
     *         description: Book not found
     *       500:
     *         description: Internal server error
     * 
     * components:
     *   schemas:
     *     Book:
     *       type: object
     *       properties:
     *         id:
     *           type: string
     *         title:
     *           type: string
     *         author:
     *           type: string
     *         publicationYear:
     *           type: integer
     *     PaginatedBooks:
     *       type: object
     *       properties:
     *         books:
     *           type: array
     *           items:
     *             $ref: '#/components/schemas/Book'
     *         currentPage:
     *           type: integer
     *         totalPages:
     *           type: integer
     *         totalBooks:
     *           type: integer
     */
    this.registerRoute("", this.getBooksHandler.bind(this));
    this.registerRoute("/:id", this.getBookByIdHandler.bind(this));
  }
  private registerRoute(path: string, handler: (_req: Request, _res: Response) => Promise<void>): void {
    this.router.get(`${this.basePath}${path}`, handler);
  }

  private async getBooksHandler(req: Request, res: Response): Promise<void> {
    try {
      const validatedOptions = this.parseAndValidateOptions(req.query);
      if (!validatedOptions.isValid) {
        res.status(400).json({ error: validatedOptions.error });
        return;
      }

      const books: PaginatedBooks = await this.booksService.getBooks(validatedOptions as GetBooksOptions);
      res.status(200).json(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parseAndValidateOptions(query: any): GetBooksOptions & { isValid: true } | ValidationResult {
    const search = query.search as string || undefined;
    const sort = query.sort as Sort || DEFAULT_SORT;
    const page = query.page ? parseInt(query.page as string, 10) : DEFAULT_PAGE;
    const limit = query.limit ? parseInt(query.limit as string, 10) : DEFAULT_LIMIT;

    const sortValidation = this.validateSort(sort);
    if (!sortValidation.isValid) {
      return { isValid: false, error: sortValidation.error };
    }

    const paginationValidation = this.validatePagination(page, limit);
    if (!paginationValidation.page.isValid) {
      return { isValid: false, error: paginationValidation.page.error };
    }
    if (!paginationValidation.limit.isValid) {
      return { isValid: false, error: paginationValidation.limit.error };
    }

    return { search, sort, page, limit, isValid: true };
  }

  private validateSort(sort: Sort): ValidationResult {
    const sortValidation = validateSort(sort);
    return sortValidation.isValid 
      ? { isValid: true } 
      : { isValid: false, error: sortValidation.error };
  }

  private validatePagination(page: number, limit: number): { page: ValidationResult, limit: ValidationResult } {
    const pageValidation = validatePagination(page, limit);
    return {
      page: pageValidation.isValid ? { isValid: true } : { isValid: false, error: pageValidation.error },
      limit: pageValidation.isValid ? { isValid: true } : { isValid: false, error: pageValidation.error }
    };
  }
  private async getBookByIdHandler(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const book = await this.booksService.getBookById(id);
      if (!book) {
        res.status(404).json({ error: "Book not found" });
        return;
      }
      res.status(200).json(book);
    } catch (error) {
      console.error("Error fetching book:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
