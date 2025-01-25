# Contributing to Fetch UI

This document provides high-level guidelines for contributing to the Fetch UI monorepo. Each package may have its own specific contributing guidelines that extend these base rules.

## Development Principles

### 1. Test-Driven Development (TDD)

All packages in this monorepo follow TDD practices:

1. **Write Test First**

   - Write failing tests before implementing features
   - Tests should clearly describe the expected behavior
   - Each package maintains its own test suite

2. **Red-Green-Refactor Cycle**

   - Red: Write a failing test
   - Green: Write minimal code to make the test pass
   - Refactor: Improve code quality without changing behavior

3. **Test Categories**

   ```
   packages/
   ├── cli/              # CLI Package
   │   └── tests/
   │       ├── unit/     # Package-specific unit tests
   │       └── e2e/      # Package-specific E2E tests
   ├── registry/         # Registry Package
   │   └── tests/
   │       ├── unit/     # Package-specific unit tests
   │       └── e2e/      # Package-specific E2E tests
   └── shared/           # Shared Utilities
       └── tests/
           └── unit/     # Shared utilities tests
   ```

4. **Test Coverage Requirements**
   - Each package must maintain minimum coverage requirements
   - Integration tests between packages
   - E2E tests for critical workflows

### 2. Clean Architecture

We implement Clean Architecture principles across the monorepo:

#### Monorepo Structure

```
fetch-ui/
├── packages/
│   ├── cli/            # Command Line Interface
│   ├── registry/       # Component Registry
│   ├── core/           # Core Business Logic
│   └── shared/         # Shared Utilities
├── docs/               # Documentation
└── examples/           # Example Projects
```

#### Architecture Layers (Per Package)

1. **Domain Layer** (Innermost)

   - Package-specific business entities
   - Shared domain models in core package
   - Value objects

2. **Use Cases Layer**

   - Package-specific business rules
   - Cross-package workflows
   - Port interfaces

3. **Interface Adapters Layer**

   - Package-specific adapters
   - Cross-package communication
   - External integrations

4. **Frameworks & Drivers Layer** (Outermost)
   - Framework implementations
   - External dependencies
   - Infrastructure code

### Cross-Package Dependencies

1. **Dependency Rules**

   - Packages should minimize cross-dependencies
   - Shared code goes into core or shared packages
   - Clear dependency boundaries between packages

2. **Version Management**
   - Synchronized versioning using changesets
   - Clear dependency specifications
   - Breaking changes must be documented

### Development Workflow

1. **Package Development**

   ```bash
   # Install all dependencies
   pnpm install

   # Run tests for specific package
   pnpm test --filter @fetch-ui/cli

   # Build specific package
   pnpm build --filter @fetch-ui/registry
   ```

2. **Cross-Package Testing**

   ```bash
   # Run all tests
   pnpm test

   # Run integration tests
   pnpm test:integration
   ```

3. **Quality Gates**
   - All package tests must pass
   - Cross-package integration tests must pass
   - Linting rules must be satisfied
   - Architecture rules must be validated

### Best Practices

1. **Package Independence**

   - Each package should be independently deployable
   - Clear package boundaries
   - Well-defined interfaces between packages

2. **Shared Code Management**

   - Use shared packages for common code
   - Avoid circular dependencies
   - Clear documentation of shared utilities

3. **Documentation**

   - Package-specific README files
   - API documentation
   - Architecture decision records (ADRs)

4. **Monorepo Maintenance**
   - Regular dependency updates
   - Consistent coding standards across packages
   - Unified release process

For package-specific guidelines, please refer to the CONTRIBUTING.md file in each package directory.
