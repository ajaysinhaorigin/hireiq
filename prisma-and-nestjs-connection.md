# changed db structure

1. Moved prisma and index.ts (prisma.config.ts) file in src
2. created tsconfig.json file
3. Added in package.json file

"main": "dist/index.js",
"types": "dist/index.d.ts",
"type": "module",
"prisma": {
"schema": "src/prisma/schema.prisma"
},
"scripts": {
"generate": "prisma generate --schema=src/prisma/schema.prisma",
"migrate": "prisma migrate dev --schema=src/prisma/schema.prisma",
"build": "tsc -p tsconfig.json"
},

4.
