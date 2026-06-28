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

- Apps:
  - apps/web for the user-facing experience
  - apps/server for backend services and APIs
  - apps/extension for the browser extension shell
- Packages:
  - packages/ui for shared UI primitives
  - packages/types for shared domain types
  - packages/validation for shared input validation
  - packages/utils for reusable helpers
  - packages/config for workspace defaults
  - packages/eslint-config for shared lint rules

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
   - pnpm install
3. Start the development workspace:
   - pnpm dev
4. Start individual services:
   - pnpm dev:web
   - pnpm dev:server
   - pnpm dev:extension

## Repository Structure

- apps/ for runnable applications
- packages/ for shared libraries and configuration
- docs/ for project documentation
- prisma/ for Prisma setup and migrations
- docker/ for containerization assets
- scripts/ for developer utilities
- .github/ for workflows and templates

## Roadmap

- scaffold core apps and shared packages
- add database schema and migrations
- implement real-time collaboration features
- connect AI providers and background jobs
- prepare Railway deployment workflow
