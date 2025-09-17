# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation

**IMPORTANT**: Before working on this project, read the following documentation files for complete context:

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) - Complete technical architecture, stack, and project structure
- [`docs/SPEC.md`](docs/SPEC.md) - Functional specifications, user stories, and workflows  
- [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) - Development conventions, code style, and contribution guidelines
- [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md) - Testing strategy, TDD approach, and coverage requirements
- [`docs/GIT_FLOW.md`](docs/GIT_FLOW.md) - Git branching strategy, pull request process, and release process 

## Workflow Guidelines

- Toujours se référer aux fichiers de @docs\ avant de faire quoi que ce soit 

## Quick Reference

**Project**: Chrome extension for intelligent tab management (React + TypeScript)

**Testing**: TDD required - write tests first, use Vitest + React Testing Library

**Commands** (likely):
- `npm run dev` - Development build
- `npm run build` - Production build  
- `npm run test` - Run tests (Vitest)
- `npm run lint` - ESLint
- `npm run typecheck` - TypeScript checking

**Key Conventions**:
- Feature-based architecture (`features/tabManager/`)
- Stateless components, pure functions in lib/utils
- TypeScript strict mode, no `any`
- Chrome APIs: tabs, storage, runtime