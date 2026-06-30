# VertexPM

VertexPM is an AI-powered, real-time collaborative kanban and project management platform designed as a production-grade SaaS monorepo.

## Overview

This repository provides a scalable foundation for:
- a Next.js web application,
- a Fastify-based API server,
- a browser extension,
- shared design and validation packages,
- Prisma-based data access,
- CI/CD workflows and documentation.

## Architecture

- **Apps** (`apps/`):
  - [apps/web](file:///d:/VertexPM/apps/web) for the user-facing Next.js experience
  - [apps/server](file:///d:/VertexPM/apps/server) for the backend services and Fastify APIs
  - [apps/extension](file:///d:/VertexPM/apps/extension) for the browser extension shell
- **Shared Packages** (`packages/packages/`):
  - [packages/packages/ui](file:///d:/VertexPM/packages/packages/ui) for shared UI primitives
  - [packages/packages/types](file:///d:/VertexPM/packages/packages/types) for shared domain types
  - [packages/packages/validation](file:///d:/VertexPM/packages/packages/validation) for shared input validation
  - [packages/packages/utils](file:///d:/VertexPM/packages/packages/utils) for reusable helpers
  - [packages/packages/config](file:///d:/VertexPM/packages/packages/config) for workspace defaults
  - [packages/packages/eslint-config](file:///d:/VertexPM/packages/packages/eslint-config) for shared lint rules

## Tech Stack

- Next.js + React + TypeScript
- Fastify + Node.js
- Prisma + PostgreSQL
- Socket.IO + node-cron
- Tailwind CSS + shadcn/ui
- Zod + Pino
- pnpm + Turborepo

## Development Setup

1. Install pnpm if needed.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development workspace:
   ```bash
   pnpm dev
   ```
4. Start individual services:
   - Web: `pnpm dev:web`
   - Server: `pnpm dev:server`
   - Extension: `pnpm dev:extension`

## Testing

VertexPM includes unit and strict E2E API integration testing suites:
- Run tests:
  ```bash
  pnpm --filter server test
  ```

## Repository Structure

- `apps/` for runnable applications
- `packages/` for shared libraries and configuration
- `docs/` for project documentation
- `prisma/` for Prisma setup and migrations
- `docker/` for containerization assets
- `scripts/` for developer utilities
- `.github/` for workflows and templates

## Project Progress & Roadmap

- [x] Scaffold core apps and shared packages
- [x] Add database schema and migrations (Prisma + PostgreSQL)
- [x] Implement real-time collaboration features (Socket.IO)
- [x] Connect AI providers (Gemini / OpenAI API) and background jobs (node-cron)
- [x] Implement enterprise search, advanced filtering, and caching
- [x] Add automated workflow scheduler and real-time events notifications
- [x] Integrate Vitest unit and strict E2E API integration testing suites
- [x] Prepare Railway deployment workflow

