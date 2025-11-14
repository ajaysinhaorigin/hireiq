# steps

cd packages/db

pnpm init
pnpm add prisma @prisma/client
npx prisma init

This will create

packages/db/
├── prisma/
│ └── schema.prisma
├── package.json
├── .env
