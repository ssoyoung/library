import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { BooksController, BooksService, BooksRepository } from "./books";
import { AuditLogController, AuditLogRepository } from "./auditLog";

dotenv.config();


const app: Express = express();
const router = express.Router();
const port = process.env.PORT || 3000;

// Swagger definition
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Book Library API",
      version: "1.0.0",
      description: "A simple Book Library API",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ["./src/**/*.ts"], // Path to the API docs
};

const specs = swaggerJsdoc(options);

// Middleware
app.use(express.json());
app.use("/", router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

//create Repository
const booksRepository = new BooksRepository();
const auditLogRepository = new AuditLogRepository();

//Registering the routes
router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from Book Library API!" });
});

new BooksController(router,  new BooksService(booksRepository)).registerRoutes();
new AuditLogController(
  router,
  auditLogRepository
).registerRoutes();

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// export server for integration test
export { server };