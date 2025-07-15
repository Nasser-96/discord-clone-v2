import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import ReturnResponse from 'src/helper/returnResponse';

@Injectable()
export class UploadService {
  uploadFile(req: Request, file: Express.Multer.File) {
    console.log();

    if (!file?.filename) {
      throw new BadRequestException(
        ReturnResponse({
          is_successful: false,
          error_msg: 'No file uploaded.',
        }),
      );
    }
    const image_url = `${req.protocol}://${req.headers.host}/${file.path}`;
    return ReturnResponse({
      is_successful: true,
      response: { image_url: image_url },
    });
  }
}
