# Mini E-commerce Backend

A TypeScript-based e-commerce backend service with features including user authentication, product management, shopping cart functionality, and order processing.

## Features

- **User Authentication**
  - User registration and login
  - JWT-based authentication
  - Role-based access control (Admin/User)
  - Session management with HTTP-only cookies

- **Product Management**
  - Product CRUD operations
  - Category organization
  - Product search and filtering
  - Rating system

- **Shopping Cart**
  - Session-based cart management
  - Add/remove products
  - Quantity updates
  - Cart persistence

- **Order Processing**
  - Secure checkout process
  - Order history tracking
  - Transaction management
  - Detailed order information

## Tech Stack

- Node.js + Express.js
- TypeScript
- MySQL (with Sequelize ORM)
- JSON Web Tokens (JWT)
- Express Session
- CORS enabled

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mini-ecommerce-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   NODE_ENV=development
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   
   # Database
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASS=your_password
   DB_NAME=mini_ecommerce
   
   # JWT
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/logout` - User logout
- `GET /auth/me` - Get user details
- `GET /auth/me/orders` - Get user's order history

### Products
- `GET /products` - List all products
- `POST /products` - Create new product (Admin)
- `GET /products/:id` - Get product details
- `PUT /products/:id` - Update product (Admin)
- `DELETE /products/:id` - Delete product (Admin)

### Categories
- `GET /categories` - List all categories
- `POST /categories` - Create new category (Admin)
- `PUT /categories/:id` - Update category (Admin)
- `DELETE /categories/:id` - Delete category (Admin)

### Cart
- `GET /cart` - View cart
- `POST /cart/add` - Add/Update/Remove item to cart
- `DELETE /cart/clear` - Clear cart

### Checkout
- `POST /checkout` - Process checkout

## Development

### Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm start` - Start production server

### Database Models

- **User**
  - Basic user information
  - Authentication details
  - Role management

- **Product**
  - Product details
  - Price and inventory
  - Category association

- **Category**
  - Category management
  - Product organization

- **Order**
  - Order processing
  - Transaction details
  - Order items tracking

## Security Features

- Password hashing with bcrypt
- HTTP-only cookies for JWT
- CORS protection
- Role-based access control
- Session management
- Transaction integrity

## Error Handling

The API implements a centralized error handling system with appropriate HTTP status codes and error messages.

