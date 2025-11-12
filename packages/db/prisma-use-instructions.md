# 🚀 2️⃣ Generate schema and Prisma client

Run this once to merge all model files and generate Prisma Client:

pnpm run db:generate

✅ This will:

Combine base.prisma + all files in src/prisma/models/ into a new src/prisma/schema.prisma
Generate your Prisma Client (so you can import it in NestJS or scripts)

# 🔄 3️⃣ Apply migrations and create database tables

pnpm run db:migrate

✅ This will:

Merge models again (to be sure)
Run prisma migrate dev and create/alter tables in your PostgreSQL DB

# 💣 4️⃣ (Optional) Reset database completely

If you want to drop everything and start clean:

pnpm run db:reset

✅ This will:

Recreate the schema file
Drop and recreate all tables
Apply all migrations again

# 💡 Use db:reset only when

You’re in development, not production.
You want to start clean (e.g., you changed models and migrations are messy).
You don’t care about losing existing DB data.

# steps

npx prisma migrate reset  
pnpm run db:migrate  
npx prisma migrate dev --name init
pnpm run db:reset     