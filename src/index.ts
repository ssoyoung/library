import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { BooksController, BooksService, BooksRepository } from "./books";
import { AuditLogController, AuditLogRepository } from "./auditLog";

dotenv.config();

const app: Express = express();
const router = express.Router();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use("/", router);

//create Repository
const booksRepository = new BooksRepository();
const auditLogRepository = new AuditLogRepository();

//Registering the routes
router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from Book Library API!" });
});

// TBD: Do we need to keep this variable?
const booksAPI = new BooksController(router,  new BooksService(booksRepository)).registerRoutes();
const actionsAPI = new AuditLogController(
  router,
  auditLogRepository
).registerRoutes();

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
