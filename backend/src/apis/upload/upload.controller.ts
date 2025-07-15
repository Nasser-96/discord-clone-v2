import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FastifyFileInterceptor } from './fastify-file-interceptor';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/helper/file-upload-util';
import { UploadService } from './upload.service';

@Controller('upload')
@ApiTags('Upload File ')
export class UploadController {
  constructor(private readonly uploadFileService: UploadService) {}

  @ApiConsumes('multipart/form-data')
  @Post('')
  @UseInterceptors(
    FastifyFileInterceptor('image', {
      storage: diskStorage({
        destination: './uploaded/images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadFile(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    return this.uploadFileService.uploadFile(req, file);
  }
}
