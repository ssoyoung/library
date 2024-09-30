import { Request, Response, Router } from "express";
import { IBookRepository } from "./repository";

export class BooksController {
  constructor(
    private router: Router,
    private booksRepository: IBookRepository
  ) {}

  public registerRoutes(): void {
    this.router.get("/books", async (req: Request, res: Response) => {
      try {
        const books = await this.booksRepository.getBooks();
        res.json(books);
      } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    this.router.get("/books/:id", async (req: Request, res: Response) => {
      const { id } = req.params;
      try {
        const book = await this.booksRepository.getBookById(id);
        if (!book) {
          res.status(404).json({ error: "Book not found" });
          return;
        }
        res.json(book);
      } catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  }
}
