# Fetch UI

A modern UI component management system that allows you to fetch, manage, and use UI components from various registries.

## Features

- 🚀 OpenAPI Registry: Standard OpenAPI specification for component registry
- 🏠 Self-Hosted Support: Deploy and manage your own registry
- 📦 Component Management: Install, update, and remove components
- 🔍 Component Discovery: Search and browse components
- 🛠 CLI Tool: Easy-to-use command line interface
- 🔒 Type Safety: Built with TypeScript
- 📚 Documentation: Comprehensive documentation and examples

## Getting Started

### Installation

```bash
# Using npm
npm install fetch-ui

# Using yarn
yarn add fetch-ui

# Using pnpm
pnpm add fetch-ui
```

### Basic Usage

```bash
# Add a component from the default registry
fetch-ui add button

# Add a component from a specific registry
fetch-ui add button --registry git

# Get help
fetch-ui --help
```

## Project Structure

```
fetch-ui/
├── apps/          # Example applications
├── packages/
│   ├── cli/       # Command line interface
│   └── core/      # Core library
└── docs/          # Documentation
```

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

## Contributing

We welcome contributions! Please see our contributing guide for details.

## License

MIT
