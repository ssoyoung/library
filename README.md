# Book Library API

## Description

This is a simple Book Library API built with Express.js. It allows users to manage a collection of books through a RESTful API.

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd <project-directory>
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```
4. Build the code:
   ```sh
   npm run build
   ```
5. Create a `.env` file in the root directory and add the following:
   ```
   PORT=3000
   ```

## Usage

1. Start the server:
   ```sh
   npm start
   ```
2. The API will be running at `http://localhost:3000`.

## Endpoints

- `GET /` - Returns a welcome message.
- `GET /api-docs` - Returns the API documentation.
- Additional endpoints for managing books will be available through the [`BooksController`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FUsers%2Fmihaela%2Fcode%2Flibrary-BE%2Fsrc%2Findex.ts%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A2%2C%22character%22%3A9%7D%7D%5D%2C%2221bd5de7-90a6-4aa3-b897-89ee31899a17%22%5D "Go to definition"). Please refer to the `/api-docs` endpoint to see the available routes and their specifications.


## Test

1. Run unit tests:
   ```sh
   npm run test:unit
   ```
2. Run integration tests:
   ```sh
   npm run test:integration
   ```

## License

This project is licensed under the MIT License.
