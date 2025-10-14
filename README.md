# Express-Prisma API Starter Kit

A robust, production-ready starter kit for building RESTful APIs with Express.js, TypeScript, Prisma, and modern development practices.

## 🚀 Features

- **TypeScript Support**: Full TypeScript configuration with strict type checking
- **Database Integration**: Prisma ORM with PostgreSQL support
- **Security**: Helmet for security headers, CORS configuration
- **Logging**: Winston logger with daily rotation and console output
- **Error Handling**: Centralized error handling middleware
- **Validation**: Joi and Zod for request validation
- **Real-time Communication**: Socket.IO integration
- **Caching**: Node-cache for in-memory caching
- **Development Tools**: Nodemon for hot reloading, Morgan for HTTP logging
- **Modular Architecture**: Clean separation of concerns with modules
- **Module Generator CLI**: Automated module generation with API integration
- **Environment Management**: Dotenv with validation using Joi

## 🛠 Tech Stack

### Core

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM

### Security

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
│   ├── scripts/              # Utility scripts (module generator)
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

## 🛠 Module Generator CLI

This project includes a powerful CLI tool for generating and managing feature modules with consistent architecture and automatic API integration.

### Features

- **Automatic Module Generation**: Creates complete module structure with controllers, services, routes, and more
- **Multiple Module Types**: Generate basic modules or full CRUD modules
- **Auto API Integration**: Automatically adds routes to the main API configuration
- **Duplication Prevention**: Checks for existing modules to prevent conflicts
- **Module Removal**: Clean removal of modules and their API integrations
- **Professional CLI**: Built with Commander.js for robust argument parsing

### Usage

```bash
# Generate basic module (default - minimal routes)
npx g <moduleName>

# Generate full CRUD module
npx g <moduleName> --crud

# Generate basic module explicitly
npx g <moduleName> --basic

# Remove a module
npx g <moduleName> --remove

# Show help
npx g --help
```

### Examples

```bash
# Create a basic user module with minimal routes
npx g user

# Create a full CRUD product module with all operations
npx g product --crud

# Create a basic category module
npx g category --basic

# Remove the user module
npx g user --remove
```

### Generated Module Structure

Each generated module includes:

```
modules/<moduleName>/
├── <moduleName>.controller.ts    # Express controller with routes
├── <moduleName>.service.ts       # Business logic layer
├── <moduleName>.routes.ts        # Route definitions
├── <moduleName>.types.ts         # TypeScript type definitions
├── <moduleName>.dtos.ts          # Data transfer objects
├── <moduleName>.validators.ts    # Input validation schemas
├── <moduleName>.middleware.ts    # Module-specific middleware
└── <moduleName>.utils.ts         # Utility functions
```

### Automatic Integration

When you generate a module, the CLI automatically:

- Creates all necessary files with proper TypeScript code
- Adds the module's routes import to `src/api.ts`
- Registers the routes with the Express app
- Follows the project's coding conventions and architecture

### Module Types

**Basic Module** (default):

- Single GET route for retrieving data
- Minimal service with one method
- Basic route configuration

**CRUD Module**:

- Full REST API with GET, POST, PUT, DELETE operations
- Complete service layer with all CRUD methods
- Comprehensive route definitions

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

# Module Generator CLI
npx g <name>         # Generate basic module
npx g <name> --crud  # Generate full CRUD module
npx g <name> --remove # Remove a module
npx g --help         # Show CLI help

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
4. Check the [Issues](https://github.com/ahsan90/express-prisma-starter-kit/issues) page

## 🔄 Updates

To update dependencies:

```bash
npm update
npx prisma migrate deploy  # For production database updates
```

---

**Happy coding! 🎉**

Built with ❤️ using Express.js, TypeScript, and Prisma
