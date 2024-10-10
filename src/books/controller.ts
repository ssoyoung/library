import { Request, Response, Router } from "express";
import { BooksService } from "./service";
import { PaginatedBooks, Sort, ValidationResult } from "./types";
import { validatePagination, validateSort } from "./validation";

// TODO: Make a controller as a common interface,
// so that BooksController and AuditLogController can reuse it
export class BooksController {
  constructor(
    private router: Router,
    private booksService: BooksService, //TBD: interface instead of implementation?
    private basePath: string = "/books"
  ) {
  }

  public registerRoutes(): void {
    this.registerRoute("", this.getBooksHandler.bind(this));
    this.registerRoute("/:id", this.getBookByIdHandler.bind(this));
  }
  private registerRoute(path: string, handler: (req: Request, res: Response) => Promise<void>): void {
    this.router.get(`${this.basePath}${path}`, handler);
  }

  private async getBooksHandler(req: Request, res: Response): Promise<void> {
    const search = req.query.search as string || undefined;

    // validation check for sort
    // if sort is empty, set it to "asc"
    const sort = (req.query.sort as Sort) || "asc";
    let validation : ValidationResult = validateSort(sort);
    if (!validation.isValid) {
      res.status(400).json({ error: validation.error });
      return;
    }

    // validation check for pagination
    // if page is empty, set it to 1
    // if limit is empty, set it to 10
    const pageQuery = req.query.page as string;
    const limitQuery = req.query.limit as string;  
    const page = pageQuery ? parseInt(pageQuery, 10) : 1;
    const limit = limitQuery ? parseInt(limitQuery, 10) : 10;
    validation = validatePagination(page, limit);
    if (!validation.isValid) {
      res.status(400).json({ error: validation.error });
      return;
    }

    try {
      const books: PaginatedBooks = await this.booksService.getBooks({
        search,
        sort,
        page, //TODO: unit test - NaN page error
        limit
      });
      res.status(200).json(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ error: "Internal server error" });
    }
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
