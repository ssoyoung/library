import { Request, Response, Router } from "express";
import { BooksService } from './service';

// TODO: Make a controller as a common interface,
// so that BooksController and AuditLogController can reuse it
export class BooksController {
  constructor(
    private router: Router,
    private booksService: BooksService,
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
    try {
      const books = await this.booksService.getBooks();
      res.json(books);
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
      res.json(book);
    } catch (error) {
      console.error("Error fetching book:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
