# Steps

1. install Docker Desktop on Mac
2. Verify it installed

- Open your terminal and run:
- It will show Docker version 27.x.x, build ...

# 🧱 Step 2 — Pull the PostgreSQL image
Docker uses “images” (blueprints for containers).
Run this in your terminal:

- docker pull postgres

# 🧩 Step 3 — Run PostgreSQL container
Now, let’s create and run your own database container:

docker run --name hireiq-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=hireiq_db \
  -p 5432:5432 \
  -d postgres


✅ Verify it’s running:

- docker ps


You should see:

CONTAINER ID   IMAGE      COMMAND                  STATUS         PORTS
xxxxxx         postgres   "docker-entrypoint..."   Up ...         0.0.0.0:5432->5432/tcp


# 🧠 Step 4 — (Optional) Check logs

docker logs hireiq-db

You’ll see lines showing PostgreSQL starting successfully.

# Add DATABASE_URL as env variable in .env file 

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hireiq_db?schema=public"

# 🧩 Step 5 — Test your connection

Install the PostgreSQL CLI (psql) if you don’t have it:

brew install libpq
brew link --force libpq

Then connect:

psql -h localhost -U postgres -d hireiq_db

Enter password : postgres

✅ You’re inside your DB if you see:
hireiq_db=#

Type \q to exit.

## steps to run 

1. first

# List running containers
docker ps

# Stop a container
docker stop hireiq-db

# Start a container
docker start hireiq-db

# Remove a container (careful: deletes data unless volumes used)
docker rm hireiq-db

# See logs
docker logs hireiq-db

2. second 

# Install CLI if not installed
brew install libpq
brew link --force libpq

# Connect to DB
psql -h localhost -U postgres -d hireiq_db

Then you can run SQL commands:

-- Check tables
\dt

-- Exit
\q


# 3️⃣ Prisma

What Prisma is:
An ORM (Object Relational Mapper) for Node.js/TypeScript.
Lets you interact with your database using JavaScript/TypeScript instead of raw SQL.

How it works:

You define your models in schema.prisma.
Run npx prisma generate → generates PrismaClient.
Use PrismaClient in your app to read/write data.

Commands

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Open Prisma Studio (web GUI to view DB)
npx prisma studio


# 1️⃣ npx prisma generate

Purpose:
Generates the Prisma Client — the auto-generated JavaScript/TypeScript client you use to interact with your database.
Think of it as building a library based on your schema.prisma models so you can call prisma.user.create(), prisma.user.findMany(), etc.

When to run:
After changing schema.prisma (adding or modifying models).
Before using Prisma in your code (first time).

# 2️⃣ npx prisma migrate dev --name init

Purpose:
Runs a database migration:
Creates tables in your database based on schema.prisma.
Keeps track of migrations in the prisma/migrations folder.
The --name init part gives a name to this migration (“init” for initial setup).

When to run:
After defining your Prisma models.
Every time you change the schema (add a model, change a field).

What happens:
Creates a SQL migration file in prisma/migrations.
Applies it to your database (creates/updates tables).
Updates the prisma client (sometimes automatically)

# ✅ Typical workflow

pnpm add prisma @prisma/client → install Prisma.
npx prisma init → creates schema.prisma and .env.
Define your models in schema.prisma.
npx prisma migrate dev --name init → create tables in DB.
npx prisma generate → generate Prisma Client.
Use PrismaClient in your code.
If you change the schema later → repeat migrate → generate.