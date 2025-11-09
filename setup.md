/apps
 ├─ client/          # all frontend projects (Next.js)
 │   ├─ web/         # web frontend
 │   ├─ mobile/      # mobile frontend
 │   └─ ...
 ├─ api/                 # all backend projects (NestJS)
 │   ├─ api-hireiq/      # backend
 │   └─ ...
/packages
 ├─ db/                  # Prisma schema & migrations
 ├─ ui/                  # Shared UI components/design system
 ├─ shared/              # Shared DTOs, types, constants
/infra
 ├─ terraform/           # IaC
 ├─ k8s/                 # Deployment configs


## Architectural Style

Recommended:
👉 Modular Monolith with Clean Architecture + Domain-Driven Design (DDD)

## Why?

MVPs launch fast as monoliths.
If/when scale demands, modules (like Transactions or Recommendations) can be pulled into microservices without rewriting.
DDD ensures business logic (e.g., card reward calculations) lives in the domain layer, isolated from framework/infrastructure.

## Layering:
Presentation Layer → Controllers (NestJS), Next.js pages.
Application Layer → Services (orchestration, no business rules).
Domain Layer → Entities, Value Objects, Business Logic (card reward engine, MCC mapping).
Infrastructure Layer → DB, APIs, Message brokers.

## 🔁Reusability & Future-Proofing

Shared Packages: If multiple projects → use a monorepo (Turborepo / Nx) so frontend + backend share models/types.
API-first design: Even if web-first, define APIs cleanly so mobile apps (future) can reuse.
Feature Flags: For rolling out new features (e.g., Gamification later
Analytics: Track KPIs (completion rate, CTR) in a central observability system (PostHog/Segment).

## ✅ This setup ensures:

Maintainable: Clean modules, clear layers.
Scalable: Serverless + modular → handle spikes.
Testable: Unit/E2E setup, contracts.
Reusable: Shared monorepo + API-first.
Fast: Optimized infra (Vercel + managed DBs).


## STEPS: FOR TO CREATE THE REPO

# 🏗️ Step 1. Initialize Monorepo

    mkdir hireiq && cd hireiq
    pnpm init
    pnpm add -D turbo typescript eslint prettier

    update package.json (Add)
    "private": true,
    "packageManager": "pnpm@10.17.0",
    "workspaces": [
        "apps/*",
        "packages/*"
    ],
    "scripts": {
        "dev": "turbo run dev --parallel",
        "build": "turbo run build",
        "lint": "turbo run lint",
        "test": "turbo run test",
        "format": "prettier --write ."
    },


# 2. Create 

1.  turbo.json :

    {
    "$schema": "https://turbo.build/schema.json",
    "pipeline": {
        "build": {
        "dependsOn": ["^build"],
        "outputs": [".next/**", "dist/**"]
        },
        "dev": {
        "cache": false,
        "persistent": true
        },
        "lint": {
        "outputs": []
        },
        "test": {
        "outputs": []
        }
    }
    }

2. pnpm-workspace.yaml

    packages:
  - "apps/*/*"    # all frontend & backend apps - 
  - "packages/*"  # shared libraries


  - "apps/*/*"  this defines the level of apps where we can add node modules like in this case setup should be apps/client/web there will next app with node modules

3. tsconfig.json or tsconfig.base.json

    {
    "compilerOptions": {
        "target": "esnext",
        "module": "esnext",
        "moduleResolution": "node",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "jsx": "preserve",
        "baseUrl": ".",
        "paths": {
        "@hireiq/shared/*": ["packages/shared/src/*"],  ----> path should be exactly same and also the the name @zomint/shared/* - don't messed it up.
        "@hireiq/ui/*": ["packages/ui/src/*"].          ----->
        }
    }
    }


# 🏗️ Step 4. Create a Next.js Web App
    mkdir apps && cd apps
    mkdir web api
    cd web

    pnpm create next-app cardgpt


# 🏗️ Step 5. Create a NestJS API App
    pnpm dlx @nestjs/cli new api-hireiq --package-manager=pnpm or npx @nestjs/cli new <project-name> or pnpm dlx @nestjs/cli new . --skip-install (if files and folders ar not visible)
    cd api-cardgpt


# To Setup packages folder
    packages/
    ├─ shared/    # DTOs, types, constants
    ├─ ui/        # Shared UI components (for frontend)
    ├─ auth/      # Shared auth utilities
    ├─ db/        # Prisma client / DB logic
    └─ jobs/      # Queue / background jobs

    And 

        package-name/
    ├─ package.json
    ├─ tsconfig.json
    └─ src/
        └─ index.ts

    ------------->

# step to setup packages folder

    mkdir packages && cd packages
    mkdir shared ui db

    cd db
    pnpm prisma init
    pnpm prisma migrate dev --name init
    pnpm prisma generate

    cd ui
    mkdir src
    
    create package.json with name that metioned in the tsconfig.json path (must contain these two files package.json and tsconfi.json)

    {
    "name": "@hireiq/ui",              -------- name should be same with the root level tsconfig 
    "version": "1.0.0",
    "main": "dist/index.js",
    "types": "dist/index.d.ts",
    "scripts": {
        "build": "tsc -p tsconfig.json --outDir dist",
        "dev": "tsc -w -p tsconfig.json --outDir dist"
    },
    "peerDependencies": {
        "react": ">=18.0.0",            -----------> need to install these dependencies to use jsx components in the ui
        "react-dom": ">=18.0.0"         -----------> # From repo root pnpm add -Dw react @types/react
    },
    "devDependencies": {
        "@types/react": "^19.1.13",     ----------->
        "@types/react-dom": "^19.1.9",  ----------->
        "react": "^19.1.0",             ----------->
        "react-dom": "^19.1.0",         ----------->
        "typescript": "^5.9.2"          ----------->
    }
    }

    And tsconfig.json with this

    {
    "extends": "../../tsconfig.base.json",   -----> tsconfig root file path
    "compilerOptions": {
        "outDir": "dist",
        "jsx": "react-jsx",       // <-- Add this line to remove the jsx error
        "declaration": true,        
        "emitDeclarationOnly": false
    },
    "include": ["src"]
    }


## To use packages folder ui components and shared files inside the web and api folder 

1. Add the right path inside tsconfig.json inside web/cardgpt or api/api-cardgpt and similar for other apps

    "paths": {
      "@/*": ["./src/*"],
      "@hireiq/shared": ["../../../packages/shared/src"],
      "@hireiq/ui": ["../../../packages/ui/src"]
    }

