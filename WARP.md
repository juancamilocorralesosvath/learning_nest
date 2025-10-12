# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a NestJS TypeScript starter application - a basic "Hello World" REST API demonstrating the fundamental NestJS architecture patterns.

## Common Commands

### Development
```bash
# Install dependencies
npm install

# Start in development mode with hot reload
npm run start:dev

# Start normally (production build)
npm run start

# Start in debug mode with watch
npm run start:debug

# Build the application
npm run build

# Run production build
npm run start:prod
```

### Testing
```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run end-to-end tests
npm test:e2e

# Debug tests
npm run test:debug
```

### Code Quality
```bash
# Lint and auto-fix TypeScript files
npm run lint

# Format code with Prettier
npm run format
```

### Single Test Execution
```bash
# Run a specific test file
npm run test -- app.controller.spec.ts

# Run tests matching a pattern
npm run test -- --testNamePattern="getHello"

# Run a specific e2e test
npm run test:e2e -- --testNamePattern="AppController"
```

## Architecture Overview

This is a minimal NestJS application following the standard architecture:

### Core Structure
- **main.ts**: Application bootstrap and entry point, creates NestJS app and starts server on port 3000 (or PORT env var)
- **app.module.ts**: Root module that imports all feature modules, controllers, and providers
- **app.controller.ts**: Root controller handling HTTP requests with dependency injection
- **app.service.ts**: Business logic layer with Injectable decorator for dependency injection

### Key Architectural Patterns
- **Modular Architecture**: Uses `@Module()` decorators to organize code into logical modules
- **Dependency Injection**: Controllers inject services through constructor parameters
- **Decorator-Based**: Heavily relies on TypeScript decorators (`@Injectable()`, `@Controller()`, `@Get()`, etc.)
- **MVC Pattern**: Clear separation between controllers (HTTP layer) and services (business logic)

### Configuration
- **TypeScript**: Uses ES2023 target with experimental decorators enabled
- **ESLint + Prettier**: Code linting with TypeScript ESLint and Prettier formatting
- **Jest**: Unit and e2e testing with coverage support
- **Build Output**: Compiled JavaScript goes to `dist/` directory

### Development Workflow
When extending this application:
1. Create new modules using `nest generate module <name>`
2. Generate controllers with `nest generate controller <name>`
3. Generate services with `nest generate service <name>`
4. Import new modules into `AppModule` or create feature modules
5. Use dependency injection to connect controllers and services

### Port Configuration
The application listens on port 3000 by default, but respects the `PORT` environment variable if set.