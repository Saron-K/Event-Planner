import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export function UploadImage(folder: string) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('image', {
        storage: diskStorage({
          destination: `./uploads/${folder}`,
          filename: (req, file, cb) => {
            const uniqueName = Date.now() + '-' + file.originalname;
            cb(null, uniqueName);
          },
        }),
      }),
    ),
  );
}
