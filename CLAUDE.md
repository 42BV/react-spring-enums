# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@42.nl/react-spring-enums` is an npm library for sharing enums between a React frontend and a Java Spring Boot backend. It fetches enum definitions from a Spring Boot REST endpoint and provides them via React hooks and context.

## Commands

- **Run all checks:** `npm test` (runs lint + TypeScript check + Jest with coverage)
- **Run tests only:** `npm run test:coverage`
- **Run tests in watch mode:** `npm start`
- **Run a single test file:** `npx jest tests/hooks.test.ts`
- **Type check:** `npm run test:ts`
- **Lint:** `npm run lint`
- **Build (compile to lib/):** `npm run tsc`
- **Release:** `npm run release` (builds then runs `np` for npm publish)

## Architecture

The library uses a custom pub/sub service pattern (no Redux/external state) with React hooks for consumption:

1. **config.ts** - Module-scoped singleton holding `Config` (enum URL) and the `EnumsService` instance. `configureEnums()` must be called before anything else.
2. **service.ts** - `makeEnumsService()` creates a lightweight pub/sub store: `subscribe`/`unsubscribe`/`setEnums`/`getState`. Manages `EnumsState<T>` (`{ enums: T }`).
3. **load-enums.ts** - `loadEnums()` fetches enums from the configured URL via `@42.nl/spring-connect`'s `get()` and pushes them into the service.
4. **hooks.tsx** - `useEnums<T>()` subscribes to the service and returns full state. `useEnum<T>(name)` returns a single enum's values or throws `MissingEnumException`.
5. **provider.tsx** - `EnumsProvider` / `EnumsContext` wraps `useEnums` in React context for consumer components.
6. **formUtils.ts** - `filterEnumValues()` and `getEnumsAsPage()` for searching/paginating enum values. Supports both simple string enums and complex enums (`{ code, displayName }`).
7. **models.ts** - Type definitions: `Enums`, `EnumValues`, `EnumValue`, `ComplexEnumType`.

## Key Conventions

- **Peer dependency:** `@42.nl/spring-connect` (>=6.1 <8.0) - provides `get()` for HTTP and `pageOf()` for pagination.
- **100% test coverage required** (branches, functions, lines, statements) - enforced by Jest config.
- **ESLint rule:** `jest/prefer-expect-assertions` is enforced for async test functions (must include `expect.assertions(n)`).
- **Formatting:** Prettier with single quotes, no trailing commas.
- **Pre-commit hook:** Husky runs `lint-staged` (Prettier) on staged files in `src/` and `tests/`.
- **TypeScript strict mode** is enabled. Output targets ES6/CommonJS to `lib/`.
- **Generic type parameter `T`** is used throughout to allow custom enum type definitions beyond the default `Enums` type.
