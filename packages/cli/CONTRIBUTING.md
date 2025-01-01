# Contributing to Fetch UI CLI

## Technology Stack

### Core Technologies
- **Node.js**: v18.x or higher
- **TypeScript**: v5.x
- **Commander.js**: Command line interface framework
- **ts-morph**: TypeScript/JavaScript transformation
- **zod**: Runtime type checking and validation

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **Husky**: Git hooks
- **Changesets**: Version management

### Build Tools
- **tsup**: TypeScript bundler
- **esbuild**: JavaScript bundler
- **TypeDoc**: Documentation generator

## Project Structure

```
packages/cli/
├── src/
│   ├── commands/           # Command implementations
│   │   ├── add.ts
│   │   ├── init.ts
│   │   ├── list.ts
│   │   ├── update.ts
│   │   └── registry.ts
│   ├── services/          # Business logic
│   │   ├── component/
│   │   ├── registry/
│   │   └── transform/
│   ├── utils/            # Utility functions
│   │   ├── fs.ts
│   │   ├── logger.ts
│   │   └── validation.ts
│   ├── types/           # TypeScript types
│   └── index.ts         # Entry point
├── tests/              # Test files
│   ├── commands/
│   ├── services/
│   └── utils/
├── templates/         # Component templates
└── docs/             # Documentation
```

## Development Context

### 1. Development Environment

#### Required Tools
- Node.js v18.x
- pnpm v8.x
- Git

#### Setup Steps
```bash
# Clone repository
git clone https://github.com/your-org/fetch-ui.git

# Install dependencies
pnpm install

# Build project
pnpm build

# Run tests
pnpm test
```

### 2. Development Workflow

#### Branch Strategy
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: New features
- `fix/*`: Bug fixes
- `release/*`: Release preparation

#### Commit Convention
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Code style
- refactor: Code refactoring
- test: Testing
- chore: Maintenance

### 3. Testing Strategy

#### Unit Tests
- Command parsing
- Service logic
- Utility functions
- Type validation

#### Integration Tests
- Component installation
- Registry communication
- Transform operations
- File system operations

#### E2E Tests
- Full command execution
- Error scenarios
- Configuration handling
- Registry integration

### 4. Documentation

#### Code Documentation
- JSDoc comments
- Type definitions
- Implementation notes
- Examples

#### API Documentation
- Command reference
- Configuration options
- Registry API
- Error codes

#### User Documentation
- Installation guide
- Usage examples
- Troubleshooting
- Best practices

### 5. Release Process

#### Version Management
1. Update changelog
2. Run tests
3. Build package
4. Generate documentation
5. Create release PR
6. Publish package

#### Publishing
```bash
# Create changeset
pnpm changeset

# Version packages
pnpm version-packages

# Build
pnpm build

# Publish
pnpm publish
```

### 6. Performance Considerations

#### Optimization Goals
- Fast command execution
- Minimal memory usage
- Efficient file operations
- Quick registry queries

#### Monitoring
- Command execution time
- Memory consumption
- Error rates
- Registry response time

### 7. Security Guidelines

#### Code Review
- Security implications
- Dependency audit
- Code injection risks
- File system safety

#### Registry Security
- Authentication
- HTTPS enforcement
- Token management
- Rate limiting