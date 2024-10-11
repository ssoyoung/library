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
- `GET /api-docs` - Access the API documentation via Swagger UI.

## Testing

1. Run unit tests:
   ```sh
   npm run test:unit
   ```
2. Run integration tests:
   ```sh
   npm run test:integration
   ```

## Linting

1. Run lint:
   ```sh
   npm run lint
   ```
2. Run lint and fix:
   ```sh
   npm run lint:fix
   ```

## License

This project is licensed under the MIT License.

## Module Documentation

For detailed information on specific modules, refer to their respective `README.md` files located in the module directories (e.g., `src/books/README.md`).
