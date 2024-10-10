import { Request, Response, Router } from 'express';
import { jest } from '@jest/globals';
import { BooksController } from '../../controller';
import { BooksService } from '../../service';

describe('BooksController', () => {
  let booksController: BooksController;
  let mockBooksService: jest.Mocked<BooksService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockBooksService = {
      getBooks: jest.fn(),
      getBookById: jest.fn(),
    } as any;

    mockRouter = {
      get: jest.fn(),
    } as any;

    booksController = new BooksController(mockRouter, mockBooksService);
  });

  describe('registerRoutes', () => {
    it('should register routes correctly', () => {
      booksController.registerRoutes();

      expect(mockRouter.get).toHaveBeenCalledTimes(2);
      expect(mockRouter.get).toHaveBeenCalledWith('/books', expect.any(Function));
      expect(mockRouter.get).toHaveBeenCalledWith('/books/:id', expect.any(Function));
    });
  });

  describe('getBooksHandler', () => {
    it('should return books successfully', async () => {
      const mockRequest = {
        query: {},
      } as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockBooks = { books: [], currentPage: 1, totalPages: 1, totalBooks: 0 };
      mockBooksService.getBooks.mockResolvedValue(mockBooks);

      await booksController['getBooksHandler'](mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockBooks);
    });

    it('should return books with empty value sort, limit, and page successfully', async () => {
      const mockRequest = {
        query: { sort : '', page : '', limit : ''},
      } as unknown as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockBooks = { books: [], currentPage: 1, totalPages: 1, totalBooks: 0 };
      mockBooksService.getBooks.mockResolvedValue(mockBooks);

      await booksController['getBooksHandler'](mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockBooks);
    });

    it('should handle invalid pagination with negative page number', async () => {
      const mockRequest = {
        query: { page: '-1', limit: '0' },
      } as unknown as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await booksController['getBooksHandler'](mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Invalid page number. It must be a positive integer." });
    });

    it('should handle invalid pagination with non-number page value', async () => {
      const mockRequest = {
        query: { page: 'invalid-page', limit: '0' },
      } as unknown as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await booksController['getBooksHandler'](mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Invalid page number. It must be a positive integer." });
    });

    it('should handle invalid pagination with non-number limit value', async () => {
      const mockRequest = {
        query: { page: '1', limit: 'invalid-limit' },
      } as unknown as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await booksController['getBooksHandler'](mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Invalid limit number. It must be a positive integer." });
    });
  
    it('should handle invalid sort', async () => {
        const mockRequest = {
          query: { sort : 'invaLid' },
        } as unknown as Request;
        const mockResponse = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        } as unknown as Response;
  
        await booksController['getBooksHandler'](mockRequest, mockResponse);
  
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: "Invalid sort value. Allowed values are 'asc' or 'desc'."});
      });
  });

  describe('getBookByIdHandler', () => {
    it('should return a book by id successfully', async () => {
      const mockRequest = {
        params: { id: '1' },
      } as unknown as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockBook = { id: '1', title: 'Test Book', author: 'Test Author', publicationYear: 2021 };
      mockBooksService.getBookById.mockResolvedValue(mockBook);

      await booksController['getBookByIdHandler'](mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockBook);
    });

    it('should handle book not found', async () => {
      const mockRequest = {
        params: { id: '999' },
      } as unknown as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      mockBooksService.getBookById.mockResolvedValue(null);

      await booksController['getBookByIdHandler'](mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Book not found' });
    });
  });

});
