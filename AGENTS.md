# Agents Guide

This document provides guidelines and context for AI agents working on this codebase.

## Project Overview

This is a Node.js library that provides a `Path` class for working with file system paths. The project uses TypeScript and is built for Node.js v22+.

## Code Style

- **Language**: TypeScript
- **Module System**: ES Modules (`type: "module"`)
- **Linting**: ESLint with `@radham/eslint-config`
- **Formatting**: Follow existing code style
- **Private Fields**: Use `#` prefix for private class fields (e.g., `#value`)
- **Paradigm**: Utilize a functional programming style when possible.
- **Abbreviations**: Avoid using abbreviations when naming things if possible.

## Project Structure

<!-- eslint-disable markdown/fenced-code-language -->
```
node-files/
├── src/              # Source TypeScript files
│   ├── index.ts      # Main Path class and exports
│   └── utilities.ts  # Utility functions
├── spec/             # Test files (vitest)
│   └── index.spec.ts
├── dist/             # Built output (generated)
└── package.json      # Project configuration
```

## Key Files

- **`src/index.ts`**: Main Path class implementation
- **`spec/index.spec.ts`**: Test suite using vitest
- **`tsconfig.json`**: TypeScript configuration
- **`package.json`**: Dependencies and scripts

## Development Workflow

### Running Tests

```bash
pnpm test              # Run tests once
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Run tests with coverage
```

### Building

```bash
pnpm build             # Build the project
```

### Linting

```bash
pnpm lint              # Check for linting errors
pnpm lint:fix          # Fix linting errors automatically
```

## Testing Guidelines

- All new features must include corresponding vitest tests
- Tests should be placed in `spec/index.spec.ts`
- Use descriptive test names that explain what is being tested
- Follow the existing test structure and patterns
- Tests should clean up any temporary files/directories they create

## Path Class API

The `Path` class provides the following:

### Constructor
- Accepts multiple path segments (strings or Path instances)
- Joins them using `path.join()`

### Getters
- `directoryName`: Returns the directory name using `path.dirname()`
- `exists`: Returns whether the path exists using `fs.existsSync()`

### Methods
- `isDirectory()`: Returns `true` if the path is a directory
- `isFile()`: Returns `true` if the path is a file
- `isSymbolicLink()`: Returns `true` if the path is a symbolic link

## Common Patterns

### Adding New Methods

When adding new methods to the Path class:

1. Add the method to `src/index.ts`
2. Add comprehensive tests to `spec/index.spec.ts`
3. Follow existing error handling patterns (try/catch returning false)
4. Use appropriate `fs` methods (`fs.statSync`, `fs.lstatSync`, etc.)

### Adding New Getters

When adding new getters:

1. Add the getter to `src/index.ts` after existing getters
2. Add comprehensive tests covering various scenarios
3. Use appropriate Node.js APIs (e.g., `path.*` for path operations)

## Important Notes

- The project uses private fields (`#value`) to store the internal path value
- All file system operations should handle errors gracefully
- The project targets Node.js v22+, so modern Node.js APIs can be used
- Use `node:fs` and `node:path` imports (not just `fs` and `path`)
- Tests should use `fileURLToPath(import.meta.url)` for ESM compatibility instead of `__filename`

## Dependencies

- **Runtime**: Node.js v22+
- **Package Manager**: pnpm v10.26.2
- **Build Tool**: duo-build
- **Test Framework**: vitest
- **Type System**: TypeScript v5.9.3

## When Making Changes

1. Write tests first (TDD approach is preferred)
2. Ensure all tests pass: `pnpm test`
3. Check linting: `pnpm lint`
4. Update CHANGELOG.md if adding features or fixing bugs using the [Keep a Changelog](https://keepachangelog.com/) format.
5. Follow semantic versioning for releases

