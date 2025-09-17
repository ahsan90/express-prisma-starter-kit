# Express-Prisma API Starter Kit

A robust, production-ready starter kit for building RESTful APIs with Express.js, TypeScript, Prisma, and modern development practices.

## 🚀 Features

- **TypeScript Support**: Full TypeScript configuration with strict type checking
- **Database Integration**: Prisma ORM with PostgreSQL support
- **Authentication**: JWT-based authentication with refresh tokens
- **Security**: Helmet for security headers, CORS configuration
- **Logging**: Winston logger with daily rotation and console output
- **Error Handling**: Centralized error handling middleware
- **Validation**: Joi and Zod for request validation
- **Real-time Communication**: Socket.IO integration
- **Caching**: Node-cache for in-memory caching
- **Development Tools**: Nodemon for hot reloading, Morgan for HTTP logging
- **Modular Architecture**: Clean separation of concerns with modules
- **Environment Management**: Dotenv with validation using Joi

## 🛠 Tech Stack

### Core

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM

### Security & Authentication

- **JWT**: jsonwebtoken for token-based auth
- **Security**: Helmet for HTTP security headers
- **CORS**: Configurable CORS settings
- **Password Security**: Safe-compare for secure comparisons

### Development & Testing

- **Process Management**: Nodemon for development
- **Validation**: Joi and Zod schemas
- **Logging**: Winston with daily rotation
- **HTTP Logging**: Morgan middleware

### Real-time & Caching

- **WebSockets**: Socket.IO for real-time features
- **Caching**: Node-cache for in-memory storage

## 📁 Project Structure

```
api/
├── src/
│   ├── api.ts                 # Main Express app configuration
│   ├── server.ts              # Server startup and Socket.IO setup
│   ├── common/
│   │   ├── errorHandler.ts    # Centralized error handling
│   │   └── logger.middleware.ts # Logging middleware
│   ├── lib/
│   │   ├── env.ts            # Environment configuration
│   │   └── db.ts             # Prisma client setup
│   ├── modules/              # Feature modules
│   │   ├── test/             # Example test module
│   │   │   ├── test.controller.ts
│   │   │   ├── test.routes.ts
│   │   │   ├── test.service.ts
│   │   │   ├── test.middleware.ts
│   │   │   ├── test.dtos.ts
│   │   │   ├── test.types.ts
│   │   │   ├── test.utils.ts
│   │   │   └── test.validators.ts
│   │   └── user/             # User management module
│   ├── scripts/              # Utility scripts
│   └── utils/                # Shared utilities
├── prisma/
│   └── schema.prisma         # Database schema
├── logs/                     # Application logs
├── env.example.txt           # Environment variables template
├── package.json
├── tsconfig.json
├── nodemon.json
└── README.md
```

## 🏁 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp env.example.txt .env
   ```

   Configure your `.env` file with the required variables:

   ```env
   PORT=5050
   NODE_ENV=development
   DATABASE_URL=postgresql://username:password@localhost:5432/your_database
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
   API_PREFIX=/api/v1
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev --name init

   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5050` with hot reloading enabled.

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server

# Database
npx prisma generate  # Generate Prisma client
npx prisma migrate dev # Run migrations in development
npx prisma studio    # Open Prisma Studio
npx prisma db push   # Push schema changes to database

# Logging
tail -f logs/*.log   # Monitor application logs
```

## 🌐 API Documentation

### Base URL

```
http://localhost:5050/api/v1
```

### Example Endpoints

#### Test get request

```http
GET /api/v1/tests
```

## 🔧 Development Guidelines

### Module Structure

Each feature module should follow this structure:

- `module.routes.ts` - Route definitions
- `module.controller.ts` - Request handlers
- `module.service.ts` - Business logic
- `module.dtos.ts` - Data transfer objects
- `module.types.ts` - TypeScript type definitions
- `module.validators.ts` - Input validation schemas
- `module.utils.ts` - Utility functions

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep functions small and focused

### Error Handling

- Use the centralized error handler in `common/errorHandler.ts`
- Throw specific error types for different scenarios
- Include appropriate HTTP status codes
- Log errors with context information

### Validation

- Use Joi for complex validation rules
- Use Zod for TypeScript-first validation
- Validate all user inputs
- Provide meaningful error messages

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

Ensure all required environment variables are set in production/development:

- Set `NODE_ENV=production`
- Configure production/development database URL
- Set appropriate CORS origins

### Docker Support

Add a `Dockerfile` and `docker-compose.yml` for containerized deployment:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5050
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and add tests
4. Run the development server: `npm run dev`
5. Ensure all tests pass
6. Commit your changes: `git commit -am 'Add your feature'`
7. Push to the branch: `git push origin feature/your-feature`
8. Submit a pull request

### Commit Guidelines

- Use conventional commit format
- Write clear, descriptive commit messages
- Reference issue numbers when applicable

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the logs in the `logs/` directory
2. Review the environment configuration
3. Ensure database connectivity
4. Check the [Issues](https://github.com/express-starter-kit/issues) page

## 🔄 Updates

To update dependencies:

```bash
npm update
npx prisma migrate deploy  # For production database updates
```

---

**Happy coding! 🎉**

Built with ❤️ using Express.js, TypeScript, and Prisma
