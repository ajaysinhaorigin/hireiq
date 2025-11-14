import { MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

// Improved multer config:
export const multerConfig: MulterModuleOptions = {
  storage: diskStorage({
    destination: './public/temp',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(null, `${uniqueSuffix}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, callback) => {
    // Add file type validation if needed
    callback(null, true);
  },
};

// import { Module } from '@nestjs/common';
// import { MulterModule } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';

// @Module({
//   imports: [
//     MulterModule.register({
//       storage: diskStorage({
//         destination: './public/temp',
//         filename: (req, file, cb) => {
//           cb(null, file.originalname);
//         },
//       }),
//     }),
//   ],
// })
// export class AppModule {}
